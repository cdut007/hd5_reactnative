/**
 * The examples provided by Facebook are for non-commercial testing and
 * evaluation purposes only.
 *
 * Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * @providesModule SearchItemFilter
 * @flow
 */
'use strict';
import React, { Component,PropTypes } from 'react';
// var React = require('react');

import MemberSelectView from '../common/MemberSelectView'


import HttpRequest from '../HttpRequest/HttpRequest'

var ReactNative = require('react-native');
var {
  Image,
  Platform,
  ActivityIndicator,
  TextInput,
  StyleSheet,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
  Dimensions
} = ReactNative;
const { width, height } = Dimensions.get('window')

var IS_RIPPLE_EFFECT_SUPPORTED = Platform.Version >= 21;

class SearchItemFilter extends React.Component {

  constructor(props) {
      super(props)

      this.state = {
     searchBar: this.props.searchBar ? this.props.searchBar : styles.searchBar,
     placeholder:"搜索",
     createTime:[],
     problemStatus:[],
     targetTime:[],
      createTimeStr:'提出时间',
     targetTimeStr :'截止时间',
     problemStatusStr:'问题状态'
      }
      if (this.props.placeholderTextColor) {
           this.state.placeholderTextColor = this.props.placeholderTextColor
      }

      if(this.props.placeholder){
        this.state.placeholder = this.props.placeholder;
      }
  }

componentDidMount() {

   var paramBody = {
                     }

   HttpRequest.get('/hse/dynamicFilterItems', paramBody, this.onGetDataSuccess.bind(this),
                (e) => {


                    try {
                        var errorInfo = JSON.parse(e);
                        if (errorInfo != null) {
                         console.log(errorInfo)
                        } else {
                            console.log(e)
                        }
                    }
                    catch(err)
                    {
                        console.log(err)
                    }

                    console.log('Task error:' + e)
                })
     }



    onGetDataSuccess(response,paramBody){
         console.log('onGetDataSuccess@@@@')
    //  var query = this.state.filter;
    //  if (!query) {
    //      query = '';
    //  }
         var datas = {};
        if(response.responseResult){
            datas = response.responseResult
        }
  this.setState({
          createTime:datas.createTime,
     problemStatus:datas.problemStatus,
     targetTime:datas.targetTime
        });

    }


onSelectedType(data,pickerType){



   switch (pickerType) {
     case "choose_code1":
     {
        var  selectedProductStr = data[0];
        var key  = this._getDataKey(this.state.createTime,selectedProductStr);
        this.props.onSearchFilterChange(key,null,null);
        this.state.createTimeStr = selectedProductStr;
     }
     break;
       case "choose_code2":
     {
        var  selectedProductStr = data[0];
          var key  = this._getDataKey(this.state.targetTime,selectedProductStr);
        this.props.onSearchFilterChange(null,key,null);
          this.state.targetTimeStr = selectedProductStr;
     }
     break;
       case "choose_code3":
     {
        var  selectedProductStr = data[0];
          var key  = this._getDataKey(this.state.problemStatus,selectedProductStr);
        this.props.onSearchFilterChange(null,null,key);
          this.state.problemStatusStr = selectedProductStr;
     }
     break;
   }

   this.setState({})


  }


  _SelectViewOption(name,title,datas,pickerTitle,pickerType){

      return(
        <View style={styles.topContainer}>
            
              {this.renderSelectView(title,datas,pickerTitle,pickerType)}
            
        </View>
      )

  }

   renderSelectView(title,datas,pickerTitle,pickerType,reference) {

       var fontSizeStyle = 14;
       if(title.length>4 && title.length<=7){
        fontSizeStyle = 11;
       }

     if(title.length>7){
        fontSizeStyle = 9;
       }
        return(
            <View style={styles.statisticsflexContainer}>
      <TouchableOpacity onPress={() => reference.onPickClick()}
        style={styles.touchStyle}
        >
        <MemberSelectView
        ref={(c) => reference = c}
         style={{color:'#f77935',fontSize:fontSizeStyle,flex:1,textAlign:'left'}}
         title={title}
         data={datas}
         type={pickerType}
         pickerTitle={pickerTitle}
         onSelected={(data) => this.onSelectedType(data,pickerType)}/>
        <Image style={{width:20,height:20,}} source={require('../images/unfold.png')}/>
     </TouchableOpacity>
      </View>
        )

    }

    _getDataKey(datas,value){
   
   var dataKey;
   for (var i = 0; i <= datas.length - 1; i++) {
      if(datas[i].value == value){

        return datas[i].key;
      }
   }

   return dataKey;


 }

 _getDataValues(datas){
   
   var dataValues = [];
   for (var i = 0; i <= datas.length - 1; i++) {
      dataValues.push(datas[i].value);
   }

   return dataValues;


 }


  render() {
  
    return (
      <View style={this.state.searchBar}>
          {this._SelectViewOption('',this.state.createTimeStr,this._getDataValues(this.state.createTime),'选择问题提出时间','choose_code1')}
           {this._SelectViewOption('',this.state.targetTimeStr,this._getDataValues(this.state.targetTime),'选择问题截止时间','choose_code2')}
           {this._SelectViewOption('',this.state.problemStatusStr,this._getDataValues(this.state.problemStatus),'选择问题状态','choose_code3')}
         
      </View>
    );
  }
}

var styles = StyleSheet.create({
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f2f2f2',
      justifyContent:'center',
      height: 44,
      width:width,
      flex:1
    },
     touchStyle: {
      alignItems:'center',
      flex:1,
      paddingLeft:10,
      paddingRight:10,
      paddingTop:8,
      paddingBottom:8,
      borderColor : '#f77935',
      backgroundColor : 'white',
      borderRadius : 4,
      borderWidth:0.5,
      flexDirection:'row',
      alignSelf:'stretch',
    },
    topContainer:{
      justifyContent:'center',
      alignItems: 'center',
      flexDirection: 'row',
      backgroundColor:'#f2f2f2',
     
    },
     statisticsflexContainer: {
             width: width*0.3,
             height: 36,
             marginRight:4,
             marginLeft:6,
             backgroundColor: '#f2f2f2',
             flexDirection: 'row',
         },
    searchBarInput: {
      flex: 1,
      fontSize: 14,
      color: '#1c1c1c',
      height: 50,
      paddingLeft: 10,
      backgroundColor: 'transparent'
    },
  spinner: {
    width: 30,
    height: 30,
    marginRight: 16,
  },
  icon: {
    width: 24,
    height: 24,
    marginHorizontal: 8,
  },
});

module.exports = SearchItemFilter;
