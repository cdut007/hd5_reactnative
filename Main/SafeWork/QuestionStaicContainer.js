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
          title: "问题审核",
      }
  }

  render() {
      return (
          <View style={styles.container}>
              <NavBar
              title={this.state.title}
              leftIcon={require('../../images/back.png')}
              leftPress={this.back.bind(this)}/>
            {this.rendTabs()}

          </View>
      )
  }


 _renderQuetionView(label){

return( <View  tabLabel={label} style={styles.container}>

       {this.renderSearchBar()}
       {this.renderContent()}
       {this.renderSlider()}
       {this.renderQuestionList()}

    </View>)


 }

  rendTabs(){

   if (this.props.itemType == 'DCL') {

     return( <ScrollableTabView
         tabBarUnderlineStyle={{backgroundColor: '#f77935'}}
            tabBarBackgroundColor='#FFFFFF'
            tabBarActiveTextColor='#f77935'
            tabBarInactiveTextColor='#777777'
 >

       {this._renderQuetionView("新问题")}
       {this._renderQuetionView("待审核")}

 </ScrollableTabView>)

   }
   else {
     return (
       <View style={styles.container}>

           {this.renderSearchBar()}
           {this.renderContent()}
           {this.renderSlider()}
           {this.renderQuestionList()}

       </View>


     )
   }

  }

  renderSlider(){

 return (<View style={{backgroundColor:'#d6d6d6',height:0.5,width:width}}>
   </View>)

  }


  renderContent(){

     return(
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



     )


  }

  renderSearchBar(){

   return(
     <View style={styles.SearchBarStyle}>
               <SearchBar
               isLoading={false}
               onSearchChange={(event) =>
               this.refs.myQuestionlist.onSearchChange(event)}
               />
     </View>

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

  renderQuestionList(){

    var userId = '';
    if (this.props.data.user) {
        userId = this.props.data.user.id
    }


   return (<QuestionList
      style={{alignSelf:'stretch',flex:1}}
      type={this.props.type}
      userId={userId}
      status={"UNCOMPLETE"}
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
        justifyContent: 'flex-start',
        alignItems: 'center',
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
         },
         SearchBarStyle : {
              borderRadius: 6,
              borderColor: '#cccccc',
              borderWidth : 1,
              marginTop: 5,
              marginBottom: 5,
              width: width - 20,

         }
  })
