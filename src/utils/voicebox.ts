import { roll } from 'randsum'

export class Voicebox {
	static sayings = ['Sure, why not?', 'I understand.', 'Sounds good.', 'Okay.', 'Thanks for coming.']
	static say = () => roll({ sides: this.sayings }).result[0]
}
