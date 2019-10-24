import { StyleSheet } from 'react-native'

export default StyleSheet.create({
	Clock: {
	},
	text: {
		paddingTop: 10,
		paddingBottom: 10,
		paddingLeft: 20,
		paddingRight: 20,
		fontSize: 40,
		fontWeight: 'bold',
		borderStyle: 'solid',
		borderWidth: 3,
		borderRadius: 10
	},
	white: {
		borderColor: 'black',
		color: 'black'
	},
	black: {
		borderColor: 'white',
		color: 'white',
		transform: [{ scaleY: -1 }, { rotate: '180deg' }]
	}
})