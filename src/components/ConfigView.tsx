import Layout from './ConfigView.layout'
import React, { useMemo, useCallback, useState } from 'react'
import { View, Text, TimePickerAndroid, TouchableNativeFeedback, Image, Animated, TouchableWithoutFeedback } from 'react-native'
import DialogPicker from 'react-native-android-dialog-picker'
import I18n from 'i18n-js'
import { loadSound, playSound } from '../lib'

const startStopSound = loadSound(require('./assets/start-stop.wav'))

I18n.translations = {
	'en_US': {
		cancel: 'Cancel'
	},
	'pt_BR': {
		cancel: 'Cancelar'
	}
}

export const ConfigView: React.FC<ConfigView.Props> = props => {
	const { clock, playing, onChangeTime, onChangeIncrement, onPlay, onStop } = props
	
	const serializedTime = useMemo(() => (
		(clock.hours >= 10 ? clock.hours : '0' + clock.hours) + ':' + (clock.minutes >= 10 ? clock.minutes : '0' + clock.minutes)
	), [clock.hours, clock.minutes])
	const isZeroTime = useMemo(() => !clock.hours && !clock.minutes, [clock.hours, clock.minutes])
	const serializedIncrement = useMemo(() => clock.increment >= 10000 ? clock.increment / 1000 : '0' + clock.increment / 1000, [clock.increment])
	const playImageURL = useMemo(() => playing && require('./assets/stop.png') || require('./assets/play.png'), [playing])

	const [stopping, setStopping] = useState(false)
	const [stopAnimation, setStopAnimation] = useState(new Animated.Value(1))

	const handleTimeConfig = useCallback(async () => {
		const { hour, minute } = await TimePickerAndroid.open({
				hour: clock.hours,
				minute: clock.minutes,
				is24Hour: true
			}) as any

			if (hour !== undefined && minute !== undefined) {
				props.onChangeTime(hour, minute)
			}
	}, [clock, onChangeTime])

	const handleIncrementConfig = useCallback(() => {
		DialogPicker.show({
			items: [0, 5, 10, 15, 20, 25, 30, 45, 60].map(n => n + ' seg'),
			cancelText: I18n.t('cancel'),
		}, index => {
			onChangeIncrement(index * 5 * 1000)
		})
	}, [clock, onChangeIncrement])

	const handlePlay = useCallback(() => {
		if (stopping) {
			setStopping(false)
		}
		else if (!playing) {
			onPlay()
			playSound(startStopSound)
		}

		return false
	}, [stopping, playing, onPlay])

	const handleStopIn = useCallback(() => {
		if (!playing) {
			return
		}

		setStopping(true)

		Animated.timing(stopAnimation, {
			toValue: 0,
			duration: 3000
		}).start((endResult) => {
			if (endResult.finished) {
				setStopAnimation(new Animated.Value(1))
				onStop()
				playSound(startStopSound)
			}
		})
	}, [playing, stopAnimation, setStopping, setStopAnimation, onStop])

	const handleStopOut = useCallback(() => {
		setStopAnimation(new Animated.Value(1))
	}, [setStopping, setStopAnimation])

	const missingDeclarationProps = { touchSoundDisabled: true } as any

	return <View style={Layout.ConfigView}>
		<View>
			<Animated.View style={{ flex: 1, opacity: stopAnimation }}>
				<View style={[Layout.clockView, Layout.bordered]}>
					<TouchableNativeFeedback {...missingDeclarationProps} disabled={playing} onPress={handleTimeConfig}>
						<View style={[{ flexDirection: 'row', alignItems: 'center' }, { padding: 5 }]}>
							<Image style={Layout.clockViewTimeImage} source={require('./assets/clock.png')} />
							<Text style={Layout.clockViewTimeText}>{serializedTime}</Text>
						</View>
					</TouchableNativeFeedback>
					<TouchableNativeFeedback {...missingDeclarationProps} disabled={playing || isZeroTime} onPress={handleIncrementConfig}>
						<View style={{ flexDirection: 'row', alignItems: 'center', opacity: isZeroTime && 0.5 || 1.0 }}>
							<Image style={[Layout.clockViewIncrementImage, { marginLeft: 10 }]} source={require('./assets/increment.png')} />
							<Text style={Layout.clockViewTimeText}>{serializedIncrement}</Text>
						</View>
					</TouchableNativeFeedback>
				</View>
			</Animated.View>
		</View>
		<TouchableWithoutFeedback {...missingDeclarationProps} style={Layout.playView} onPress={handlePlay} onPressIn={handleStopIn} onPressOut={handleStopOut}>
			<Image source={playImageURL}/>
		</TouchableWithoutFeedback>
	</View>
}
export declare namespace ConfigView {
	export interface Props {
		clock: {
			hours: number
			minutes: number
			increment: number
		},
		playing: boolean
		onChangeTime(hours: number, minutes: number): void
		onChangeIncrement(increment: number): void
		onPlay(): void
		onStop(): void
	}
}

ConfigView.displayName = 'ConfigView'