import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Platform,
    TouchableNativeFeedback,
    TouchableHighlight,
    ListView,
    Picker,
    TextInput
} from 'react-native';

import HttpRequest from '../HttpRequest/HttpRequest'
import NavBar from '../common/NavBar'
import CheckBox from 'react-native-checkbox'
import ModalDropdown from 'react-native-modal-dropdown';
import Dimensions from 'Dimensions';
import WorkStepScanView from './WorkStepScanView'
import WorkStepUpdateView from './WorkStepUpdateView'
var width = Dimensions.get('window').width;




export default class WorkStepDetailView extends Component {
    constructor(props) {
        super(props)
        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

        this.state = {
            data:this.props.data,
            dataSourceList:[],
            dataSource: ds.cloneWithRows([])
        }
    }



    componentDidMount() {
        this.getWorkStep()

    }

    getWorkStep(){
        var paramBody = {
            'pagesize':20,
            'pagenum':1
            }
        HttpRequest.get('/hdxt/api/baseservice/workstep/rollingplan/'+this.state.data.id, paramBody, this.onGetWorkStepSuccess.bind(this),
            (e) => {
                try {
                    alert(e)
                }
                catch (err) {
                    console.log(err)
                }
            })
    }

    onGetWorkStepSuccess(response) {
        console.log('onGetWorkStepSuccess:' + JSON.stringify(response))

        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        var dataSourceList = response.responseResult.datas;
        this.setState({
            dataSourceList:dataSourceList,
            dataSource: ds.cloneWithRows(dataSourceList)
        })
    }

    back() {
        this.props.navigator.pop()
    }

    renderWorkStepText(rowData,buttonIndex){



        if (buttonIndex == 0) {
            rowData.click_0 = false;
            rowData.showEditWitness = false;

            if (rowData.witnesserb
                || rowData.witnesserc
                || rowData.witnesserd
                || rowData.noticeaqa
                || rowData.noticeaqc1
                || rowData.noticeaqc2 ) {
                rowData.click_0 = true;
                rowData.showEditWitness = true;
                return(<Text style={styles.Button}>
                          见证
                  </Text>)
            }

        }else{
            rowData.click_1 = false;

            if (rowData.stepflag == 'DONE') {
                rowData.click_1 = true;
                return(<Text style={styles.Button}>
                      已完成
              </Text>)
          }else if (rowData.stepflag == 'UNDO') {
                    return(<Text  style={styles.GaryButton}>
                          未开始
                  </Text>)
            }else if (rowData.stepflag == 'PREPARE') {
                    if (this.state.data.rollingplanflag == 'PROBLEM') {
                        return(<Text  style={styles.GaryButton}>
                              问题停滞
                      </Text>)
                  }else{
                      rowData.click_1 = true;
                      return(<Text style={styles.Button}>
                            更新
                    </Text>)
                  }

              }else if (rowData.stepflag == 'WITNESS') {
                        return(<Text style={styles.GaryButton}>
                              见证停滞
                      </Text>)
                }

        }

    }

    renderItemOnlyScan(rowData,rowID){
        return(
            <TouchableOpacity onPress={this.onScanItemPress.bind(this,rowData,rowID)}>
            <View style={styles.itemContainer}>

          <View style={styles.flexContainer}>

          <View style={styles.cell}>

            <Text style={styles.content}>
              {rowData.stepno}
            </Text>
          </View>

          <View style={styles.cell2}>
            <Text style={styles.content}>
              {rowData.stepname}
            </Text>
          </View>

          <View  style={styles.cell3}
              >

          </View>


          {this.showEnter(rowData)}


          </View>

            <View style={styles.divider}/>

          </View>
         </TouchableOpacity>)
    }


    renderItem(rowData,rowID){
        if (this.props.isTaskConfirm) {
            return(<View>{this.renderWorkStepItem(rowData,rowID)}</View>);
        }else{
            return(<View>{this.renderItemOnlyScan(rowData,rowID)}</View>);
        }
    }

    renderWorkStepItem(rowData,rowID){
        return( <View style={styles.itemContainer}>
          <View>
          <View style={styles.flexContainer}>
          <View style={styles.cell}>

            <Text style={styles.content}>
              {rowData.stepno}
            </Text>
          </View>

          <View style={styles.cell2}>
            <Text style={styles.content}>
              {rowData.stepname}
            </Text>
          </View>


          <TouchableOpacity onPress={this.onItemPress.bind(this,rowData,rowID,0)} style={styles.cell3}
              >

             {this.renderWorkStepText(rowData,0)}

          </TouchableOpacity>

          <TouchableOpacity onPress={this.onItemPress.bind(this,rowData,rowID,1)} style={styles.cell4}
             >

             {this.renderWorkStepText(rowData,1)}

          </TouchableOpacity>

          </View>

          </View>

            <View style={styles.divider}/>
          </View>)
    }

