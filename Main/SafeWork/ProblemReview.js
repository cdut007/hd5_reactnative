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

import Dimensions from 'Dimensions'
import NavBar from '../../common/NavBar';

var width = Dimensions.get('window').width;

var safeModule = [
  {
    'title':"待处理",
    'image': require('../../images/construction_icon.png'),
    'index': 0,
    "type":"DCL",
  },
  {
    'title':"整改中",
    'image': require('../../images/construction_icon.png'),
    'index': 1,
    "type":"ZGZ",
  },
  {
    'title':"已完成",
    'image': require('../../images/construction_icon.png'),
    'index': 2,
    "type":"YWC",
  },
  {
    'title':"不需处理",
    'image': require('../../images/construction_icon.png'),
    'index': 3,
    "type":"BXCL",
  },
]

export  default class ProblemReview extends Component {

  constructor(props) {
      super(props)

      var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

      this.state = {
          title: "问题审核",
          dataSource: ds,
      }

  }

  componentDidMount() {

      this.setState({
          dataSource: this.state.dataSource.cloneWithRows(safeModule),
      });


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
                     {this.renderToolsView()}
               </View>

          </View>
      )
  }

  renderToolsView() {
      return(

          <ListView
            dataSource={this.state.dataSource}
            renderRow={this.renderRow.bind(this)}
            contentContainerStyle={{
                  justifyContent: 'space-around',
                  flexDirection:'row', //改变ListView的主轴方向
                  flexWrap:'wrap', //换行
                  alignItems:'center', // 必须设置,否则换行不起作用
          }}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
        />
      )


  }

  renderRow(item,sectionId,rowId){
      return(
           <View key = {item.index}
                style={[{width:width/2,
                          height:width/2,}, styles.toolsItem]}>

               {this.renderDot(item)}

           </View>
      )
  }

  _itemClick(item){


  }

  renderDot(item){

    return(
      <TouchableOpacity style={{alignSelf:'center'}}
        onPress={this._itemClick.bind(this,item)}>
          <Image source={item.image} style={styles.circle_outter} resizeMode={Image.resizeMode.contain}></Image>
           <Text style={styles.item}> {item.title} </Text>
      </TouchableOpacity>
    );

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
