import type { Config } from 'robo.js'

export default <Config>{
	clientOptions: {
		intents: ['Guilds', 'GuildMessages', 'GuildMembers']
	},
	plugins: [],
	type: 'robo'
}