    render() {
        return (
            <View style={styles.container}>
                <NavBar
                    title="工序详情"
                    leftIcon={require('../images/back.png')}
                    leftPress={this.back.bind(this)} />
                {this.renderListView()}

            </View>
        )
    }



     getWitnessAddress(itemData){
         var dataSourceList = this.state.dataSourceList;
         for(var i=dataSourceList.length-1;i>=0;i--){
             if (dataSourceList[i].witnessInfo && dataSourceList[i].witnessInfo.length > 0) {
                 var addressInfo =  dataSourceList[i].witnessInfo[0];
                 if (addressInfo.witnessaddress) {
                     return addressInfo.witnessaddress;
                 }
             }
         }

         //last
         if (dataSourceList.length>0 && dataSourceList[0].witnessInfo && dataSourceList[0].witnessInfo.length > 0) {
             var addressInfo =  dataSourceList[0].witnessInfo[0];
             if (addressInfo.witnessaddress) {
                 return addressInfo.witnessaddress;
             }
         }

         return '';
     }

     showEnter(itemData){
         if (itemData.stepflag == 'DONE') {
             return(<Image source={require('../images/right_enter_blue.png')} style={{margin:8}}></Image>)
         }
     }

     onScanItemPress(itemData,rowID){

             if (itemData.stepflag != 'DONE'){
                 return
             }
             var dataSourceList = this.state.dataSourceList;

            this.props.navigator.push({
                component: WorkStepScanView,
                 props: {
                     data:itemData,
                     lastItem: rowID == dataSourceList.length - 1,
                     witnessAdress:this.getWitnessAddress(itemData),
                    }
            })

     }

     onItemPress(itemData,rowID,buttonIndex){

         console.log(';itemData.showEditWitness='+itemData.showEditWitness);
         if (itemData.click_0 && buttonIndex == 0 || itemData.click_1 && buttonIndex == 1) {
             if (itemData.stepflag == 'DONE' && !itemData.showEditWitness){
                 this.onScanItemPress(itemData,rowID)
             }else{
                  var dataSourceList = this.state.dataSourceList;
                 this.props.navigator.push({
                     component: WorkStepUpdateView,
                      props: {
                          data:itemData,
                          lastItem:rowID == dataSourceList.length - 1,
                          witnessAdress:this.getWitnessAddress(itemData),
                          editWitness: buttonIndex == 0? true :false,
                         }
                 })
             }

         }


     }



    renderRow(rowData, sectionID, rowID) {
        menuView = () => {

                return (
                    <View>
                     {this.renderItem(rowData,rowID)}
                    </View>
                )
            }

        return (
            <View style={styles.itemView}>
                {menuView()}
            </View>
        )
    }


    renderListView() {
        return (
            <ListView
                style={{ }}
                dataSource={this.state.dataSource}
                renderRow={this.renderRow.bind(this)}
            />
        )
    }


}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },

    divider: {
    backgroundColor: '#8E8E8E',
    width: width,
    height: 0.5,
    }   ,
    flexContainer: {
           height: 50,
           width: width,
           backgroundColor: '#ffffff',
           // 容器需要添加direction才能变成让子元素flex
           flexDirection: 'row',
           alignItems: 'center',
    },
    itemContainer: {
            flex:1,
            flexDirection:'column'
    },
    GaryButton:
    {
        height: 30,
        width: 60,
        margin:6,
        color: '#ffffff',
        fontSize: 14,
        backgroundColor: '#e8e8e8',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign:'center',
        textAlignVertical: 'center',
        alignSelf: 'center',
        fontFamily: 'sans-serif',

    },
    ButtonContainer:
    {
        justifyContent: 'center',
        alignItems: 'center',
    },
    Button:
    {

        height: 30,
        width: 60,
        margin:6,
        color: '#ffffff',
        fontSize: 14,
        backgroundColor: '#00a629',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign:'center',
        textAlignVertical: 'center',
        alignSelf: 'center',
        fontFamily: 'sans-serif',
    },
    cell: {
        flex: 1,
        height: 50,
        justifyContent: "center",
        alignItems: 'center',
    },
    cell2: {
        flex: 4,
        height: 50,
        justifyContent: "center",
        alignItems: 'center',
    },
    cell3: {
        flex: 2,
        height: 50,
        justifyContent: "center",
        alignItems: 'center',
    },
    cell4: {
        flex: 2,
        height: 50,
        justifyContent: "center",
        alignItems: 'center',
    },
    content:{
            color: '#000000',
            fontSize:14,
    },
})
