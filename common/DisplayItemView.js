import React, { Component,PropTypes } from 'react';
import {
    StyleSheet,
    Text,
    View,
 } from 'react-native';

import Dimensions from 'Dimensions'
var width = Dimensions.get('window').width;

 export default class DisplayItemView extends Component
 {
     static propTypes =
     {
        title: PropTypes.string,
        detail: PropTypes.string,
    }

    render()
    {
        return(
            <View>
            <View style= {styles.container}>
                <Text style= {styles.title}>{this.props.title} : </Text>
                <Text style= {styles.detail}>{this.props.detail}</Text>
            </View>
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
        width: width * 0.33,
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
