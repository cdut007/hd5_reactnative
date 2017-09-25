import React, { Component,PropTypes } from 'react';
import {
    StyleSheet,
    Text,
    View,
 } from 'react-native';

import Dimensions from 'Dimensions'
var width = Dimensions.get('window').width;

 export default class DisplayMoreItemView extends Component
 {
     static propTypes =
     {
        title: PropTypes.string,
        detail: PropTypes.string,
    }

    renderDetail(detail){
        if (!detail) {
            return(<Text style= {styles.detail}>暂无</Text>);
        }else{
            return(<Text style= {styles.detail}>{this.props.detail}</Text>);
        }
    }

    render()
    {
        return(
            <View>
            <View style= {styles.container}>
                <Text style= {styles.title}>{this.props.title} : </Text>
                {this.renderDetail(this.props.detail)}
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
        paddingLeft:10,
        paddingRight:10,
        paddingTop:8,
        flexDirection:'column',
        backgroundColor:'#ffffff',
        paddingBottom:8,
    },
    title: {
        width: width * 0.33,
        fontSize: 14,
        justifyContent:'flex-start',
        color: "#1c1c1c"
    },
    detail: {
        marginTop:10,
        fontSize: 14,
        color: "#777777"
    },
    divider: {
    backgroundColor: '#8E8E8E',
    width: width,
    height: 0.5,
},
});
