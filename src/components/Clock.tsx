import Layout from './Clock.layout'
import React, { useMemo, useEffect } from 'react'
import { View, Text } from 'react-native'

export const PREFIX_DATE = '1984/11/06'

export const Clock: React.FC<Clock.Props> = props => {
	const { time, refreshRate, side, running, onTimeEllapsed } = props

	const [hour, minute, second] = useMemo(() => {
		const date = new Date(time)
		return [
			date.getHours(),
			date.getMinutes(),
			date.getSeconds()
		]
	}, [time])

	useEffect(() => {
		let timerID: number | null = null

		if (running) {
			timerID = setInterval((lastTime: { value: number }) => {
				const currentTime = new Date().getTime()
				const ellapsedTime = currentTime - lastTime.value

				lastTime.value = currentTime

				onTimeEllapsed(ellapsedTime)
			}, refreshRate, { value: new Date().getTime() })
		}

		return () => {
			if (timerID != null) {
				clearInterval(timerID)
			}
		}
	}, [refreshRate, onTimeEllapsed, running])

	const hourLabel = hour >= 10 ? hour : '0' + hour
	const minuteLabel = minute >= 10 ? minute : '0' + minute
	const secondLabel = second >= 10 ? second : '0' + second

	return <View style={Layout.Clock}>
		<Text style={[Layout.text, Layout[side]]}>{hourLabel}:{minuteLabel}:{secondLabel}</Text>
	</View>
}
export declare namespace Clock {
	export interface Props {
		time: number
		refreshRate: number
		side: 'white' | 'black'
		running: boolean
		onTimeEllapsed(refreshRate: number): void
	}
}

Clock.displayName = 'Clock'