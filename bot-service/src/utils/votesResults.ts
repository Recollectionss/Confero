import {TARGET_VOTES, TIME_TO_VOTE} from "constansts/constans";
import {ComponentType} from "discord.js";

export const votesResults = async (pollChannel,pollMessage) => {
    let votes = { for: 0, against: 0, abstain: 0 };
    let totalVotes = 0;
    const voters = new Map();

    const collector = pollMessage.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: TIME_TO_VOTE,
    });

    collector.on('collect', interaction => {
        const userId = interaction.user.id;
        const vote = interaction.customId;

        if (voters.has(userId)) {
            const userVote = voters.get(userId);
            votes[vote] += 1;
            votes[userVote.now] -= 1;
            userVote.now = vote;

            interaction.reply({ content: `Ви змінили голос на: ${interaction.component.label}`, ephemeral: true });
            return;
        }

        voters.set(userId, { now: vote });

        if (votes.hasOwnProperty(vote)) {
            votes[vote]+=1;
            totalVotes++;
            interaction.reply({ content: `Ваш голос за: ${interaction.component.label}`, ephemeral: true });

            if (totalVotes >= TARGET_VOTES) {
                collector.stop('vote_target_reached');
            }
        }
    });

    collector.on('end', (collected, reason) => {
        let resultMessage = '';

        resultMessage = `Результати голосування:\nЗА: ${votes.for}\nПроти: ${votes.against}\nУтримуюсь: ${votes.abstain}\n \n`;
        if (totalVotes < 6) {
            resultMessage += 'Рішення не прийнято недостатня кількість голосів';
            pollChannel.send(resultMessage)
            return;
        }

        if (reason === 'vote_target_reached') {
            if (votes.for === totalVotes) {
                resultMessage += `Єдиноголосно ЗА — рішення прийнято.`;
            } else if (votes.against === totalVotes) {
                resultMessage += `Єдиноголосно ПРОТИ — рішення не прийнято.`;
            }
            else if (votes.abstain === totalVotes) {
                resultMessage += `Єдиноголосно УТРИМУЮСЬ — рішення не прийнято.`;
            }

            pollChannel.send(resultMessage)
            return;
        }

        if (votes.for > (votes.against + votes.abstain)) {
            resultMessage += 'Рішення прийнято.';
        } else {
            resultMessage += 'Рішення не прийнято.';
        }

        pollChannel.send(resultMessage);
    });
}