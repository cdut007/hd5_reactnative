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


export default class ChooseMemberListView extends Component {
    constructor(props) {
        super(props)
        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

       LOADING = {};
        this.state = {
            dataSource: ds,
            isLoading: false,
            isLoadingTail: false,
            filter: '',
            title: this.props.department.name,
            members:[],
            selectAll:false,
        }


    }


        back() {
            this.updateCheck()
            this.props.navigator.pop()
        }

    search() {

    }
    updateCheck(){
        if (!this.props.data.members) {
            this.props.data.members = []
        }




        for (var i = 0; i < this.state.members.length; i++) {
            var item = this.state.members[i]

            var exsit = -1
            var checkItem;
            for (var j = 0; j < this.props.data.members.length; j++) {
                 checkItem = this.props.data.members[j]
                if (checkItem.id == item.id) {
                    exsit = j
                    break

                }else{

                }
            }

            if (item.selected) {
                //add
                if (exsit<0) {
                  this.props.data.members.push(item)
                }

            }else{
                //remove
                if (exsit >-1) {
                         this.props.data.members.splice(exsit, 1);
                }
            }


        }

        this.props.refresh()
    }

    componentDidMount() {
        var data = []
        this.parseMemmbersFromDept(this.props.department,data)
        this.checkMemberIsSelected(data)
        Global.log('members  length :' + data.length)
        this.setState({members:data})

        this.setState({
            dataSource:this.state.dataSource.cloneWithRows(data),
            isLoading: false,
            isRefreshing:false,
        });

        BackAndroid.addEventListener('harwardBackPress', () => {
                    this.updateCheck()
                  return false;
      });

    }

    componentWillUnmount() {
              BackAndroid.removeEventListener('hardwareBackPress');
          }



     parseMemmbersFromDept(department,datas){
         if (department) {

             if (department.users) {
                 for (var i = 0; i < department.users.length; i++) {
                    datas.push(department.users[i])

                 }
             }

             if (department.children) {
                 for (var i = 0; i < department.children.length; i++) {
                      this.parseMemmbersFromDept(department.children[i],datas)
                 }
             }


         }else{
              Global.log('members  length -not found--')
         }
     }

     commit(){
            var newdata = []
            this.state.selectAll = !this.state.selectAll
          for (var i = 0; i < this.state.members.length; i++) {
              this.state.members[i].selected = true
              let _item = Object.assign({}, this.state.members[i], {'selected': this.state.selectAll});
              newdata.push(_item)
          }

          this.setState({members:newdata,dataSource: this.state.dataSource.cloneWithRows(newdata),})

     }

     checkMemberIsSelected(data){
         if (this.props.data.members && this.props.data.members.length > 0) {
             for (var i = 0; i < data.length; i++) {
                  var item = data[i]
                 for (var j = 0; j < this.props.data.members.length; j++) {
                     var id = this.props.data.members[j].id
                     if (item.id == id) {
                         item.selected = true
                         break
                     }
                 }

                  //update.

             }
         }
     }

        componentWillUnmount(){

        }



    onItemPress(rowData,rowID){
         //checked
         rowData.selected = !rowData.selected
         this.state.selectAll = false

             let _item = Object.assign({}, this.state.members[rowID], {'selected': rowData.selected});
             this.state.members[rowID] = rowData

             this.setState({
                 dataSource: this.state.dataSource.cloneWithRows(Object.assign({}, this.state.members, {[rowID]: _item})),
             })

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
               {this.renderCommitBtn()}
            </View>
        )
    }

    renderCommitBtn(){
            var count = 0
            for (var i = 0; i < this.state.members.length; i++) {
                 if (this.state.members[i].selected) {
                     count++
                 }
            }
            var title = '全选'
            if (count>0) {
                title = '全选'+"("+count+")"
            }
            return(<View style={{height:50,width:width}}><CommitButton title={title}
                    onPress={this.commit.bind(this)}></CommitButton></View>
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
                        <TouchableOpacity style={[{paddingLeft:10,flexDirection:'row',alignItems: 'center',alignSelf:'stretch',backgroundColor:'#ffffff'}]} onPress={this.onItemPress.bind(this, rowData,rowID)}>
                        <CheckBox
                            label=''
                            checkedImage={require('../../images/choose_icon_click.png')}
                            uncheckedImage={require('../../images/choose_icon.png')}
                            checked={rowData.selected == null ? false : rowData.selected}
                            onChange={(checked) => {
                                 this.state.selectAll = false
                                rowData.selected = !checked

                                    let _item = Object.assign({}, this.state.members[rowID], {'selected': rowData.selected});
                                    this.state.members[rowID] = rowData

                                    this.setState({
                                        dataSource: this.state.dataSource.cloneWithRows(Object.assign({}, this.state.members, {[rowID]: _item})),
                                    })

                            }
                            }
                        />

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
