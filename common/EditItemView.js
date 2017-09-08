import React, { Component,PropTypes } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
 } from 'react-native';

import Dimensions from 'Dimensions'
var width = Dimensions.get('window').width;

 export default class EditItemView extends Component
 {
     static propTypes =
     {
        content: PropTypes.string,
        topic: PropTypes.string,
        onChangeText:PropTypes.func,
    }

    render()
    {
        return(
            <View>
            <View style= {styles.container}>
                <Text style= {styles.title}>{this.props.topic} : </Text>
                <TextInput style= {styles.detail}
                onChangeText={this.props.onChangeText}
                value={this.props.content}
                ></TextInput>
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
        color: "#666",
        borderColor: 'lightgray', borderWidth: 0.5, flex: 1, paddingLeft: 5, backgroundColor: 'white'
    },
    divider: {
    backgroundColor: '#8E8E8E',
    width: width,
    height: 0.5,
},
});
