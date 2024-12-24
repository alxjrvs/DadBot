import { ChatInputCommandInteraction, User } from 'discord.js'
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
	const user = options.user as User | undefined
	if (!user) {
		interaction.reply({ content: 'Invalid User', ephemeral: true })
		return
	}

	if (interaction.guild === null) {
		interaction.reply({ content: 'This Command Only Works in a Server!', ephemeral: true })
		return
	}

	const state = new BirthdayState(interaction.guild)

	const settingOwnUser = user.id === interaction.user.id
	if (!settingOwnUser) {
		interaction.reply({ content: 'You can only delete your own birthday', ephemeral: true })
		return
	}

	if (!state.has(user)) {
		interaction.reply({ content: `No Birthday Found for ${user}`, ephemeral: true })
		return
	}

	state.delete(user)
	interaction.reply({
		content: `Birthday Deleted for ${user}`,
		ephemeral: true
	})
}
