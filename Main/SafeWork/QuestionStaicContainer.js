import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Platform,
    ScrollView,
    RefreshControl,
    ActivityIndicator,
    TouchableNativeFeedback,
    TouchableHighlight,
    InteractionManager,
} from 'react-native';
import HttpRequest from '../../HttpRequest/HttpRequest'
import Dimensions from 'Dimensions';
import NavBar from '../../common/NavBar'
import LoadMoreFooter from '../../common/LoadMoreFooter.js'
import CircleLabelHeadView from '../../common/CircleLabelHeadView';
import SearchBar from '../../common/SearchBar';
import dateformat from 'dateformat'
import Global from '../../common/globals.js';
import QuestionList from '../SafeWork/QuestionList'


const isIOS = Platform.OS == "ios"
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

import   ScrollableTabView  from 'react-native-scrollable-tab-view';


export default class QuestionStaicContainer extends Component {

  constructor(props) {
      super(props)

      this.state = {
          title: this.props.data.item.title,
          detailType:this.props.detailType,
          problemStatus:this.props.problemStatus,
      }
  }

  render() {
      return (
          <View style={styles.container}>
              <NavBar
              title={this.state.title}
              leftIcon={require('../../images/back.png')}
              searchMode={true}
              onSearchChanged={(text) => this.onSearchChanged(text)}
              onSearchClose = {this.onSearchClose.bind(this)}
              leftPress={this.back.bind(this)}/>
            {this.rendTabs()}

          </View>
      )
  }

  onSearchChanged(text){


  }

  onSearchClose(){

  }


 _renderQuetionView(index,label,problemSolveStatus){

this.state.detailType = index;
return( <View  tabLabel={label} style={styles.container}>

       {this.renderContent()}
       {this.renderSlider()}
       {this.renderQuestionList(problemSolveStatus)}

    </View>)


 }

  rendTabs(){

   if (this.props.detailType == '1001') {

     return( <ScrollableTabView
         tabBarUnderlineStyle={{backgroundColor: '#f77935'}}
            tabBarBackgroundColor='#FFFFFF'
            tabBarActiveTextColor='#f77935'
            tabBarInactiveTextColor='#777777'
 >

       {this._renderQuetionView(1001,"新问题","Need_Handle")}
       {this._renderQuetionView(1002,"待审核","Need_Check")}

 </ScrollableTabView>)

   }
   else {
     return (
       <View style={styles.container}>

           {this.renderContent()}
            {this.renderSlider()}
           {this.renderQuestionList(this.state.problemStatus)}

       </View>


     )
   }

  }

  renderSlider(){

 return (
   <View style={{backgroundColor:'d6d6d6',height:0.5,width:width}}>
   </View>)

  }


  renderContent(){

     return(
       <View>
       <View style={styles.statisticsflexContainer}>

       <View style={styles.cell}>
        <Text style={{color:'#1c1c1c',fontSize:12,marginBottom:2,}}>
           提出时间
         </Text>
       </View>

       <View style={styles.cell}>
       <Text style={{color:'#1c1c1c',fontSize:12,marginBottom:2,}}>
         问题名称
       </Text>
       </View>

       <View style={styles.cell}>
       <Text style={{color:'#1c1c1c',fontSize:12,marginBottom:2,}}>
           提出人
       </Text>
       </View>

       <View style={styles.cell}>
       <Text style={{color:'#1c1c1c',fontSize:12,marginBottom:2,}}>
         状态
       </Text>
       </View>

       </View>

       <View style={{backgroundColor:'d6d6d6',height:0.5,width:width}}>
       </View>

       </View>

     )

  }

  renderSearchBar(){

   return(
               <SearchBar
               isLoading={false}
               searchBarInput={styles.searchBarInput}
               searchBar={styles.SearchBarStyle}
               placeholderTextColor="#F77935"
               onSearchChange={(event) =>
               this.refs.myQuestionlist.onSearchChange(event)}
               />


     )

  }

  // onSearchChange(event) {
  //
  //    var filter = event.nativeEvent.text.toLowerCase();
  //
  //
  // //    this.clearTimeout(this.timeoutID);
  // //    this.timeoutID = this.setTimeout(() => this.executePlanRequest(pagesize,1,filter), 100);
  // }

  renderQuestionList(problemStatus){

    var userId = '';
    if (this.props.data.user) {
        userId = this.props.data.user.id
    }


   return (<QuestionList
      style={{alignSelf:'stretch',flex:1}}
      type={this.props.type}
      detailType={this.state.detailType}
      userId={userId}
      status={"UNCOMPLETE"}
      problemStatus={problemStatus}
      problemSolveStatus={this.state.problemSolveStatus}
      navigator={this.props.navigator}
      ref="myQuestionlist"
      />)


  }

  back() {
      this.props.navigator.pop()
  }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
    },
    cell: {
        flex: 1,
        height: 57.5,
        width:width/4,
        justifyContent: "center",
        alignItems: 'center',
         flexDirection: 'column',
    },
    statisticsflexContainer: {
             height: 57.5,
             backgroundColor: '#ffffff',
             flexDirection: 'row',
             marginTop:10,
         },
         SearchBarStyle : {
            backgroundColor: 'rgba(244, 244, 244, 1)',
            width:width,
            height:56,
         },
         searchBarInput:{
           borderColor:"#F77935",
           borderWidth:1,
           borderRadius:4,
           height:Platform.OS === 'android' ?  44 : 36 ,
           margin:10,
           textAlign:'center',
           backgroundColor:'white',
         }
  })
