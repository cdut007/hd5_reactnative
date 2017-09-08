import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Navigator,
    BackAndroid
} from 'react-native';

import Dimensions from 'Dimensions';
import NavBar from '../common/NavBar'

export default class CommonContentView extends Component
{




    back() {
        this.props.navigator.pop()
    }

    render()
    {
        return (
            <View style={styles.container}>
                <NavBar title={this.props.title}
                leftIcon={require('../images/back.png')}
                leftPress={this.back.bind(this)}
                />
                <Text style={styles.content}>
                 {this.props.content}
                </Text>
            </View>

        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    content:{
            paddingLeft:8,
            paddingRight:8,
            paddingBottom:8,
            paddingTop:8,
            color: '#000000',
            fontSize:16,
    },
    tabBarTintColor: {

      color: '#00a629'
    },

});
