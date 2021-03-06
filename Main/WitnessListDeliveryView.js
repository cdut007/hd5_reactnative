import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Platform,
    ListView,
    RefreshControl,
    ActivityIndicator,
    TouchableNativeFeedback,
    TouchableHighlight,
    InteractionManager,
    ScrollView,
    DeviceEventEmitter,
} from 'react-native';
import HttpRequest from '../HttpRequest/HttpRequest'
import Dimensions from 'Dimensions';
import NavBar from '../common/NavBar'
import LoadMoreFooter from '../common/LoadMoreFooter.js'
import LoadingView from '../common/LoadingView.js'
import px2dp from '../common/util'
import SearchBar from '../common/SearchBar';
import dateformat from 'dateformat'
import WitnessDetailView from './WitnessDetailView';
import CommitButton from '../common/CommitButton'
import CheckBox from 'react-native-checkbox'
import Spinner from 'react-native-loading-spinner-overlay'
import LoadEmptyView from '../common/LoadEmptyView.js'
import ConstMapValue from '../common/ConstMapValue.js';

const isIOS = Platform.OS == "ios"
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
var pagesize = 10;
var pageNo = 1;

var resultsCache = {
  dataForQuery: {},
  nextPageNumberForQuery: {},
  totalForQuery: {},
};
var LOADING = {};
import Global from '../common/globals.js'

import MemberSelectView from '../common/MemberSelectView'

export default class WitnessListDeliveryView extends Component {
    constructor(props) {
        super(props)
        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

       LOADING = {};
       if (Global.UserInfo.witnessmonitor) {
            var data = []
            for (var i = 0; i < Global.UserInfo.witnessmonitor.length; i++) {
                data.push(Global.UserInfo.witnessmonitor[i].user.realname)
            }
       }else{
           Global.log('can not find the monitor class info.')
       }
        var displayTeamQC = '选择QC1组长'
        if (this.props.tag == 'QC2') {
            displayTeamQC = '选择QC2组长'
        }

        this.state = {
            dataSource: ds,
            isLoading: false,
            filter: '',
            isRefreshing:false,
            items:[],
            totalCount:0,
            QCTeamMember:null,
            label:displayTeamQC,
            displayTeamQC:displayTeamQC,
            members:data,
            choose_teamQC:null,


        }


    }

    _closeLoading() {
		this.setState({
			showLoading: false
		})
	}


        back() {
            this.props.navigator.pop()
        }

    search() {

    }


        _onRefresh() {
            if (!this.state.QCTeamMember) {
                this.getWitnessTeam();
            }

            Global.log("_onRefresh() --> ");
            this.setState({isRefreshing:true})

            this.executePlanRequest(1);
        }

        _loadMoreData() {
            Global.log("_loadMoreData() --> ");
             pageNo = parseInt(this.state.items.length / pagesize) + 1;
            this.executePlanRequest(pageNo);
        }

        _toEnd() {
            Global.log("触发加载更多 toEnd() --> ");
            //Global.log("加载更多？ ",userReducer.isLoadingMore, userReducer.products.length, userReducer.totalProductCount,userReducer.isRefreshing);
            //ListView滚动到底部，根据是否正在加载更多 是否正在刷新 是否已加载全部来判断是否执行加载更多
            if (this.state.items.length >= this.state.totalCount || this.state.isRefreshing) {//userReducer.isLoadingMore ||
                return;
            };
            InteractionManager.runAfterInteractions(() => {
                this._loadMoreData();
            });
        }

        _renderFooter(label,index) {
            //const { userReducer } = this.props;
            //通过当前product数量和刷新状态（是否正在下拉刷新）来判断footer的显示
            if (this.state.isRefreshing || this.state.isLoading ) {
                return null
            };

            if (this.state.items.length < 1) {
                return <LoadEmptyView />
            };

            if (this.state.items.length < this.state.totalCount) {
                //还有更多，默认显示‘正在加载更多...’
                return <LoadMoreFooter />
            }else{
                // 加载全部
                return <LoadMoreFooter isLoadAll={true}/>
            }
        }



    componentDidMount() {

        this.executePlanRequest(1);
        this.getWitnessTeam();

    }

