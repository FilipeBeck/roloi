import Layout from './PlayerView.layout'
import React from 'react'
import { View, Image } from 'react-native'
import { Clock } from './Clock'

export const PlayerView: React.FC<PlayerView.Props> = props => {
	const { time, refreshRate, side, running, onTimeEllapsed } = props
	const iconURL = side == 'white' ? require('./assets/white-side-icon.png') : require('./assets/black-side-icon.png')
	const sideStyle = side == 'white' && Layout.whiteSide || Layout.blackSide

	return <View style={[Layout.PlayerView, sideStyle]}>
		<Image source={iconURL}/>
		<Clock
			time={time}
			refreshRate={refreshRate}
			side={side}
			running={running}
			onTimeEllapsed={onTimeEllapsed}
		/>
	</View>
}
export declare namespace PlayerView {
	export interface Props extends Clock.Props {
		
	}
}

PlayerView.displayName = 'PlayerView'