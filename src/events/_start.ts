import { Cron } from '@robojs/cron'
import { Client } from 'discord.js'

export default (client: Client) => {
	return Cron('* * * * *', () => {
		console.log('Hello World!')
		// const channel = client.channels.cache.find(channel => channel === 'general')
		// console.log('channel' + channel)
		// channel?.isSendable() && channel.send('Hello World!')
	})
}
