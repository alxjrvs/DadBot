import type { ChatInputCommandInteraction } from 'discord.js'
import type { CommandConfig, CommandOptions, CommandResult } from 'robo.js'
import { BirthdayState } from '~/utils/bday/state'

export const config: CommandConfig = {
	description: 'Add a Birthday to the GREAT BDAY REPOSITORY',
	options: [
		{
			name: 'user',
			description: '@Username to add',
			type: 'user',
			required: true
		},
		{
			name: 'date',
			description: 'The Birthday! MM/DD/YYYY format',
			type: 'string',
			required: true
		}
	]
}

export default (interaction: ChatInputCommandInteraction, options: CommandOptions<typeof config>): CommandResult => {
	const { user, date } = options
	if (!user) {
		interaction.reply({ content: 'Invalid User', ephemeral: true })
		return
	}
	if (!date) {
		interaction.reply({ content: 'Invalid Date', ephemeral: true })
		return
	}

	if (interaction.guild === null) {
		interaction.reply({ content: 'This Command Only Works in a Server!', ephemeral: true })
		return
	}
	const state = new BirthdayState(interaction.guild)

	if (!state.isValidDate(date)) {
		interaction.reply({ content: `#${date}# is not a valid date of format MM/DD/YYYY`, ephemeral: true })
		return
	}

	state.set(user, date)
	const content = `Birthday Added for ${user} on ${date}`
	interaction.reply({ content, ephemeral: true })
}
