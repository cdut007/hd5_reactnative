import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Navigator,
    BackAndroid,
    ListView,
    TouchableOpacity,

} from 'react-native';

import Dimensions from 'Dimensions';
import NavBar from '../../common/NavBar'


export default class QuestionDetail extends Component {
  constructor(props) {
    super(props)

     this.state = {

       title: "问题详情",
     }

  }

  render(){

    return (
        <View style={styles.container}>
            <NavBar
            title={this.state.title}
            leftIcon={require('../../images/back.png')}
            leftPress={this.back.bind(this)}/>

        </View>
    )

  }

  back(){

   this.props.navigator.pop();

  }


}

const styles = StyleSheet.create({

  container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      backgroundColor: '#f2f2f2',
  },

})
