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
 * @providesModule SearchBar
 * @flow
 */
 'use strict';

import React, { Component,PropTypes } from 'react';
 var ReactNative = require('react-native');
 var {
   Image,
   Platform,
   ActivityIndicator,
   TextInput,
   StyleSheet,
   TouchableNativeFeedback,
   View,
 } = ReactNative;

 class SearchBar extends React.Component {

   constructor(props) {
       super(props)

       this.state = {
      searchBar: this.props.searchBar ? this.props.searchBar : styles.searchBar,
      searchBarInput:this.props.searchBarInput ? this.props.searchBarInput : styles.searchBarInput,
      placeholderTextColor:"#979797",
       }
   }



   render() {

 if (this.props.placeholderTextColor) {
      this.state.placeholderTextColor = this.props.placeholderTextColor
 }

     return (
       <View style={this.state.searchBar}>
         <TextInput
           ref="input"
           autoCapitalize="none"
           underlineColorAndroid={'transparent'}
           autoCorrect={false}
           autoFocus={true}
           onChangeText={this.props.onSearchChange}
           placeholder="搜索"
           placeholderTextColor={this.state.placeholderTextColor}
           onFocus={this.props.onFocus}
           style={this.props.searchBarInput}
         />
         <ActivityIndicator
           animating={this.props.isLoading}
           color="white"
           size="large"
           style={styles.spinner}
         />
       </View>
     );
   }
 }

 var styles = StyleSheet.create({
   searchBar: {
     flexDirection: 'row',
     alignItems: 'center',
     backgroundColor: '#f2f2f2',
     height: 44,
     flex:1
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

 module.exports = SearchBar;
