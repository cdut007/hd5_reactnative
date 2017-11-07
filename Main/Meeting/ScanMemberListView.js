import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Platform,
    ListView,
    ActivityIndicator,
    TouchableNativeFeedback,
    TouchableHighlight,
    AsyncStorage,
    DeviceEventEmitter,
    BackAndroid
} from 'react-native';
import HttpRequest from '../../HttpRequest/HttpRequest'
import Dimensions from 'Dimensions';
import NavBar from '../../common/NavBar'
import CircleLabelHeadView from '../../common/CircleLabelHeadView';
import px2dp from '../../common/util'
import SearchBar from '../../common/SearchBar';

import CommitButton from '../../common/CommitButton'
import CheckBox from 'react-native-checkbox'

var Global = require('../../common/globals');
const isIOS = Platform.OS == "ios"
var width = Dimensions.get('window').width;


export default class ScanMemberListView extends Component {
    constructor(props) {
        super(props)
        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

       LOADING = {};
        this.state = {
            dataSource: ds,
            isLoading: false,
            isLoadingTail: false,
            filter: '',
            title: '参会人员',
            members:[],
        }


    }


        back() {
            this.props.navigator.pop()
        }

    search() {

    }


    componentDidMount() {
        var data = []

         if (this.props.data.participants) {
             this.setState({members:this.props.data.participants})

             this.setState({
                 data:this.props.data.participants,
                 dataSource:this.state.dataSource.cloneWithRows(this.props.data.participants),
                 isLoading: false,
                 isRefreshing:false,
             });
         }



        BackAndroid.addEventListener('harwardBackPress', () => {

                  return false;
      });

    }

    componentWillUnmount() {
              BackAndroid.removeEventListener('hardwareBackPress');
          }







        componentWillUnmount(){

        }



    onItemPress(rowData,rowID){
         //checked

    }


    hasMore(){


      }

      onEndReached() {




        }

        onSearchChange(event) {
           var filter = event.nativeEvent.text.toLowerCase();
        //    this.clearTimeout(this.timeoutID);
        //    this.timeoutID = this.setTimeout(() => this.executePlanRequest(pagesize,1,filter), 100);
        }

         renderFooter() {
           if (!this.hasMore() || !this.state.isLoadingTail) {
             return <View style={styles.scrollSpinner} />;
           }

           return <ActivityIndicator style={styles.scrollSpinner} />;
         }



    render() {
        return (
            <View style={styles.container}>
                <NavBar
                title={this.state.title}
                leftIcon={require('../../images/back.png')}
                leftPress={this.back.bind(this)} />
               {this.renderListView()}

            </View>
        )
    }



    index(rowID){
     var index = parseInt(rowID) + 1;
        return index;
    }

    renderRow(rowData, sectionID, rowID) {
        itemView = () => {

                return (
                       <View style={styles.itemContainer}>
                        <TouchableOpacity style={[{flexDirection:'row',alignItems: 'center',alignSelf:'stretch',backgroundColor:'#ffffff'}]} onPress={this.onItemPress.bind(this, rowData,rowID)}>

                        <View style={styles.flexContainer}>

                        <CircleLabelHeadView style={styles.head_cell}
                            contactName = {rowData.realname}
                        >

                        </CircleLabelHeadView>

                        <Text style={[styles.content,{marginLeft:10}]}>
                          {rowData.realname}
                        </Text>

                        <View style= {[styles.cellLine,{marginLeft:8,marginRight:8,marginTop:20,marginBottom:20}]}/>

                        <Text style={{color:'#888888',fontSize:14,marginLeft:4,}}>
                          {rowData.roles[0].name}
                        </Text>

                        </View>





                        </TouchableOpacity>
                            <View style={styles.divider}/>

                        </View>

                )

        }
        return (
            <View style={styles.itemView}>
                {itemView()}
            </View>
        )
    }
    renderListView() {
        return (
            <ListView
                style={{ }}
                dataSource={this.state.dataSource}
                renderRow={this.renderRow.bind(this)}
                renderFooter={this.renderFooter.bind(this)}
                onEndReached={this.onEndReached.bind(this)}
               automaticallyAdjustContentInsets={false}
               keyboardDismissMode="on-drag"
               keyboardShouldPersistTaps={true}
               showsVerticalScrollIndicator={false}
            />
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
    list:
    {
        flex: 1,
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

    },
     statisticsflexContainer: {
              height: 57.5,
              backgroundColor: '#ffffff',
              flexDirection: 'row',
          },

    cell: {
        flex: 1,
        height: 57.5,
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
