import { StyleSheet } from 'react-native'

export default StyleSheet.create({
	PlayerView: {
		flex: 3,
		justifyContent: 'center',
		alignItems: 'center'
	},
	whiteSide: {
		backgroundColor: 'white'
	},
	blackSide: {
		transform: [{ scaleY: -1 }],
		backgroundColor: 'black'
	}
})