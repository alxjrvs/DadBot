import { State } from 'robo.js'
import { DateTime } from 'luxon'
import { Guild } from 'discord.js'

function onlyUnique(value: string, index: number, array: string[]) {
	return array.indexOf(value) === index
}

export class BirthdayState {
	constructor(public guild: Guild) {}

	isValidDate(date: string) {
		return this.parseDate(date).isValid
	}

	parseDate(date: string) {
		return DateTime.fromFormat(date, 'M/dd/yyyy')
	}

	delete(user: string) {
		const newList = this.rawList

		delete newList[user]
		this.state.setState(BirthdayState.ListKey, JSON.stringify(newList), { persist: true })
	}

	has(user: string) {
		return !!this.rawList[user]
	}

	set(userId: string, date: string) {
		const newList = {
			...this.rawList,
			[userId]: date
		}

		this.state.setState(BirthdayState.ListKey, JSON.stringify(newList), { persist: true })
	}

	get list(): [string, string][] {
		return Object.entries(this.rawList).map(([userId, date]) => [
			userId,
			DateTime.fromFormat(String(date), 'M/dd/yyyy').toFormat('MMMM d')
		])
	}

	get rawList(): Record<string, string[]> {
		return JSON.parse(this.state.getState(BirthdayState.ListKey) || '{}')
	}

	get state() {
		return State.fork(`birthday-${this.guild.id}`)
	}

	static ListKey: '@dadbot-birthday-list'
}
