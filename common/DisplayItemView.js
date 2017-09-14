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
        noLine:PropTypes.bool,
    }

    render()
    {
        return(
            <View>
            <View style= {styles.container}>
                <Text style= {styles.title}>{this.props.title} : </Text>
                <Text style= {styles.detail}>{this.props.detail}</Text>
            </View>
            {this.rendLine()}
            </View>
        )
    }

    rendLine(){
        if (!this.props.noLine) {
            return(<View style={styles.divider}/>)
        }else{
            return(<View style={styles.no_divider}/>)
        }
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
        height: 48,
        alignItems: 'center',

    },
    title: {
        width: width * 0.33,
        fontSize: 14,
        color: "#1c1c1c"
    },
    detail: {
        fontSize: 14,
        color: "#777777"
    },
    divider: {
    backgroundColor: '#d6d6d6',
    width: width,
    height: 1,
    marginLeft:10,
},no_divider: {
backgroundColor: '#00000000',
width: width,
height: 1,
marginLeft:10,
},
});
