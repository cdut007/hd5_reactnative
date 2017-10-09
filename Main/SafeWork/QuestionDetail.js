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
    TextInput,

} from 'react-native';

import Dimensions from 'Dimensions';
import NavBar from '../../common/NavBar'
import DisplayItemView from '../../common/DisplayItemView'
import ImageShowsUtil from '../../common/ImageShowUtil'
import CommitButton from '../../common/CommitButton'

var width = Dimensions.get('window').width;

const images = [{
  url: 'https://avatars2.githubusercontent.com/u/7970947?v=3&s=460'
},
{
  url: 'https://avatars2.githubusercontent.com/u/7970947?v=3&s=460'
},
{
url: 'https://avatars2.githubusercontent.com/u/7970947?v=3&s=460'
}]

export default class QuestionDetail extends Component {
  constructor(props) {
    super(props)

     this.state = {
       data : this.props.data,
       title: "问题详情",
       team : this.props.data.team,
       fileArr : images,
       time: this.props.data.time,
     }

  }

  render(){

    return (
        <View style={styles.container}>
            <NavBar
            title={this.state.title}
            leftIcon={require('../../images/back.png')}
            leftPress={this.back.bind(this)}/>
          <ScrollView >
                 {this.renderItem()}
          </ScrollView>
          {this.renderCommitBtn()}
        </View>
    )

  }

  renderCommitBtn(){

    if (this.state.data.type == "1001") {

   return this.renderNewCommit();

    }


  }

  renderNewCommit(){

    return(
      <View style={{height:50,width:width,flexDirection:'row'}}>
    <View style={{height:50,flex:1}}>
      <CommitButton
        title={'不需处理'}
      containerStyle={{backgroundColor:'#ffffff'}}
        titleStyle={{color: '#f77935'}}>
      </CommitButton>
      </View>
      <View style={{height:50,flex:1}}>
        <CommitButton
          title={'分派'}>
        </CommitButton>
      </View>
      </View>)
  }

  renderNewQuestion(){

    var itemAry = [];//视图数组

    var displayAry = [
      {title:'机组',content:this.state.data.machineType,id:'0',noLine:true},
      {title:'厂房',content:this.state.data.plantType,id:'1',noLine:true},
      {title:'标高',content:this.state.data.elevation,id:'2',noLine:true},
      {title:'房间号',content:this.state.data.RoomNumber,id:'3',noLine:true},
      {title:'责任部门',content:this.state.data.ResDepart,id:'4',noLine:true},
    ];


    // 遍历
    for (var i = 0; i<displayAry.length; i++) {
     if (displayAry[i].type == 'devider') {
            itemAry.push(
               <View style={styles.divider}/>
            );
        }else{
            itemAry.push(
                <DisplayItemView
                 key={displayAry[i].id}
                 title={displayAry[i].title}
                 detail={displayAry[i].content}
                 noLine={displayAry[i].noLine}
                />
            );
        }
    }

    itemAry.push(
      this.OPinPutView("责任班组:",this.state.team,"BZ")
    );

    itemAry.push(
       <View style={styles.divider}/>
    );

    itemAry.push(
        <DisplayItemView
         key={5}
         title={"问题描述"}
         detail={this.state.data.describe}
         noLine={true}
        />
    );

    itemAry.push(
      this.renderFileView()
    );

    itemAry.push(
     this.inPutView("整改时间:",this.state.time,"SJ")
    );

    return itemAry;


  }

   onCommit() {

   }

  renderItem(){



   if (this.state.data.type == "1001") {

      return  this.renderNewQuestion()

   }



  }



  OPinPutView(name,inputs,tag){

    return (
      <View style={styles.topContainer}>
            <Text style={styles.title}> {name} </Text>
           {this.renderInputView(inputs,tag)}
           <Text> (选填) </Text>
      </View>

    )

  }

  inPutView(name,inputs,tag){

    return (
      <View style={styles.topContainer}>
            <Text style={styles.title}> {name} </Text>
           {this.renderInputView(inputs,tag)}
      </View>
    )

  }

  renderInputView(inputs,tag){

return(
  <View style={styles.borderStyle}>
  <TouchableOpacity style={styles.touchStyle}>
    <TextInput
        style={{flex: 1, fontSize: 14, color: '#1c1c1c', padding: 5, textAlignVertical: 'top',}}
        underlineColorAndroid ='transparent'
        multiline = {true}
        onChangeText={(text) => this._ontextChange(text,tag) }
        value={inputs} />
 </TouchableOpacity>
  </View>
)

}

renderFileView() {


    return (
        <View style={{flexDirection: 'row', flexWrap: 'wrap', width: width, paddingTop: 10, paddingRight: 10}} horizontal={true} >

                {this.renderImages()}

        </View>
    )
}

renderImages(){

  var imageViews = [];
  {this.state.fileArr.map( (item,i) => {

     imageViews.push(
       <TouchableOpacity
          key={i}
          style={{width:70,height:70,marginLeft:10,marginBottom:10}}
          onPress={this.imageClick.bind(this,i)}>
          <Image resizeMode={'cover'} style={{width:70,height:70,borderWidth:0.5,borderRadius:4}} source={{uri:item['url']}}/>

       </TouchableOpacity>
     );
  })}
 return imageViews;
}

imageClick(index){

  this.props.navigator.push({
      component: ImageShowsUtil,
      props: {
          images:this.state.fileArr,
          imageIndex:index,
         }
  })

}

_ontextChange(text,tag){

switch (tag) {
  case "BZ":
    {
        this.setState({team:text})
    }
    break;
  case "SJ":{
    this.setState({time:text})
  }
    break;
}
}

  back(){

   this.props.navigator.pop();

  }

}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#f2f2f2',
  },
  commitButton:
  {
      // marginTop: 10,
      height: 50,
      width: width,
      backgroundColor: '#f77935',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
  },
  borderStyle: {
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: '#f2f2f2',
    width: width*0.5,
    height: 36,
    flexDirection:'row',
    borderColor : '#f77935',
    borderWidth:0.5,
    borderRadius : 4,
    marginBottom:5,
    marginTop:5,
  },
  touchStyle: {
    alignItems:'center',
    flex:1,
    flexDirection:'row',
    paddingLeft:10,
    paddingRight:10,
    paddingTop:8,
    paddingBottom:8,
  },
  topContainer:{
    justifyContent:'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft:10,
    paddingRight:10,
    backgroundColor:'#ffffff',
  },
  title: {
      width: width * 0.25,
      fontSize: 14,
      color: "#1c1c1c"
  },
  divider: {
  backgroundColor: '#d6d6d6',
  width: width,
  height: 0.5,
  marginLeft:10,
}

})
