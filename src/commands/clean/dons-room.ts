import { ChatInputCommandInteraction } from 'discord.js'
import { CommandConfig } from 'robo.js'

export const config: CommandConfig = {
	description: "Clean Don's Room"
}

const paymentUrl =
	'https://venmo.com/?txn=pay&audience=private&recipients=Don-Aliff&amount=4.20&note=4%20Room%20Cleaning'
export default (interaction: ChatInputCommandInteraction) => {
	const content = `||${paymentUrl}||`
	interaction.reply({ content, ephemeral: true })
}
