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
import px2dp from '../../common/util'
import dateformat from 'dateformat'
import Global from '../../common/globals.js';
import ConstMapValue from '../../common/ConstMapValue.js';

const isIOS = Platform.OS == "ios"
var width = Dimensions.get('window').width;
import QualityCheckList from './QualityCheckList'
import ProblemReport from './ProblemReport'
import   ScrollableTabView  from 'react-native-scrollable-tab-view';



var LOADING = {};







export default class ProblemView extends Component {
    constructor(props) {
        super(props)


        this.state = {

            title: "质量管理",
            keyword:'',
        }


    }


        back() {
            this.props.navigator.pop()
        }




    componentDidMount() {


    }





    rendTabs(){
        return( <ScrollableTabView locked={true}
               tabBarUnderlineStyle={{backgroundColor: '#f77935'}}
               tabBarBackgroundColor='#FFFFFF'
               tabBarActiveTextColor='#f77935'
               tabBarInactiveTextColor='#777777'>

         {this.renderFeedbackView('报告问题',0)}
         {this._renderQuetionView('问题追踪',1)}
    </ScrollableTabView>

        )


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
                leftPress={this.back.bind(this)} />
                {this.rendTabs()}
            </View>
        )
    }

    onSearchChanged(text){
      if (this.refs.myQuestionlist) {
            this.refs.myQuestionlist.onSearchChange(text);
      }
    }

    onSearchClose(){
      if (this.refs.myQuestionlist) {
            this.refs.myQuestionlist.onSearchChange('');
      }
    }

    renderFeedbackView(label,index) {
        return (
            <ProblemReport
            tabLabel={label}
             style={{alignSelf:'stretch',flex:1}}
             type={this.props.type}
             navigator={this.props.navigator}
             />

        )
    }

    _renderQuetionView(label){

   return( <View  tabLabel={label} style={styles.container}>


     {this.renderContent()}
     {this.renderListView()}

       </View>)


    }

    renderListView() {

        var userId = '';

        return (<QualityCheckList
           style={{alignSelf:'stretch',flex:1}}
           detailType={"1003"}
           navigator={this.props.navigator}
           ref="myQuestionlist"
           />)
    }

    renderContent(){

       return(
         <View>
         <View style={styles.statisticsflexContainer}>

         <View style={styles.cell}>
          <Text style={{color:'#1c1c1c',fontSize:12,marginBottom:2,}}>
             问题编号
           </Text>
         </View>

         <View style={styles.cell}>
         <Text style={{color:'#1c1c1c',fontSize:12,marginBottom:2,}}>
           机组
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




}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
    },
    topView: {
        height: 150,
        width: width,
    },

    divider: {
    backgroundColor: '#d6d6d6',
    width: width,
    height: 0.5,
    },
    label:{
            color: '#ffffff',
            fontSize:16,
    },
    content:{
            color: '#1c1c1c',
            fontSize:16,
    },
    scrollSpinner: {
       marginVertical: 20,
     },
    flexContainer: {
           height: 54,
           width: width,
           backgroundColor: '#ffffff',
           // 容器需要添加direction才能变成让子元素flex
           flexDirection: 'row',
           alignItems: 'center',
           padding:10,
    },
    itemContainer: {
            flex:1,
            marginTop:0.5,
    },
     statisticsflexContainer: {
              height: 57.5,
              backgroundColor: '#ffffff',
              flexDirection: 'row',
          },

    cell: {
        flex: 1,
        height: 57.5,
        width:width/3,
        justifyContent: "center",
        alignItems: 'center',
         flexDirection: 'column',
    },

    cellLine: {
        width: 2,
        height: 14,
        backgroundColor: '#cccccc',
    },

});
