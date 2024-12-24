import { ChatInputCommandInteraction } from 'discord.js'
import { CommandConfig, CommandOptions, CommandResult } from 'robo.js'
import { BirthdayState } from '~/utils/bday/state'

export const config: CommandConfig = {
	description: 'Add a Birthday to the GREAT BDAY REPOSITORY',
	options: [
		{
			name: 'user',
			description: '@Username to delete',
			type: 'user',
			required: true
		}
	]
}

export default (interaction: ChatInputCommandInteraction, options: CommandOptions<typeof config>): CommandResult => {
	const { user } = options
	if (!user) {
		interaction.reply({ content: 'Invalid User', ephemeral: true })
		return
	}

	if (interaction.guild === null) {
		interaction.reply({ content: 'This Command Only Works in a Server!', ephemeral: true })
		return
	}
	const state = new BirthdayState(interaction.guild)

	if (!state.has(user)) {
		interaction.reply({ content: `No Birthday Found for ${user}`, ephemeral: true })
	}

	state.delete(user)
	interaction.reply({
		content: `Birthday Deleted for ${user}`,
		ephemeral: true
	})
}