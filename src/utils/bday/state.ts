import { State } from 'robo.js'
import { DateTime } from 'luxon'
import { Guild, User } from 'discord.js'

const { getState, setState } = State.fork(`dadbot-birthday-list`, { persist: true })
export class BirthdayState {
	constructor(public guild: Guild) {}

	isValidDate(date: string) {
		return this.parseDateString(date).isValid
	}

	parseDateString(date: string) {
		return DateTime.fromFormat(date, 'M/d/yyyy')
	}

	formatToShortform(date: string) {
		return this.parseDateString(date).toFormat('MMM dd')
	}

	delete(user: User) {
		const newList = this.rawList

		delete newList[user.id]
		setState(this.ListKey, JSON.stringify(newList), { persist: true })
	}

	has(user: User) {
		return !!this.rawList[user.id]
	}

	set(user: User, date: string) {
		const newList = {
			...this.rawList,
			[user.id]: date
		}

		setState(this.ListKey, JSON.stringify(newList), { persist: true })
	}

	setChannelId(channelId: string) {
		setState(this.ChannelKey, channelId, { persist: true })
	}

	get channelId() {
		return getState(this.ChannelKey)
	}

	get channel() {
		return this.channelId ? this.guild.channels.cache.get(this.channelId) : null
	}

	get list() {
		return Object.entries(this.listByDate).sort(([a], [b]) => {
			return DateTime.fromFormat(a, 'MMM dd') > DateTime.fromFormat(b, 'MMM dd') ? -1 : 1
		})
	}

	get birthdaysToday() {
		const dateKey = this.formatToShortform(DateTime.now().toFormat('M/d/yyyy'))
		return this.listByDate[dateKey] || []
	}

	private get listByDate() {
		return Object.entries(this.rawList).reduce((acc: Record<string, string[]>, [userId, date]) => {
			const dateKey = this.formatToShortform(date)
			const currentDate = acc[dateKey] || []
			acc[dateKey] = [...currentDate, userId]
			return acc
		}, {})
	}

	get rawList(): Record<string, string> {
		return JSON.parse(getState(this.ListKey) || '{}')
	}

	private get ListKey() {
		return `@dadbot-birthday-list${this.guild.id}`
	}
	private get ChannelKey() {
		return `@dadbot-birthday-channel#${this.guild.id}`
	}
}
