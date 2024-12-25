import type { ChatInputCommandInteraction } from 'discord.js'
import type { CommandConfig, CommandResult } from 'robo.js'
import { BirthdayState } from '~/utils/bday/state'

export const config: CommandConfig = {
	description: 'Set the channel to announce Birthdays in'
}

export default (interaction: ChatInputCommandInteraction): CommandResult => {
	if (interaction.guild === null) {
		interaction.reply({ content: 'This Command Only Works in a Server!', ephemeral: true })
		return
	}

	if (interaction.channel === null || !interaction.channel.isSendable() || !interaction.channel.isTextBased()) {
		interaction.reply({
			content: 'This Command can only be run in a text channel that the bot can send messages in. Try another channel!',
			ephemeral: true
		})
		return
	}

	const state = new BirthdayState(interaction.guild)
	if (state.channelId) {
		interaction.reply({
			content: 'Birthday Channel already set!',
			ephemeral: true
		})
		return
	}

	state.setChannelId(interaction.channel.id)
	const content = `Birthday Announcements will now arrive in ${interaction.channel}!`
	interaction.reply({ content, ephemeral: true })
}
