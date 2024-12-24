import type { ChatInputCommandInteraction } from 'discord.js'
import type { CommandConfig, CommandResult } from 'robo.js'
import { BirthdayState } from '~/utils/bday/state'

export const config: CommandConfig = {
	description: 'Get A list of Upcoming Birthdays'
}

export default (interaction: ChatInputCommandInteraction): CommandResult => {
	if (interaction.guild === null) {
		interaction.reply({ content: 'This Command Only Works in a Server!', ephemeral: true })
		return
	}

	const state = new BirthdayState(interaction.guild)
	const content =
		state.list
			.map(([userId, date]) => {
				const user = interaction?.guild?.members.cache.get(userId)
				return `${user?.nickname ?? userId} - ${date}`
			})
			.join('\n') || 'No Birthdays Registered! Use `/bday add` to add one!'
	interaction.reply({ content, ephemeral: true })
}
