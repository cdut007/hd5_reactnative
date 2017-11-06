import React, { Component,PropTypes } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    Image,
 } from 'react-native';

import Dimensions from 'Dimensions'
var width = Dimensions.get('window').width;

 export default class EditItemView extends Component
 {
     static propTypes =
     {
        content: PropTypes.string,
        topic: PropTypes.string,
        placeholder:PropTypes.string,
        onChangeText:PropTypes.func,
        keyboard : PropTypes.string ?PropTypes.string : 'default',
        icon:PropTypes.string,
    }

    // constructor(props) {
    //     super(props)
    // this.state = {
    //  keyboard : this.props.keyboard ? this.props.keyboard : "default"
    // }
    // }


    render()
    {

        if (this.props.icon) {
            return(

                <View>
                <View style= {styles.container}>
                <Image style={{width:24,height:24,marginRight:5}} source={this.props.icon} />

                    <Text style= {styles.title_with_icon}>{this.props.topic} : </Text>
                    <TextInput style= {styles.detail}
                    onChangeText={this.props.onChangeText}
                    underlineColorAndroid={'transparent'}
                     underlineColorAndroid='transparent'
                     placeholder={this.props.placeholder}
                    value={this.props.content}
                    keyboardType={this.props.keyboard}

                    ></TextInput>
                </View>
                <View style={styles.divider}/>
                </View>
            )
        }

        return(
            <View>
            <View style= {styles.container}>
                <Text style= {styles.title}>{this.props.topic} : </Text>
                <TextInput style= {styles.detail}
                onChangeText={this.props.onChangeText}
                underlineColorAndroid={'transparent'}
                 underlineColorAndroid='transparent'
                 placeholder={this.props.placeholder}
                value={this.props.content}
                keyboardType={this.props.keyboard}

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
        paddingTop:6,
        backgroundColor:'#ffffff',
        paddingBottom:6,
        height: 50,
        alignItems: 'center',
    },
    title: {
        width: width * 0.33,
        fontSize: 14,
        color: "#1c1c1c"
    },
    title_with_icon: {
        width: width * 0.24,
        fontSize: 14,
        color: "#1c1c1c"
    },
    detail: {
        fontSize: 14,
        color: "#666",
        borderColor: 'lightgray', borderWidth: 0.5, flex: 1, paddingLeft: 5, backgroundColor: 'white'
    },
    divider: {
    backgroundColor: '#8E8E8E',
    width: width,
    height: 0.5,
},
});
