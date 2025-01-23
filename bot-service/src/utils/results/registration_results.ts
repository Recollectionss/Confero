import { ComponentType, Message, TextChannel, User as DiscordUser } from 'discord.js';
import { TARGET_VOTES, TIME_TO_VOTE } from '../../constants/constants';
import { User } from '../../db/models';
import { MailOptionsInterface, sendMail } from '../send_mail';
import { ENV_CONSTANTS } from '../../constants/env_constants';
import { RegistrationOnMeeting } from '../../db/models';
import { Meeting } from '../../db/models/meeting';
import { Op } from 'sequelize';

export const registrationResults = async (message: Message, meeting: Meeting) => {
  const collector = message.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: TIME_TO_VOTE,
  });

  collector.on('collect', async (collected) => {
    const discordUser: DiscordUser = collected.user;
    const user = await User.findByPk(discordUser.id);
    if (!user) {
      await collected.reply({ content: 'У вас немає прав для реєстрації', ephemeral: true });
      return;
    }
    const tokenExist = await RegistrationOnMeeting.findOne({
      where: { userId: user.userId, meetingId: meeting.meetingId },
    });
    if (tokenExist) {
      await collected.reply({ content: 'Ви вже почали реєстрацію.', ephemeral: true });
      return;
    }
    const token = await RegistrationOnMeeting.create({ userId: discordUser.id, meetingId: meeting.meetingId });

    // const mail: MailOptionsInterface = {
    //   to: user?.email as string,
    //   subject: user?.name as string,
    //   from: ENV_CONSTANTS.smtp.user as string,
    //   text: token.token,
    // };
    // await sendMail(mail);

    await getTokenFromDMChannel(discordUser);

    await (message.channel as TextChannel).send(
      'Натисніть кнопку для отримання токена і введіть його у вашому особистому чаті з ботом.',
    );
  });

  collector.on('end', async () => {
    await getAllNotRegisteredUsers(meeting);
    let result: string = 'Результати реєстрації: \n';

    try {
      const registrations = await RegistrationOnMeeting.findAll({
        where: { meetingId: meeting.meetingId },
        include: [
          {
            model: User,
            as: 'User',
            attributes: ['name'],
          },
        ],
      });

      const registeredUsers = registrations.filter((user) => user.userVerified);
      const kvorum = TARGET_VOTES - registeredUsers.length < registeredUsers.length;
      const minTargetVotes =
        registeredUsers.length % 2 === 1 ? registeredUsers.length / 2 : registeredUsers.length / 2 + 1;

      if (kvorum) {
        result += `Всього зареєстровано ${registrations.length} \nКворум - ${kvorum ? 'є' : 'немає'} \n`;
        result += `Мінімальна кількість голосів для прийняття рішення: ${minTargetVotes} \n`;
      } else {
        result += `Всього зареєстровано ${registrations.length} \nКворум - немає \n`;
      }

      registrations.forEach((registration) => {
        const user = registration.User;
        if (user) {
          result += `${user.name} - ${registration.userVerified ? 'Зареєстрований' : 'Незареєстрований'} \n`;
        } else {
          console.log('Користувач не знайдений для реєстрації.');
        }
      });
      await (message.channel as TextChannel).send(result);
      await Meeting.destroy({ where: { isActive: true } });
    } catch (error) {
      console.log('Помилка під час отримання реєстрацій:', error);
    }
  });
};

const getTokenFromDMChannel = async (discordUser: DiscordUser) => {
  const dmChannel = discordUser.dmChannel || (await discordUser.createDM());

  if (!dmChannel) {
    throw new Error('Невдалось знайти або створити канал для особистого повідомлення');
  }

  await dmChannel.send('Надсилайте код сюди.');

  const dmCollector = dmChannel.createMessageCollector({
    time: TIME_TO_VOTE,
  });

  dmCollector.on('collect', async (dmMessage) => {
    if (!dmMessage.author.bot) {
      const userToken = dmMessage.content;

      try {
        const registration = await RegistrationOnMeeting.findOne({
          where: { userId: discordUser.id, token: userToken },
        });

        if (registration?.userVerified) {
          await dmChannel.send('Ви вже зареєстровані.');
          return;
        }

        if (registration) {
          await dmChannel.send('✅ Токен підтверджено! Ви зареєстровані.');
          registration.userVerified = true;
          await registration.save();
          dmCollector.stop();
        } else {
          await dmChannel.send('❌ Невірний токен. Спробуйте ще раз.');
        }
      } catch (error: any) {
        console.log(error);
        await dmChannel.send('⚠️ Виникла помилка. Спробуйте пізніше.');
      }
    }
  });

  dmCollector.on('end', (collected) => {
    if (collected.size === 0) {
      discordUser.send('⏱️ Час очікування вичерпано. Спробуйте ще раз.');
    }
  });
};

const getAllNotRegisteredUsers = async (meeting: Meeting) => {
  try {
    const registeredUserIds = await RegistrationOnMeeting.findAll({
      where: { meetingId: meeting.meetingId },
      attributes: ['userId'],
    }).then((users) => users.map((user) => user.userId));

    const nonRegisteredUsers = await User.findAll({
      where: {
        userId: {
          [Op.notIn]: registeredUserIds,
        },
      },
    });

    const newRegistrations = nonRegisteredUsers.map((user) => ({
      meetingId: meeting.meetingId,
      userId: user.userId,
    }));

    await RegistrationOnMeeting.bulkCreate(newRegistrations);
  } catch (error) {
    console.error('Error registering users:', error);
    throw error; // Прокинути помилку для подальшої обробки
  }
};
