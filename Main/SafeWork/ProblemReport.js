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
    ScrollView,

} from 'react-native';

import Dimensions from 'Dimensions'
import NavBar from '../../common/NavBar';

var width = Dimensions.get('window').width;

export  default class ProblemReport extends Component {

  constructor(props) {
      super(props)

      this.state = {
          title: "报告问题",

      }

  }

  back() {
      this.props.navigator.pop()
  }

  render() {
      return (
          <View style={styles.container}>
              <NavBar
              title={this.state.title}
              leftIcon={require('../../images/back.png')}
              leftPress={this.back.bind(this)}/>
               <View style={styles.content}>
                    <Text> this is ProblemReport!  </Text>
               </View>

          </View>
      )
  }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
    },
    toolsItem: {
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center"
    },
    item: {
      color: "#3b3b3b",
      alignSelf:'center',
    },
    circle_outter:{
      marginBottom: 6,
      borderRadius : 44,
      borderWidth:1,
      borderColor : 'darkgray',
      alignSelf:'center',
      width: 88,
      height: 88,
    },

  });
