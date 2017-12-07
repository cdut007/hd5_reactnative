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
import SearchBar from './SearchBar';

export default class NavBar extends Component{
    static propTypes = {
        title: PropTypes.string,
        leftIcon: PropTypes.any,
        rightIcon: PropTypes.any,
        leftPress: PropTypes.func,
        rightPress: PropTypes.func,
        style: PropTypes.object,
        onSearchChanged: PropTypes.func,
        onSearchClose: PropTypes.func,
        searchMode: PropTypes.bool,
    }
    static topbarHeight = (Platform.OS === 'ios' ? 64 : 44)

    constructor(props) {
        super(props);

        this.state = {
            showSearch: false,
        };
    }

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
        }else if(this.props.rightText && this.props.rightText != ''){
          return(
            <TouchableOpacity onPress={() => this.props.rightPress()}>
              <Text style={{color:'#0755a6',fontSize:14,paddingRight:10,paddingLeft:10}}>{this.props.rightText}</Text>
            </TouchableOpacity>
          );
        }else{
          return (<View style={styles.btn}></View>)
        }
      }else if(pos == "search"){
        if(Platform.OS === 'android'){
        return (
          <TouchableNativeFeedback onPress={this.setSearchMode.bind(this)} style={styles.btn}>
            <Image source={require('../images/search_icon.png')} style={{width: px2dp(48), height: px2dp(48),resizeMode:'contain'}}/>
          </TouchableNativeFeedback>
        )
      }else{
        return (
          <TouchableOpacity onPress={this.setSearchMode.bind(this)} style={styles.btn}>
            <Image source={require('../images/search_icon.png')} style={{width: px2dp(48), height: px2dp(48),resizeMode:'contain'}}/>
          </TouchableOpacity>
        )
      }

      }
    }


    setSearchMode(){
        this.setState({showSearch:true})
    }
    closeSearchMode(){
        this.setState({showSearch:false})
        this.props.onSearchClose()
    }


    render(){

        if (this.state.showSearch) {

        return(

            <View style={{alignSelf:'stretch',height: NavBar.topbarHeight + 0.5,}}>
                <View style={[styles.topbar, this.props.style]}>
                <SearchBar
                isLoading={false}
                onSearchChange={this.props.onSearchChanged}
                />
                <TouchableOpacity onPress={this.closeSearchMode.bind(this)} style={styles.btnLabel}>
                  <Text style={{color:'#0755a6',fontSize:16,paddingRight:10,paddingLeft:10}}>取消</Text>
                </TouchableOpacity>

                </View>
                <View style={[{backgroundColor:"#d6d6d6",height:0.5,alignSelf:'stretch',flex:1}, this.props.lineStyle]}>
                </View>
            </View>)

    }

        var right_tag = "right"
        if (this.props.searchMode) {
            right_tag = "search"
        }

        return(
            <View style={{alignSelf:'stretch',height: NavBar.topbarHeight + 0.5,}}>
                <View style={[styles.topbar, this.props.style]}>
                {this.renderBtn("left")}
                <Animated.Text numberOfLines={1} style={[styles.title, this.props.titleStyle]}>{this.props.title}</Animated.Text>
                {this.renderBtn(right_tag)}
                </View>
                <View style={[{backgroundColor:"#d6d6d6",height:0.5,alignSelf:'stretch',flex:1}, this.props.lineStyle]}>
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
