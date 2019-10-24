/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import 'vanilla-x/Object'
import React from 'react'
import { StyleSheet, View, StatusBar, NativeModules, Platform, TouchableNativeFeedback } from 'react-native'
import { ConfigView } from './src/components/ConfigView'
import { PlayerView } from './src/components/PlayerView'
import { Clock, PREFIX_DATE } from './src/components/Clock'
import I18n from 'i18n-js'
import { loadSound, playSound } from './src/lib'

const { UIManager, I18nManager } = NativeModules

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

I18n.locale = I18nManager.localeIdentifier
I18n.defaultLocale = 'en_US'

const changeTurnSound = loadSound(require('./src/components/assets/change-turn.wav'))
const gameOverSound = loadSound(require('./src/components/assets/game-over.wav'))

class App extends React.Component<{}, App.State> {
  public readonly state: App.State = {
    config: {
      clock: { hours: 0, minutes: 10, increment: 0 }
    },
    clocks: {
      white: App.ZERO_TIME,
      black: App.ZERO_TIME
    },
    turnSide: 'white',
    isPlaying: false
  }

  public handleChangeClockConfig(hours: number, minutes: number): void {
    const isZeroTime = !hours && !minutes
    const increment =  isZeroTime ? 0 : this.state.config.clock.increment

    this.setState({
      config: {
        ...this.state.config,
        clock: { ...this.state.config.clock, hours, minutes, increment }
      }
    })
  }

  public handleChangeIncrementConfig(increment: number): void {
    this.setState({
      config: {
        ...this.state.config,
        clock: { ...this.state.config.clock, increment }
      }
    })
  }

  public handlePlay(): void {
    this.setState({
      isPlaying: true,
      clocks: {
        white: new Date(`${PREFIX_DATE} ${this.state.config.clock.hours}:${this.state.config.clock.minutes}`).getTime(),
        black: new Date(`${PREFIX_DATE} ${this.state.config.clock.hours}:${this.state.config.clock.minutes}`).getTime()
      },
    })
  }

  public handleStop(): void {
    this.setState({
      clocks: {
        white: App.ZERO_TIME,
        black: App.ZERO_TIME
      },
      turnSide: 'white',
      isPlaying: false
    })
  }

  public handleClockTimeEllapsed(refreshRate: number): void {
    const config = this.state.config
    const signal = (!config.clock.hours && !config.clock.minutes) && +1 || -1
    const clocks = this.state.clocks
    const newTime = clocks[this.state.turnSide] + refreshRate * signal
    const turnSide = this.state.turnSide

    this.setState({
      clocks: {
        ...clocks,
        [turnSide]: newTime
      },
    })

    if (newTime <= App.ZERO_TIME) {
      this.setState({
        turnSide: 'white',
        isPlaying: false,
        clocks: {
          ...clocks,
          [turnSide]: App.ZERO_TIME
        }
      })

      gameOverSound.then(sound => sound.play())
    }
  }

  public handleChangeTurnSide(): void {
    if (this.state.isPlaying) {
      this.setState({
        clocks: {
          ...this.state.clocks,
          [this.state.turnSide]: this.state.clocks[this.state.turnSide] + this.state.config.clock.increment
        },
        turnSide: this.state.turnSide == 'white' && 'black' || 'white'
      })

      playSound(changeTurnSound)
    }
  }

  public render() {
    const { config, clocks, turnSide, isPlaying } = this.state

    return (
      <TouchableNativeFeedback touchSoundDisabled={true} style={styles.body} disabled={!isPlaying} onPress={this.xBind('handleChangeTurnSide')}>
        <View style={{ flex: 1 }}>
          <StatusBar hidden={true} />
          <PlayerView
            side="black"
            time={clocks.black}
            refreshRate={App.CLOCK_REFRESH_RATE}
            running={isPlaying && turnSide == 'black'}
            onTimeEllapsed={this.xBind('handleClockTimeEllapsed')}
          />
          <ConfigView
            clock={config.clock}
            playing={isPlaying}
            onChangeTime={this.xBind('handleChangeClockConfig')}
            onChangeIncrement={this.xBind('handleChangeIncrementConfig')}
            onPlay={this.xBind('handlePlay')}
            onStop={this.xBind('handleStop')}
          />
          <PlayerView
            side="white"
            time={clocks.white}
            refreshRate={App.CLOCK_REFRESH_RATE}
            running={isPlaying && turnSide == 'white'}
            onTimeEllapsed={this.xBind('handleClockTimeEllapsed')}
          />
        </View>
      </TouchableNativeFeedback>
    )
  }

  private static ZERO_TIME = new Date(`${PREFIX_DATE} 00:00`).getTime()

  private static readonly CLOCK_REFRESH_RATE = 100
}
declare namespace App {
  export interface State {
    config: {
      clock: ConfigView.Props['clock']
    },
    clocks: {
      white: number
      black: number
    },
    isPlaying: boolean,
    turnSide: Clock.Props['side']
  }
}

const styles = StyleSheet.create({
  body: {
    flex: 1
  },
  playerView: {
    flex: 3
  },
  whitePlayer: {
    backgroundColor: 'white'
  },
  blackPlayer: {
    backgroundColor: 'black'
  },
  textInput: {

  }
})

export default App
