import React, { Component,PropTypes } from 'react';
import {
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    View,
 } from 'react-native';

import Dimensions from 'Dimensions'
var width = Dimensions.get('window').width;

 export default class EnterItemView extends Component
 {
     static propTypes =
     {
        title: PropTypes.string,
        detail: PropTypes.string,
        onPress:PropTypes.func,
    }

    render()
    {
        return(
            <View>
            <TouchableOpacity onPress={this.props.onPress}>
            <View style= {styles.container}>
                <Text style= {styles.title}>{this.props.title}</Text>
                <Image source={require('../images/right_enter_blue.png')}></Image>
            </View>
            </TouchableOpacity>
            <View style={styles.divider}/>
            </View>
        )
    }
 }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        paddingLeft:10,
        paddingRight:10,
        paddingTop:8,
        backgroundColor:'#ffffff',
        paddingBottom:8,
        height: 50,
        alignItems: 'center',
    },
    title: {
        width: width * 0.90,
        fontSize: 18,
        color: "#666"
    },
    detail: {
        fontSize: 18,
        color: "#666"
    },
    divider: {
    backgroundColor: '#8E8E8E',
    width: width,
    height: 0.5,
},
});
