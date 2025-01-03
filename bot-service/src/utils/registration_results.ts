import { ComponentType, Message, TextChannel } from 'discord.js';
import { TIME_TO_VOTE } from '../constants/constants';
import { User } from '../db/models/user';
import { RegistrationToken } from '../db/models/registration_token';
import { MailOptionsInterface, sendMail } from './send_mail';
import { ENV_CONSTANTS } from '../constants/env_constants';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const registrationResults = async (message: Message, channel: TextChannel) => {
  const tokenSendCollector = message.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: TIME_TO_VOTE,
  });

  tokenSendCollector.on('collect', async (collected) => {
    const userId: string = collected?.user?.id;
    const user = await User.findByPk(userId);
    try {
      const token = await RegistrationToken.create({ userId });

      const mail: MailOptionsInterface = {
        to: user?.email as string,
        subject: user?.name as string,
        from: ENV_CONSTANTS.smtp.user as string,
        text: token.token,
      };
      await sendMail(mail);
    } catch (error: any) {
      console.log(error);
    }
  });
  const tokenGetMessage = await channel.send({
    content: 'Введіть реплаєм на це повідомлення код, який прийшов на вашу КНУ пошту',
  });

  const filter = (reply: Message) => reply.reference?.messageId === tokenGetMessage.id;
  const tokenGetCollector = channel.createMessageCollector({
    filter,
    time: TIME_TO_VOTE,
  });

  tokenGetCollector.on('collect', async (reply) => {
    const userId = reply.author.id;
    const userToken = reply.content;

    try {
      const registrationToken = await RegistrationToken.findOne({ where: { userId, token: userToken } });

      if (registrationToken) {
        await reply.reply('Токен підтверджено! Ви зареєстровані.');
        await registrationToken.destroy();
      } else {
        await reply.reply('Невірний токен. Спробуйте ще раз.');
      }
    } catch (error: any) {
      console.log(error);
      await reply.reply('Виникла помилка. Спробуйте пізніше.');
    }
  });

  tokenGetCollector.on('end', (collected) => {
    if (collected.size === 0) {
      channel.send('Час очікування вичерпано. Спробуйте ще раз.');
    }
  });
};
