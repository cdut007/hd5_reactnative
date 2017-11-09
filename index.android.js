/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { StackNavigator } from 'react-navigation';

import MainView from './Main/MainView'
import MeetingView from './Main/MeetingView'
import CreateMeetingView from './Main/Meeting/CreateMeetingView'

export default class hd_app extends Component {
    render() {
            return (<MainView index={this} {...this.props}/>);
        }
}


// export const hd_app = StackNavigator({
//   MainView: { screen: MainView },
//   MeetingView: { screen: MeetingView },
//   CreateMeetingView: { screen: CreateMeetingView },
// }, {
//    headerMode: 'none',
//    navigationOptions: {
//        header:null,
//      gesturesEnabled: false,
//    },
//
//  }
// );


AppRegistry.registerComponent('hd_app', () => hd_app);
