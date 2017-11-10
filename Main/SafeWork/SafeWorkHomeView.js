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
    // AlertIOS,

} from 'react-native';

import Dimensions from 'Dimensions'
import NavBar from '../../common/NavBar';
import ProblemReview from '../SafeWork/ProblemReview'
import ProblemRectification from '../SafeWork/ProbleRectification'
import ProblemAceess from '../SafeWork/ProblemAccess'
import ProblemReport from '../SafeWork/ProblemReport'

var width = Dimensions.get('window').width;

var safeModule = [
  {
    'title':"报告问题",
    'image': require('../../images/reportIcon.png'),
    'index': 0,
    "type":"BGWT",
    "right":true,
    "bottom":true,

  },
  {
    'title':"问题审核",
    'image': require('../../images/checkIcon.png'),
    'index': 1,
    "type":"WTSH",
    "right":false,
    "bottom":true,
  },
  {
    'title':"问题整改",
    'image': require('../../images/correctionIcon.png'),
    'index': 2,
    "type":"WTZG",
    "right":true,
    "bottom":false,
  },
  {
    'title':"问题查阅",
    'image': require('../../images/lookIcon.png'),
    'index': 3,
    "type":"WTCY",
    "right":false,
    "bottom":false,
  },
]

export  default class SafeWorkHomeView extends Component {

  constructor(props) {
      super(props)

      var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

      this.state = {
          title: "安全文明任务",
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
               <ScrollView style={styles.content}>
                      {this.renderHeaderView()}
                     {this.renderToolsView()}
               </ScrollView>

          </View>
      )
  }

  renderHeaderView(){
       return(
         <View style = {{width:width,height:200,backgroundColor:'#3CDEBA',alignItems:'center',justifyContent:'center'}}>
           <Image source={require('../../images/construction_icon.png')} style={{width:120,height:120}} resizeMode={Image.resizeMode.contain}></Image>
         </View>
       );
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
                  marginLeft:30,
                  marginRight:30,
                  marginTop:50,
                  marginBottom:50,
          }}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
        />
      )
i

  }

  renderRow(item,sectionId,rowId){
      return(
           <View key = {item.index}
                style={[{width:width/2-30,
                        height:width/2-30,
                        borderRightWidth:item.right ? 1 : 0,
                        borderBottomWidth:item.bottom ? 1 : 0,
                        borderColor:'#DDDDDD',
                      }, styles.toolsItem]}>

               {this.renderDot(item)}

           </View>
      )
  }

  _itemClick(item){

// AlertIOS.Global.alert(item.type,item.title);

var Component;

  switch (item.type) {
    case "BGWT":
    {
     Component =   ProblemReport;
    }
    break;

      break;
    case "WTSH":
      {
         Component = ProblemReview;
      }
      break;
      case "WTZG":
      {
        Component = ProblemRectification;
      }
          break;
      case "WTCY":
          {
        Component = ProblemAceess;
          }
          break;

  }

  if (Component) {
    this.props.navigator.push({
        component: Component,

    })
  }


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
      backgroundColor: '#fff',
    },
    toolsItem: {
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",

    },
    item: {
      color: "#FBAC2B",
      alignSelf:'center',
      fontSize:16,
    },
    circle_outter:{
      marginBottom: 6,
      alignSelf:'center',
      width: 88,
      height: 88,
    },

  });
