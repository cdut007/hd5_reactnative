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

import MainView from './Main/MainView'

export default class hd_app extends Component {
    render() {
            return (<MainView index={this} />);
        }
}


AppRegistry.registerComponent('hd_app', () => hd_app);
