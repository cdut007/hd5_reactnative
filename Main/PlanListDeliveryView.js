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
} from 'react-native';
import HttpRequest from '../HttpRequest/HttpRequest'
import Dimensions from 'Dimensions';
import NavBar from '../common/NavBar'
import LoadMoreFooter from '../common/LoadMoreFooter.js'
import LoadingView from '../common/LoadingView.js'
import px2dp from '../common/util'
import SearchBar from '../common/SearchBar';
import dateformat from 'dateformat'
import PlanDetailView from './PlanDetailView';
import CommitButton from '../common/CommitButton'
import CheckBox from 'react-native-checkbox'
import Spinner from 'react-native-loading-spinner-overlay'

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

import DateTimePickerView from '../common/DateTimePickerView'

import MemberSelectView from '../common/MemberSelectView'



export default class PlanListDeliveryView extends Component {
    constructor(props) {
        super(props)
        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

       LOADING = {};
       if (Global.UserInfo.monitor) {
            var data = []
            for (var i = 0; i < Global.UserInfo.monitor.length; i++) {
                data.push(Global.UserInfo.monitor[i].user.realname)
            }
       }else{
           console.log('can not find the monitor class info.')
       }

        this.state = {
            dataSource: ds,
            isLoading: false,
            filter: '',
            isRefreshing:false,
            items:[],
            totalCount:0,
            choose_date:null,
            choose_member:null,
            displayDate:'选择施工日期',
            displayMember:'选择作业组长',
            members:data,

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
            console.log("_onRefresh() --> ");
            this.setState({isRefreshing:true})

            this.executePlanRequest(1);
        }

        _loadMoreData() {
            console.log("_loadMoreData() --> ");
             pageNo = parseInt(this.state.items.length / pagesize) + 1;
            this.executePlanRequest(pageNo);
        }

        _toEnd() {
            console.log("触发加载更多 toEnd() --> ");
            //console.log("加载更多？ ",userReducer.isLoadingMore, userReducer.products.length, userReducer.totalProductCount,userReducer.isRefreshing);
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
            if (this.state.isRefreshing || this.state.items.length < 1) {
                return null
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
            console.log(checked+'check item=='+item.id+';selected='+item.selected)
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
         console.log('onGetDataSuccess@@@@')
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
           console.log('executePlanRequest:pagesize this.state.filter !== query'+this.state.filter+";query="+query)
           return;
         }

         var status = paramBody.status

        if (this.state.isRefreshing) {
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
            component: PlanDetailView,
             props: {
                 data:itemData,
                  type:this.props.type,
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

      console.log('executePlanRequest pageNo:'+index)
                var loading = false;
                if (this.state.items.length == 0) {
                        loading = true
                }

                 this.setState({
                   isLoading: loading,
                 });

                 var userid = ''
                 if (this.props.userId) {
                     userid = this.props.userId
                 }
                 var paramBody = {
                      pagesize:pagesize,
                      pagenum:index,
                      type:this.props.type,
                      status:this.props.status,
                      userId:userid,
                     }

            HttpRequest.get('/rollingplan', paramBody, this.onGetDataSuccess.bind(this),
                (e) => {

                    this.setState({
                      dataSource: this.state.dataSource.cloneWithRows([]),
                      isLoading: false,
                      isRefreshing:false,
                    });
                    try {
                        var errorInfo = JSON.parse(e);
                        if (errorInfo != null) {
                         console.log(errorInfo)
                        } else {
                            console.log(e)
                        }
                    }
                    catch(err)
                    {
                        console.log(err)
                    }

                    console.log('Task error:' + e)
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

    onSelectedDate(date){
     console.log("date=="+date.getTime());
     this.state.choose_date = date.getTime();
     this.setState({displayDate:Global.formatDate(this.state.choose_date)})
    // this.setState({...this.state});
    }

    onSelectedMember(member){
        for (var i = 0; i < Global.UserInfo.monitor.length; i++) {
            if (Global.UserInfo.monitor[i].user.realname == member) {
                this.state.choose_member = Global.UserInfo.monitor[i].user.id;
                this.setState({displayMember:member});
                    console.log(JSON.stringify(member)+"member===="+";id="+this.state.choose_member);
                break;
            }
        }
        console.log(JSON.stringify(member)+"member====");

    }

    onDateClick(){
        if (!this.state.time_visible) {
            this.state.time_visible = false
        }
        this.setState({time_visible:false})
    }

    renderChooseOptions(){
        if (Global.isMonitor(Global.UserInfo)){
            return(
                <View style={[{marginTop:10,alignItems:'center',},styles.statisticsflexContainer]}>

                <View style={[styles.cell,{alignItems:'center',padding:10,backgroundColor:'#f2f2f2'}]}>

                <TouchableOpacity
                 onPress={() => this._selectD.onClick()}
                style={{borderWidth:0.5,
                      alignItems:'center',
                      borderColor : '#f77935',
                      backgroundColor : 'white',
                      borderRadius : 4,flexDirection:'row',alignSelf:'stretch',paddingLeft:10,paddingRight:10,paddingTop:8,paddingBottom:8}}>

                <DateTimePickerView
                  ref={(c) => this._selectD = c}
                    type={'date'}
                    title={this.state.displayDate}
                    visible={this.state.time_visible}
                    style={{color:'#f77935',fontSize:14,flex:1}}
                    onSelected={this.onSelectedDate.bind(this)}
                />
                                    <Image
                                    style={{width:20,height:20}}
                                    source={require('../images/unfold.png')}/>
                </TouchableOpacity>

                </View>


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
                style={{color:'#f77935',fontSize:14,flex:1}}
                title={this.state.displayMember}
                data={this.state.members}
                 pickerTitle={'选择人员'}
                onSelected={this.onSelectedMember.bind(this)} />
                                    <Image
                                    style={{width:20,height:20,}}
                                    source={require('../images/unfold.png')}/>
                </TouchableOpacity>

                </View>

                </View>

            )
        }
    }

    renderCommitBtn(){
        if (Global.isMonitor(Global.UserInfo)){
            return(<View style={{height:50,}}><CommitButton title={'确认分派'}
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
                            console.log(item.selected+'status ，selected==='+item.id)
                        }
                    })
        if (selectItems.length == 0) {
            alert('请选择任务')
            return
        }
        ids = ids.substr(0,ids.length-1)

        if (!this.state.choose_date) {
            alert('请选择施工日期')
            return
        }

        if (!this.state.choose_member) {
            alert('请选择作业组长')
            return
        }
        this.setState({
            loadingVisible: true
        });

        var paramBody = {
                 type:this.props.type,
                'method': 'ASSIGN',
                'ids': ids,
                'userId':this.state.choose_member,
                'consDate':Global.formatFullDate(this.state.choose_date),
            }

        HttpRequest.post('/rollingplan_op', paramBody, this.onDeliverySuccess.bind(this),
            (e) => {
                this.setState({
                    loadingVisible: false
                });
                try {
                    var errorInfo = JSON.parse(e);
                }
                catch(err)
                {
                    console.log("error======"+err)
                }
                    if (errorInfo != null) {
                        if (errorInfo.code == -1002||
                         errorInfo.code == -1001) {
                        alert(errorInfo.message);
                    }else {
                        alert(e)
                    }

                    } else {
                        alert(e)
                    }


                console.log('Login error:' + e)
            })
    }

    onDeliverySuccess(response){
        this.setState({
            loadingVisible: false
        });
        Global.showToast(response.message)
        this._onRefresh();
    }

    renderTitleColsSpace(){
        if (Global.isMonitor(Global.UserInfo)) {
            return(<View style={[styles.cell,{flex:0.5}]}>
            </View>)
        }
    }
    renderTitleCols(){
        return(<View  style={{marginTop:10,}}>

        <View style={{backgroundColor:'#d6d6d6',height:0.5,width:width}}>
        </View>



        <View style={styles.statisticsflexContainer}>

        {this.renderTitleColsSpace()}

        <View style={styles.cell}>

          <Text style={{color:'#1c1c1c',fontSize:10,marginBottom:2,}}>
            图纸号
          </Text>

        </View>


        <View style={styles.cell}>

        <Text style={{color:'#1c1c1c',fontSize:10,marginBottom:2,}}>
          焊口/支架
        </Text>

        </View>

        <View style={styles.cell}>

        <Text style={{color:'#1c1c1c',fontSize:10,marginBottom:2,}}>
          房间号
        </Text>

        </View>

        <View style={styles.cell}>

        <Text style={{color:'#1c1c1c',fontSize:10,marginBottom:2,}}>
          规格
        </Text>

        </View>

        <View style={styles.cell}>

        <Text style={{color:'#1c1c1c',fontSize:10,marginBottom:2,}}>
          施工日期
        </Text>

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
    renderTitleColsCheckBox(rowData,rowID){
        if (Global.isMonitor(Global.UserInfo)) {
            return(<View style={[styles.cell,{flex:0.5,}]}>
            <View style={{  alignItems: 'center', justifyContent: 'center', }}>
                        {this.renderCheckBox(rowData,rowID)}
                                    </View>
            </View>)
        }
    }

    renderRow(rowData, sectionID, rowID) {

        itemView = () => {

                return (

                       <View style={styles.itemContainer}>



                        <View style={styles.statisticsflexContainer}>

                        {this.renderTitleColsCheckBox(rowData,rowID)}

                         <TouchableOpacity style={styles.cell}  onPress={this.onItemPress.bind(this, rowData)}>

                         <Text numberOfLines={2} style={{color:'#707070',fontSize:9,marginBottom:2,textAlign:'center'}}>
                               {rowData.drawingNo}
                         </Text>

                      </TouchableOpacity>


                      <TouchableOpacity style={styles.cell}  onPress={this.onItemPress.bind(this, rowData)}>
                              <Text numberOfLines={1} style={{color:'#707070',fontSize:9,marginBottom:2,}}>
                                    {rowData.weldno}
                              </Text>
                        </TouchableOpacity>




                        <TouchableOpacity style={styles.cell}  onPress={this.onItemPress.bind(this, rowData)}>
                        <Text style={{color:'#707070',fontSize:9,marginBottom:2,}}>
                           {rowData.roomNo}
                        </Text>
                          </TouchableOpacity>




                          <TouchableOpacity style={styles.cell}  onPress={this.onItemPress.bind(this, rowData)}>
                              <Text numberOfLines={2} style={{color:'#707070',fontSize:9,marginBottom:2,}}>
                                 {rowData.speification}
                              </Text>

                            </TouchableOpacity>



                         <TouchableOpacity style={styles.cell}  onPress={this.onItemPress.bind(this, rowData)}>

                         <Text numberOfLines={3}  style={{color:'#707070',fontSize:9,marginBottom:2,textAlign:'center'}}>
                           {Global.formatDate(rowData.planStartDate)}{'\n'}～{'\n'}{Global.formatDate(rowData.planEndDate)}
                         </Text>

                        </TouchableOpacity>



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
