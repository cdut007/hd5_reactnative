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
import Global from '../../common/globals'
import   ScrollableTabView  from 'react-native-scrollable-tab-view';
import SearchBar from '../../common/SearchBar';

import QuestionList from '../SafeWork/QuestionList';


var width = Dimensions.get('window').width;


export  default class ProblemRectification extends Component {

  constructor(props) {
      super(props)



      this.state = {
          title: "问题查阅",
          detailType:"1003",
          index:0,

      }

      if(this.props.type == 'dept_scan'){
        var name = this.props.deptName+'问题查阅';
         this.state = {
          title: name,
          detailType:"1003",
          index:0,

      }
      }

  }

  rendTabs(){

  if(this.props.type == 'dept_scan'){
     return( <ScrollableTabView locked={true}
        tabBarUnderlineStyle={{backgroundColor: '#f77935'}}
           tabBarBackgroundColor='#FFFFFF'
           tabBarActiveTextColor='#f77935'
           tabBarInactiveTextColor='#777777'
           onChangeTab={(obj) => {
       this.state.index = obj.i ;
}
}
  >

      {this._renderQuetionView("隐患总数","total")}
      {this._renderQuetionView("待整改数","waitingModify")}
       {this._renderQuetionView("超期未整改数","delay")}

  </ScrollableTabView>)
  }else{
     return( <ScrollableTabView locked={true}
        tabBarUnderlineStyle={{backgroundColor: '#f77935'}}
           tabBarBackgroundColor='#FFFFFF'
           tabBarActiveTextColor='#f77935'
           tabBarInactiveTextColor='#777777'
           onChangeTab={(obj) => {
       this.state.index = obj.i ;
}
}
  >

      {this._renderQuetionView("我的问题","mine")}
      {this._renderQuetionView("所有问题","all")}

  </ScrollableTabView>)
  }

   

  }


  _renderQuetionView(label,problemSolveStatus){

 // this.state.problemStatus =  problemSolveStatus;

 return( <View  tabLabel={label} style={styles.container}>

   {this.renderContent()}
   {this.renderSlider()}
  {this.renderQuestionList(problemSolveStatus)}
     </View>)


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

  renderSlider(){

 return (<View style={{backgroundColor:'#d6d6d6',height:0.5,width:width}}>
   </View>)

  }

  renderQuestionList(problemSolveStatus){

    var userId = '';
    var ref;
    if (problemSolveStatus == 'mine') {

          ref="list_Renovating";
    }else if(problemSolveStatus == 'all'){

         ref = "list_finish";

    }else if(problemSolveStatus == 'total'){

         ref = "list_total";

    }else if(problemSolveStatus == 'waitingModify'){

         ref = "list_waitingModify";

    }else if(problemSolveStatus == 'delay'){

         ref = "list_delay";

    }



    if (Global.UserInfo.id) {
        userId = Global.UserInfo.id;
    }
 if(this.props.type == 'dept_scan'){
  return (
       <QuestionList
      style={{alignSelf:'stretch',flex:1}}
      type={this.props.type}
      detailType={this.state.detailType}
      oneOf3Type={problemSolveStatus}
      deptId={this.props.deptId}
      userId={userId}
      navigator={this.props.navigator}
      ref={ref}
      />
   )
 }else{
  return (
       <QuestionList
      style={{alignSelf:'stretch',flex:1}}
      type={this.props.type}
      detailType={this.state.detailType}
      userId={userId}
      probelmType={problemSolveStatus}
      navigator={this.props.navigator}
      ref={ref}
      />
   )
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
              searchMode={true}
              onSearchChanged={(text) => this.onSearchChanged(text)}
              onSearchClose = {this.onSearchClose.bind(this)}
              leftPress={this.back.bind(this)}/>
              {this.rendTabs()}
          </View>
      )
  }

  onSearchChanged(text){

// alert(this.state.index);

  if(this.props.type == 'dept_scan'){
    if(this.state.index == 0){
      this.refs.list_total.onSearchChange(text);
    }else if(this.state.index == 1){
      this.refs.list_waitingModify.onSearchChange(text);
    }else if(this.state.index == 2){
      this.refs.list_delay.onSearchChange(text);
    }
  }else{
    if (this.state.index == 0){

    if (this.refs.list_Renovating) {
          this.refs.list_Renovating.onSearchChange(text);
    }
    }else {
    if (this.refs.list_finish) {
          this.refs.list_finish.onSearchChange(text);
    }
    }
  }



// this.refs.current_ref.onSearchChange(text);
//    console.log(this.state.problemStatus);

  }

  onSearchClose(){
 if(this.props.type == 'dept_scan'){
 if(this.state.index == 0){
      this.refs.list_total.onSearchChange('');
    }else if(this.state.index == 1){
      this.refs.list_waitingModify.onSearchChange('');
    }else if(this.state.index == 2){
      this.refs.list_delay.onSearchChange('');
    }
 }else{
    if (this.state.index == 0){

    if (this.refs.list_Renovating) {
          this.refs.list_Renovating.onSearchChange('');
    }
    }else {
    if (this.refs.list_finish) {
          this.refs.list_finish.onSearchChange('');
    }
    }
 }
  

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
           height:36,
           margin:10,
           textAlign:'center',
           backgroundColor:'white',
         }
  })
