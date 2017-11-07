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
      Image
} from 'react-native'

var clorArray = [require('../images/department_1_icon.png'),
require('../images/department_2_icon.png'),
require('../images/department_3_icon.png'),
require('../images/department_4_icon.png'),
require('../images/department_5_icon.png'),
require('../images/department_6_icon.png'),
require('../images/department_7_icon.png'),
require('../images/department_8_icon.png'),
]

var CircleLabelDepartView = React.createClass({

    getInitialState() {
      return {
        icon_url:null,
        department:null,
      };
    },


    getColor(name){
        var displayInfo = {url:clorArray[0],label:'X'}

        if (name) {
            var label = name.substring(0,1)
            var code = label.charCodeAt();
            displayInfo = {url:clorArray[code%8],label:label}
        }

        return displayInfo
    },

  render(){
      var displayInfo = this.getColor(this.props.department)
      return(
        <Image style ={{width:34,height:34}} source={displayInfo.url}></Image>
      );


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

module.exports = CircleLabelDepartView;
