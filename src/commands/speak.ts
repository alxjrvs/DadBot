import { CommandConfig } from 'robo.js'
import { Voicebox } from '~/utils/voicebox'

export const config: CommandConfig = {
	description: 'Speak with the dadBot.'
}

export default () => Voicebox.say()
