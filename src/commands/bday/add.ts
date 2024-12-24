import type { ChatInputCommandInteraction, User } from 'discord.js'
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
	const date = options.date
	const user = options.user as User | undefined
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

	const settingOwnUser = user.id === interaction.user.id

	if (state.has(user) && !settingOwnUser) {
		interaction.reply({
			content: `Birthday already registered for ${user}. Consider using \`/delete\`.`,
			ephemeral: true
		})
	}

	state.set(user, date)
	const content = `Birthday Added for ${user} on ${date}`
	interaction.reply({ content, ephemeral: true })
}
