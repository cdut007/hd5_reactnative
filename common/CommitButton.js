import React, { Component,PropTypes } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity
 } from 'react-native';

import Dimensions from 'Dimensions'
var width = Dimensions.get('window').width;

 export default class CommitButton extends Component
 {
     static propTypes =
     {
        title: PropTypes.string,
        onPress: PropTypes.func,
        containerStyle: PropTypes.object,
        titleStyle: PropTypes.object,
    }

    render()
    {
        return(
            <TouchableOpacity style= {[styles.container,this.props.containerStyle]} onPress = {this.props.onPress} activeOpacity={0.8}>
                <Text style= {[styles.title, this.props.titleStyle]}>{this.props.title}</Text>
            </TouchableOpacity>
        )
    }
 }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'row',
        paddingLeft:10,
        paddingRight:10,
        paddingTop:8,
        backgroundColor:'#ea6b10',
        alignSelf:'stretch',
        paddingBottom:8,
        height: 49,
        alignItems: 'center',
    },
    title: {
        justifyContent: 'center',
        textAlign:'center',
        alignItems: 'center',
        fontSize: 18,
        color: "#ffffff"
    },

});
