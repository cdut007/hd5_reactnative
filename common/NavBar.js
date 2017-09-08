/**
 * @author Lei
 * @repo https://github.com/stoneWeb/elm-react-native
 */
'use strict';

import React, {
  Component,
  PropTypes
} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Animated,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
  Image
} from 'react-native'
import px2dp from './util'


export default class NavBar extends Component{
    static propTypes = {
        title: PropTypes.string,
        leftIcon: PropTypes.any,
        rightIcon: PropTypes.any,
        leftPress: PropTypes.func,
        rightPress: PropTypes.func,
        style: PropTypes.object
    }
    static topbarHeight = (Platform.OS === 'ios' ? 64 : 44)
    renderBtn(pos){
      let render = (obj) => {
        const { name, onPress } = obj
        if(Platform.OS === 'android'){
          return (
            <TouchableNativeFeedback onPress={onPress} style={styles.btn}>
              <Image source={name} style={{width: px2dp(44), height: px2dp(44),resizeMode:'contain'}}/>
            </TouchableNativeFeedback>
          )
        }else{
          return (
            <TouchableOpacity onPress={onPress} style={styles.btn}>
              <Image source={name} style={{width: px2dp(44), height: px2dp(44),resizeMode:'contain'}}/>
            </TouchableOpacity>
          )
        }
      }
      if(pos == "left"){
        if(this.props.leftIcon){
          return render({
            name: this.props.leftIcon,
            onPress: this.props.leftPress
          })
        }else{
          return (<View style={styles.btn}></View>)
        }
      }else if(pos == "right"){
        if(this.props.rightIcon){
          return render({
            name: this.props.rightIcon,
            onPress: this.props.rightPress
          })
        }else{
          return (<View style={styles.btn}></View>)
        }
      }
    }
    render(){
        return(
            <View style={{color:"#d6d6d6",alignSelf:'stretch',height: NavBar.topbarHeight + 0.5,}}>
                <View style={[styles.topbar, this.props.style]}>
                {this.renderBtn("left")}
                <Animated.Text numberOfLines={1} style={[styles.title, this.props.titleStyle]}>{this.props.title}</Animated.Text>
                {this.renderBtn("right")}
                </View>
                <View style={{backgroundColor:"#d6d6d6",height:0.5,alignSelf:'stretch',flex:1}}>
                </View>
            </View>

        )
    }
}

const styles = StyleSheet.create({
    topbar: {
        alignSelf: 'stretch',
        height: NavBar.topbarHeight,
        backgroundColor: "#ffffff",
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: (Platform.OS === 'ios') ? 20 : 0,
    },
    btn: {
      width: 44,
      height: 44,
      justifyContent: 'center',
      alignItems: 'center'
    },
    title:{
        color: "#1b1b1b",
        fontSize: 18,
        marginLeft: 5,
    }
});
