'use strict';
import React, {
  Component,
  PropTypes
} from 'react'
import {
    Text,
    View,
    StyleSheet,
      Platform,
} from 'react-native'

var clorArray = ['#00a4eb','#6d9ee1','#19cba3','#948763','#fbac2a']

var CircleLabelHeadView = React.createClass({

    getInitialState() {
      return {
        icon_url:null,
        contactName:null,
      };
    },

 getIconUrl(icon_url){
 if (typeof icon_url == 'undefined' || icon_url == null ) {
     return icon_url;
 }
 if ( typeof icon_url == 'string') {
     var check = icon_url.indexOf("http:");
     if (check>=0) {
          return icon_url;
     }else{
         var url =  serverUrl + icon_url;
         return url;
     }
 }else if (typeof icon_url == 'object') {
     if (icon_url.uri == null) {
         return icon_url;
     }
     var check = icon_url.uri.indexOf("http:");
     if (check>=0) {
          return icon_url;
     }else{
         var url =  serverUrl + icon_url.uri;
         icon_url.uri = url;
         return icon_url;
     }
 }else if (typeof icon_url == 'number'){
     console.log("icon_url.sss:"+icon_url);
     return icon_url;
 }else {
     console.log("icon_url.notfound:"+typeof(icon_url ));
     return icon_url;
 }

 },

    getColor(name){
        var displayInfo = {color:clorArray[0],label:'X'}

        if (name) {
            var label = name.substring(0,1)
            var code = label.charCodeAt();
            displayInfo = {color:clorArray[code%5],label:label}
        }

        return displayInfo
    },

  render(){
      var displayInfo = this.getColor(this.props.contactName)
      if (Platform.OS === 'ios')
      {
        return(
          <Text style ={[this.props.imageStyle,{backgroundColor:displayInfo.color}]}>{displayInfo.label}</Text>
        );
      }else{
        return (

        <Text style ={[styles.circle, this.props.circleStyle,this.props.imageStyle,{backgroundColor:displayInfo.color}]}>{displayInfo.label}</Text>

        );
      }


  }
});

var styles = StyleSheet.create({
  circle:{
    borderWidth:1,
    borderColor : 'white',
    backgroundColor : '#00000000',
    borderRadius : 100,
    padding: 0,
    height:34,
    width:34,
    textAlign:'center',
    color:'#ffffff',
    fontSize:20,

  },
  circle_ios:{
    borderWidth:1,
    borderColor : 'white',
    backgroundColor : '#00000000',
    // borderRadius : 8,
    padding: 0,
    height:34,
    width:34,
    textAlign:'center',
    color:'#ffffff',
    fontSize:20,

  },
  text:{
    fontSize : 20
  }

});

module.exports = CircleLabelHeadView;
