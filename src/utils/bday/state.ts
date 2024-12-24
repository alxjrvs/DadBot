import { State } from 'robo.js'
import { DateTime } from 'luxon'
import { Guild, User } from 'discord.js'

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
		this.state.setState(BirthdayState.ListKey, JSON.stringify(newList), { persist: true })
	}

	has(user: User) {
		return !!this.rawList[user.id]
	}

	set(user: User, date: string) {
		const newList = {
			...this.rawList,
			[user.id]: date
		}

		this.state.setState(BirthdayState.ListKey, JSON.stringify(newList), { persist: true })
	}

	get list() {
		return Object.entries(this.listByDate()).sort(([a], [b]) => {
			return DateTime.fromFormat(a, 'MMM dd') < DateTime.fromFormat(b, 'MMM dd') ? -1 : 1
		})
	}

	private listByDate() {
		return Object.entries(this.rawList).reduce((acc: Record<string, string[]>, [userId, date]) => {
			const dateKey = this.formatToShortform(date)
			const currentDate = acc[dateKey] || []
			acc[dateKey] = [...currentDate, userId]
			return acc
		}, {})
	}

	get rawList(): Record<string, string> {
		return JSON.parse(this.state.getState(BirthdayState.ListKey) || '{}')
	}

	get state() {
		return State.fork(`birthday-${this.guild.id}`)
	}

	static ListKey: '@dadbot-birthday-list'
}
