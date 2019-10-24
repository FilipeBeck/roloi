import { StyleSheet } from 'react-native';

export default StyleSheet.create({
	ConfigView: {
		flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#3471d1'
  },
  clockView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    marginRight: 20
  },
  clockViewTimeImage: {
  },
  clockViewTimeText: {
    marginLeft: 5,
    fontSize: 35,
    fontWeight: 'bold',
    lineHeight: 62.5,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: 'white'
  },
  clockViewIncrementImage: {

  },
  clockViewIncrementText: {

  },
  playView: {
    flex: 1
  },
  bordered: {
    borderStyle: 'solid',
    // borderWidth: 2,
    borderColor: 'white'
  }
})