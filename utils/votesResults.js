import {TARGET_VOTES, TIME_TO_VOTE} from "../constansts/constans.js";
import {ComponentType} from "discord.js";

export const votesResults = (pollChannel,pollMessage) => {
    let votes = { for: 0, against: 0, abstain: 0 };
    let totalVotes = 0;
    const voters = new Set();

    const collector = pollMessage.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: TIME_TO_VOTE,
    });

    collector.on('collect', interaction => {
        const userId = interaction.user.id;
        const vote = interaction.customId;

        if (voters.has(userId)) {
            interaction.reply({ content: "Ви вже проголосували!", ephemeral: true });
            return;
        }

        voters.add(userId);

        if (vote in votes) {
            votes[vote]++;
            totalVotes++;
            interaction.reply({ content: `Ваш голос за: ${interaction.component.label}`, ephemeral: true });

            if (totalVotes >= TARGET_VOTES) {
                collector.stop('vote_target_reached');
            }
        }
    });

    collector.on('end', (collected, reason) => {
        let resultMessage = '';

        if (reason === 'vote_target_reached') {
            if (votes.for === totalVotes) {
                resultMessage = `Єдиноголосно ЗА — рішення прийнято.`;
            } else if (votes.against === totalVotes) {
                resultMessage = `Єдиноголосно ПРОТИ — рішення не прийнято.`;
            } else {
                resultMessage = `Результати голосування:\nЗА: ${votes.for}\nПроти: ${votes.against}\nУтримуюсь: ${votes.abstain}\n`;

                if (votes.for > votes.against) {
                    resultMessage += 'Рішення прийнято.';
                } else {
                    resultMessage += 'Рішення не прийнято.';
                }
            }
        } else {
            if (totalVotes === 0) {
                resultMessage = 'Рішення не прийнято';
            } else {
                resultMessage = `Результаты голосования (время вышло):\nЗА: ${votes.for}\nПроти: ${votes.against}\nУтримуюсь: ${votes.abstain} \n \n`;

                if (votes.for > votes.against) {
                    resultMessage += 'Рішення прийнято.';
                } else {
                    resultMessage += 'Рішення не прийнято.';
                }
            }
        }

        pollChannel.send(resultMessage);
    });
}