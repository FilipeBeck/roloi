import { Alert } from 'react-native'
import Sound from 'react-native-sound'

export async function loadSound(path: any): Promise<Sound> {
	return new Promise((resolve, reject) => {
		const sound = new Sound(path, error => {
			if (error) {
				reject(error)
			}
			else {
				resolve(sound)
			}
		})
	})
}

export async function playSound(soundPromise: Promise<Sound>): Promise<void> {
	try {
		const sound = await soundPromise

		sound.stop()
		sound.play()
	}
	catch (error) {
		Alert.alert('Erro ao carregar áudio', JSON.stringify(error.message || JSON.stringify(error)))
	}
}