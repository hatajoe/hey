/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
	Button,
  View,
	NativeModules,
	DeviceEventEmitter
} from 'react-native';

const Core = NativeModules.Core;
const EventName = 'onReceive';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {
	constructor(props) {
		super(props);
		
		const that = this;
		
		DeviceEventEmitter.addListener(EventName, function(e: Event) {
			var arr = that.state.received.slice();
			arr.unshift(e);
			if (arr.length > 10) {
				arr.pop();
			}
			that.setState({received: arr});
  	});
		
		this.state = { 
			received: [],
			willsend: '',
		};
	}

	connect() {
		Core.connect("ws://192.168.3.2:9218", "http://192.168.3.2:9218", EventName);
	}

	disconnect() {
		Core.disconnect();
	}

	send() {
		Core.send(1, this.state.willsend);
	}

  render() {
		const texts = this.state.received.map((msg, i) => {
			return (
				<Text key={i} style={styles.welcome}>
				  {msg}
      	</Text>
			);
		});

    return (
      <View style={styles.container}>
				<View style={styles.message}>
			    {texts}
 				</View>
			  <View style={styles.input}>
          <TextInput
            style={{height: 40}}
            onChangeText={(willsend) => this.setState({willsend})}
						onSubmitEditing={() => this.send()}
            value={this.state.willsend}
          />
				</View>
			  <View style={styles.buttons}>
					<View style={styles.button}>
    		    <Button
              onPress={() => this.connect()}
              title="conncet"
              accessibilityLabel="conncect to server"
            />
  			  </View>
					<View style={styles.button}>
   		      <Button
              onPress={() => this.disconnect()}
              title="disconncet"
              accessibilityLabel="disconncect from server"
            />
  			  </View>
  			</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
	message :{
    flex: 7,
		alignItems: 'center',
	},
  welcome: {
    fontSize: 20,
    textAlign: 'center',
  },
	input: {
		flex: 1,
	},
	buttons: {
		flex: 2,
    alignItems: 'flex-end',
		flexDirection: 'row',
	},
	button: {
		flex: 1,
	}
});
