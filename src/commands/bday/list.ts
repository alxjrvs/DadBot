import type { ChatInputCommandInteraction } from 'discord.js'
import type { CommandConfig, CommandResult } from 'robo.js'
import { BirthdayState } from '~/utils/bday/state'

export const config: CommandConfig = {
	description: 'Get A list of Upcoming Birthdays'
}

export default async (interaction: ChatInputCommandInteraction): Promise<CommandResult> => {
	if (interaction.guild === null) {
		interaction.reply({ content: 'This Command Only Works in a Server!', ephemeral: true })
		return
	}

	const state = new BirthdayState(interaction.guild)
	await interaction.deferReply({ ephemeral: true })
	try {
		await interaction.guild?.members.fetch()
		const members = interaction.guild.members.cache

		const content =
			state.list
				.map(([date, userIds], index) => {
					const content = `${date} - ${members.filter((member) => userIds.includes(member.id)).toJSON()}`
					return index === 0 ? `**${content}**\n` : content
				})

				.join('\n') || 'No Birthdays Registered! Use `/bday add` to add one!'
		await interaction.editReply({ content })
	} catch {
		await interaction.editReply({ content: 'Error Fetching Birthdays. Please try again.' })
	}
}
