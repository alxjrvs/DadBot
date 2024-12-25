import { Cron } from '@robojs/cron'
import { Client } from 'discord.js'
import { BirthdayState } from '~/utils/bday/state'

const EVERY_DAY_AT_10AM = '0 10 * * *'
const EVERY_5_SECONDS = '*/5 * * * * *'

export default (client: Client) => {
	return Cron(EVERY_DAY_AT_10AM, () => {
		client.guilds.cache.forEach(async (guild) => {
			const state = new BirthdayState(guild)

			if (!state.channelId) {
				return
			}

			await client.channels.fetch(state.channelId)

			const channel = client.channels.cache.get(state.channelId)

			if (!channel || !channel.isSendable()) {
				return
			}

			const birthdaysToday = state.birthdaysToday

			if (birthdaysToday.length === 0) {
				return
			}

			await guild.members.fetch()

			birthdaysToday.forEach((userId) => {
				const user = guild.members.cache.get(userId)
				if (!user) {
					return
				}

				channel.send(`Happy Birthday ${user}! 🎉`)
			})
		})
	})
}
