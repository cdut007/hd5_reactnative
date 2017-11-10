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
import QuestionStaicContainer from '../SafeWork/QuestionStaicContainer'
import Global from '../../common/globals.js';
import TabNavigator from 'react-native-tab-navigator';
import MeView from '.././MeView'

var width = Dimensions.get('window').width;

var safeModule = [
  {
    'title':"待处理",
    'image': require('../../images/construction_icon.png'),
    'index': 0,
    "type":"DCL",
    "detailType":"1001",
    "problemStatus":"Need_Handle",
  },
  {
    'title':"整改中",
    'image': require('../../images/construction_icon.png'),
    'index': 1,
    "type":"ZGZ",
    "detailType":"1003",
    "problemStatus":"Renovating",
  },
  {
    'title':"已完成",
    'image': require('../../images/construction_icon.png'),
    'index': 2,
    "type":"YWC",
    "detailType":"1004",
    "problemStatus":"Finish",
  },
  {
    'title':"不需处理",
    'image': require('../../images/construction_icon.png'),
    'index': 3,
    "type":"BXCL",
    "detailType":"1005",
    "problemStatus":"None",
  },
]

export  default class ProblemReview extends Component {

  constructor(props) {
      super(props)

      var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

      this.state = {
          title: "问题审核",
          dataSource: ds,
          selectedTab: 'tab1',
      }

  }



  componentDidMount() {

      this.setState({
          dataSource: this.state.dataSource.cloneWithRows(safeModule),
      });


  }

  renderContent(index){

  item = safeModule[index];

    var data =   {
      }

      data.user = new Object();
      data.user.id = Global.UserInfo.id;
      data.user.dept = new Object();
      data.user.dept.name = data.title;//change later. for dept
      data.item = item;

let View =    <QuestionStaicContainer
          data = {data}
    detailType = {item.detailType}
  problemStatus = {item.problemStatus}
          {...this.props}/>

return View;

     // this.props.navigator.push({
     //     component: QuestionStaicContainer,
     //     props: {
     //         data:data,
     //         detailType:item.detailType,
     //         problemStatus:item.problemStatus,
     //        }
     // })


  }

  back() {
      this.props.navigator.pop()
  }


  render() {
      return (
          <TabNavigator>

          <TabNavigator.Item
              selected={this.state.selectedTab === 'tab1'}
              title="待处理"
              renderIcon={() => <Image style={{width:24,height:24,}} source={require('../../images/pendingIcon.png')} />}
              renderSelectedIcon={() => <Image style={{width:24,height:24,}} source={require('../../images/pendingIconClick.png')} />}
              selectedTitleStyle={styles.tabBarTintColor}
              onPress={() => this.setState({ selectedTab: 'tab1' })}>
              {this.renderContent(0)}
          </TabNavigator.Item>

          <TabNavigator.Item
              selected={this.state.selectedTab === 'tab2'}
              title="整改中"
              renderIcon={() => <Image style={{width:24,height:24,}} source={require('../../images/rectifyIcon.png')} />}
              renderSelectedIcon={() => <Image style={{width:24,height:24,}} source={require('../../images/rectifyIconClick.png')} />}
              selectedTitleStyle={styles.tabBarTintColor}
              onPress={() => this.setState({ selectedTab: 'tab2' })}>
            {this.renderContent(1)}
          </TabNavigator.Item>

          <TabNavigator.Item
              selected={this.state.selectedTab === 'tab3'}
              title="已完成"
              renderIcon={() => <Image style={{width:24,height:24,}} source={require('../../images/completeIcon.png')} />}
              renderSelectedIcon={() => <Image style={{width:24,height:24,}} source={require('../../images/completeIconClick.png')} />}
              selectedTitleStyle={styles.tabBarTintColor}
              onPress={() => this.setState({ selectedTab: 'tab3' })}>
              {this.renderContent(2)}
          </TabNavigator.Item>

          <TabNavigator.Item
              selected={this.state.selectedTab === 'tab4'}
              title="不需处理"
              renderIcon={() => <Image style={{width:24,height:24,}} source={require('../../images/withoutIcon.png')} />}
              renderSelectedIcon={() => <Image style={{width:24,height:24,}} source={require('../../images/withoutIconClick.png')} />}
              selectedTitleStyle={styles.tabBarTintColor}
              onPress={() => this.setState({ selectedTab: 'tab4' })}>
              {this.renderContent(3)}
          </TabNavigator.Item>
          </TabNavigator>
      )
  }

  onSearchChanged(text){


  }

  onSearchClose(){

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


   var data =   {
     }

     data.user = new Object();
     data.user.id = Global.UserInfo.id;
     data.user.dept = new Object();
     data.user.dept.name = data.title;//change later. for dept
     data.item = item;

    this.props.navigator.push({
        component: QuestionStaicContainer,
        props: {
            data:data,
            detailType:item.detailType,
            problemStatus:item.problemStatus,
           }
    })

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
    tabBarTintColor: {
      color: "#FBAC2B",
    },

  });