    onGetWitnessTeamDataSuccess(response){
      var roleType = ''
       if (response) {
           if (this.props.tag == 'QC1') {//qc1
               roleType = 'witness_team_qc1'
           }else{
               roleType = 'witness_team_qc2'
           }
           var data = response.responseResult
           var QCTeamMember = []
           for (var i = 0; i < data.length; i++) {
               if (roleType == data[i].roles[0].roleType[0]) {
                   QCTeamMember.push(data[i])
               }

           }
             this.setState({QCTeamMember:  QCTeamMember})
       }

    }
    getWitnessTeam(){

        var paramBody = {
            teamType:'WITNESS_TEAM'
        }

        HttpRequest.get('/team/witness', paramBody, this.onGetWitnessTeamDataSuccess.bind(this),
            (e) => {


                try {
                    var errorInfo = JSON.parse(e);
                    if (errorInfo != null) {
                     Global.log(errorInfo)
                    } else {
                        Global.log(e)
                    }
                }
                catch(err)
                {
                    Global.log(err)
                }

                Global.log('Task error:' + e)
            })
    }

    renderCheckBox(item,rowID) {

    if (Global.isCaptain(Global.UserInfo)) {
            return
        }

    if (!item) {
        return ({})
    }



    return (<CheckBox
        label=''
        checkedImage={require('../images/choose_icon_click.png')}
        uncheckedImage={require('../images/choose_icon.png')}
        checked={item.selected == null ? false : item.selected}
        onChange={(checked) => {
            Global.log(checked+'check item=='+item.id+';selected='+item.selected)
            item.selected = !checked
            let _item = Object.assign({}, this.state.items[rowID], {'selected': item.selected});
            this.state.items[rowID] = item
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(Object.assign({}, this.state.items, {[rowID]: _item})),
            })


        }
        }
    />)
}

    onGetDataSuccess(response,paramBody){

         Global.log('onGetDataSuccess@@@@')
     var query = this.state.filter;
     if (!query) {
         query = '';
     }

        var datas = response.responseResult.data;

        if (!datas) {
            datas = []
        }

        if (this.state.filter !== query) {
            this.setState({
                isRefreshing:false,
            });
           // do not update state if the query is stale
           Global.log('executePlanRequest:pagesize this.state.filter !== query'+this.state.filter+";query="+query)
           return;
         }

         var status = paramBody.status

        if (this.state.isRefreshing || pageNo == 1 ) {
            this.state.items = datas;
            pageNo = 1;
        }else{
            for (var i = 0; i < datas.length; i++) {
                this.state.items.push(datas[i])
            }
        }

        this.setState({
            dataSource:this.state.dataSource.cloneWithRows(this.state.items),
            isLoading: false,
            isRefreshing:false,
            totalCount:response.responseResult.totalCounts
        });

    }

    onItemPress(itemData){
        this.props.navigator.push({
            component: WitnessDetailView,
             props: {
                 data:itemData,
                }
        })
    }


    hasMore(){


      }


        onSearchChange(event) {
           var filter = event.nativeEvent.text.toLowerCase();
        //    this.clearTimeout(this.timeoutID);
        //    this.timeoutID = this.setTimeout(() => this.executePlanRequest(pagesize,1,filter), 100);
        }




    executePlanRequest(index){

      Global.log('executePlanRequest pageNo:'+index)
                var loading = false;
                if (this.state.items.length == 0) {
                        loading = true
                }

                 this.setState({
                   isLoading: loading,
                 });


                 var paramBody = {
                      pagesize:pagesize,
                      pagenum:index,
                      type:this.props.type,
                      status:this.props.status,
                      noticePointType:this.props.tag,
                     }

                     if (this.props.keyword) {
                         paramBody.keyword = this.props.keyword
                     }

            HttpRequest.get('/witness', paramBody, this.onGetDataSuccess.bind(this),
                (e) => {

                    this.setState({
                      dataSource: this.state.dataSource.cloneWithRows([]),
                      isLoading: false,
                      isRefreshing:false,
                    });
                    try {
                        var errorInfo = JSON.parse(e);
                        if (errorInfo != null) {
                         Global.log(errorInfo)
                        } else {
                            Global.log(e)
                        }
                    }
                    catch(err)
                    {
                        Global.log(err)
                    }

                    Global.log('Task error:' + e)
                })
    }



    render() {
        return (
            <View style={styles.container}>
            {this.renderChooseOptions()}
            {this.renderTitleCols()}
            {this.renderListView()}
            {this.renderCommitBtn()}
            <LoadingView showLoading={ this.state.isLoading } closeLoading={ this._closeLoading.bind(this)}></LoadingView>
            <Spinner
                visible={this.state.loadingVisible}
            />
            </View>
        )
    }





    QCSelectedPress(index){


        this.state.selectIndex = index ;
        this.setState({selectIndex:index,dataSource:this.state.dataSource.cloneWithRows([])})

    }

    slectItem(isSeleted,title,index){
        if (isSeleted) {
            return(<TouchableOpacity
            onPress={this.QCSelectedPress.bind(this,index)}
            style={{borderWidth:0.5,
                  alignItems:'center',
                  borderColor : '#6d9ee1',
                  height:34,
                  backgroundColor : '#6d9ee1',
                  borderRadius : 20,flexDirection:'row',alignSelf:'stretch',paddingLeft:10,paddingRight:10,paddingTop:8,paddingBottom:8}}>

                  <Text
                  style={{color:'#ffffff',fontSize:16,flex:1,textAlign:'center'}}>{title}</Text>
            </TouchableOpacity>)
        }else{
            return(<TouchableOpacity
            onPress={this.QCSelectedPress.bind(this,index)}
            style={{borderWidth:0.5,
                  alignItems:'center',
                  borderColor : '#6d9ee1',
                  height:34,
                  backgroundColor : 'white',
                  borderRadius : 20,flexDirection:'row',alignSelf:'stretch',paddingLeft:10,paddingRight:10,paddingTop:8,paddingBottom:8}}>

                  <Text
                  style={{color:'#6d9ee1',fontSize:16,flex:1,textAlign:'center'}}>{title}</Text>
            </TouchableOpacity>)
        }
    }


    onSelectedMember(member){

        Global.log(JSON.stringify(member)+"member====");
         this.state.choose_teamQC = member[0]
         this.setState({displayTeamQC:member[0]})

    }

    renderChooseOptions(){
        if (Global.isMonitor(Global.UserInfo)){
            var teamQC = []
            if (this.state.QCTeamMember) {
                for (var i = 0; i < this.state.QCTeamMember.length; i++) {
                    teamQC.push(this.state.QCTeamMember[i].realname)
                }
            }

            return(
                <View style={[{marginTop:10,alignItems:'center',},styles.statisticsflexContainer]}>

                <View style={[styles.cell,{alignItems:'center',padding:10,backgroundColor:'#f2f2f2'}]}>

                <TouchableOpacity
                onPress={() => this._selectM.onPickClick()}
                style={{borderWidth:0.5,
                      alignItems:'center',
                      borderColor : '#f77935',
                      backgroundColor : 'white',
                      borderRadius : 4,flexDirection:'row',alignSelf:'stretch',paddingLeft:10,paddingRight:10,paddingTop:8,paddingBottom:8}}>

                      <MemberSelectView
                      ref={(c) => this._selectM = c}
                      style={{color:'#f77935',fontSize:14,flex:1,textAlign:'left'}}
                      title={this.state.displayTeamQC}
                      data={teamQC}
                      pickerTitle={this.state.label}
                      onSelected={this.onSelectedMember.bind(this)} />
                                    <Image
                                    style={{width:20,height:20}}
                                    source={require('../images/unfold.png')}/>
                </TouchableOpacity>

                </View>



                </View>

            )

        }
    }

    renderCommitBtn(){
        if (Global.isMonitor(Global.UserInfo)){
            return(<View style={{height:50,}}><CommitButton title={'提交'}
                    onPress={this.startDelivery.bind(this)}></CommitButton></View>
        )
        }
    }

    startDelivery(){

        var selectItems = []
        var ids='';
        this.state.items.map((item, i) => {
                        if (item.selected) {
                            selectItems.push(item.id)
                            ids+=item.id+',';
                            Global.log(item.selected+'status ，selected==='+item.id)
                        }
                    })
        if (selectItems.length == 0) {
            Global.alert('请选择见证')
            return
        }
        ids = ids.substr(0,ids.length-1)

        if (!this.state.choose_teamQC) {
            Global.alert('请选择见证员')
            return
        }
        var teamId = ''

             var data = this.state.QCTeamMember
             for (var i = 0; i < data.length; i++) {
                   if (data[i].realname == this.state.choose_teamQC) {
                       teamId = data[i].id;
                        break
                   }
             }

         this.setState({
             loadingVisible: true
         });
        var paramBody = {
                'ids': ids,
                'teamId':teamId,
            }

        HttpRequest.post('/witness_op/monitor', paramBody, this.onDeliverySuccess.bind(this),
            (e) => {
                this.setState({
                    loadingVisible: false
                });
                try {
                    var errorInfo = JSON.parse(e);
                }
                catch(err)
                {
                    Global.log("error======"+err)
                }
                    if (errorInfo != null) {
                        if (errorInfo.code == -1002||
                         errorInfo.code == -1001) {
                        Global.alert(errorInfo.message);
                    }else {
                        Global.alert(e)
                    }

                    } else {
                        Global.alert(e)
                    }


                Global.log('Login error:' + e)
            })
    }

    onDeliverySuccess(response){
        DeviceEventEmitter.emit('witness_update','witness_update');
        this.setState({
            loadingVisible: false
        });
        Global.showToast(response.message)
        this._onRefresh();
    }

    renderTitleCols(){
    var witness_col_map = ConstMapValue.Witness_Col_Map(this.props.type)
        return(<View  style={{marginTop:10,}}>

        <View style={{backgroundColor:'#d6d6d6',height:0.5,width:width}}>
        </View>



        <View style={styles.statisticsflexContainer}>

        <View style={styles.cell}>

          <Text style={{color:'#1c1c1c',fontSize:10,marginBottom:2,}}>
            {witness_col_map.col1}
          </Text>

        </View>


        <View style={styles.cell}>

        <Text style={{color:'#1c1c1c',fontSize:10,marginBottom:2,}}>
         {witness_col_map.col2}
        </Text>

        </View>

        <View style={styles.cell}>

        <Text style={{color:'#1c1c1c',fontSize:10,marginBottom:2,}}>
        {witness_col_map.col3}
        </Text>

        </View>

        <View style={styles.cell}>

        <Text style={{color:'#1c1c1c',fontSize:10,marginBottom:2,}}>
         {witness_col_map.col4}
        </Text>

        </View>



        <View style={[styles.cell,{flex:0.5}]}>
        </View>




        </View>
        <View style={{backgroundColor:'#d6d6d6',height:0.5,width:width}}>
        </View>

        </View>)
    }

    index(rowID){
     var index = parseInt(rowID) + 1;
        return index;
    }

    renderRow(rowData, sectionID, rowID) {

        itemView = () => {

                return (

                       <View style={styles.itemContainer}>



                        <View style={styles.statisticsflexContainer}>

                         <TouchableOpacity style={styles.cell}  onPress={this.onItemPress.bind(this, rowData)}>

                        <Text numberOfLines={3}  style={{color:'#707070',fontSize:10,marginBottom:2,textAlign:'center'}}>
                          {Global.formatFullDateDisplay(rowData.createDate)}
                        </Text>

                      </TouchableOpacity>


                      <TouchableOpacity style={styles.cell}  onPress={this.onItemPress.bind(this, rowData)}>
                          <Text numberOfLines={2} style={{color:'#707070',fontSize:10,marginBottom:2,}}>
                                {rowData.workStepName}
                          </Text>
                        </TouchableOpacity>

                         <TouchableOpacity style={styles.cell}  onPress={this.onItemPress.bind(this, rowData)}>

                        <Text style={{color:'#707070',fontSize:10,marginBottom:2,}}>
                           {rowData.noticeType}
                        </Text>

                        </TouchableOpacity>

                        <TouchableOpacity style={styles.cell}  onPress={this.onItemPress.bind(this, rowData)}>

                       <Text style={{color:'#707070',fontSize:10,marginBottom:2,}}>
                          {rowData.weldno}
                       </Text>

                       </TouchableOpacity>


                        <View style={[styles.cell,{flex:0.5,}]}>
                        <View style={{  alignItems: 'center', justifyContent: 'center', }}>
                        {this.renderCheckBox(rowData,rowID)}
                        </View>
                       </View>

                        </View>


                        <View style={{backgroundColor: '#d6d6d6',
                        width: width,
                        height: 0.5,}}/>

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
                dataSource={this.state.dataSource}
                renderRow={this.renderRow.bind(this)}
                renderFooter={this._renderFooter.bind(this)}
            	onEndReached={this._toEnd.bind(this)}
                onEndReachedThreshold={10}
                enableEmptySections={true}
                refreshControl={
    						<RefreshControl
    							refreshing={ this.state.isRefreshing }
    							onRefresh={ this._onRefresh.bind(this) }
    							tintColor="gray"
    							colors={['#0755a6', '#0755a6', '#0755a6']}
    							progressBackgroundColor="#ffffff"/>
    						}/>
        )
    }




}


const styles = StyleSheet.create({
    container: {
        width: width,
        height:height-169,
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
        width:width/4,
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
