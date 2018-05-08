import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Platform,
    ListView,
    TouchableNativeFeedback,
    TouchableOpacity,
    ScrollView
} from 'react-native';

import Dimensions from 'Dimensions';
import NavBar from '../common/NavBar'
import px2dp from '../common/util'
import dateformat from 'dateformat'
import HttpRequest from '../HttpRequest/HttpRequest'
import ModuleTabView from './ModuleTabView';
import QCTabView from './QC/QCTabView';
import SolverTabView from './Problem/SolverTabView';
import Banner from 'react-native-banner';
import Badge from 'react-native-smart-badge'
import SafeWorkHomeView from './SafeWork/SafeWorkHomeView'
import QualityControlHomeView from './QualityControl/QualityControlHomeView'
import SolverLeaderView from './Problem/SolverLeaderView'
import CoordinatorView from './Problem/CoordinatorView'
import ResourceManageView from './ResourceManagement/ResourceManageView'


const isIOS = Platform.OS == "ios"
var width = Dimensions.get('window').width;

var yesterday = new Date()
yesterday.setTime(yesterday.getTime() - 24 * 60 * 60 * 1000)
var tomorrow = new Date()
tomorrow.setTime(tomorrow.getTime() + 24 * 60 * 60 * 1000)
import Global from '../common/globals.js';

import PlanListViewContainer from './PlanListViewContainer';
import IssueListViewContainer from './IssueListViewContainer';

var moduleData = [
    {
        'index': 0,
        'title': '机械计划',
        "type": "JXJH",
        'image': require('../images/jx_icon.png')
    },
    {
        'index': 1,
        'title': '主系统',
        "type": "ZXT",
        'image': require('../images/zxt_icon.png')
    },
    {
        'index': 2,
        'title': '管道计划',
        "type": "GDJH",
        'image': require('../images/gd_icon.png')
    },
    {
        'index': 3,
        'title': '电气计划',
        "type": "DQJH",
        'image': require('../images/dq_icon.png')
    },

    {
        'index': 4,
        'title': '仪表计划',
        "type": "YBJH",
        'image': require('../images/yb_icon.png')
    },
    {
        'index': 5,
        'title': '调试计划',
        "type": "TSJH",
        'image': require('../images/ts_icon.png')
    },

    {
        'index': 6,
        'title': '保温计划',
        "type": "BWJH",
        'image': require('../images/bw_icon.png')
    },
    {
        'index': 7,
        'title': '通风计划',
        "type": "TFJH",
        'image': require('../images/tf_icon.png')
    }
]


var bottomModuleData = [
    {
        'index': 0,
        'title': '文明施工',
        "type": "WMSG",
        'image': require('../images/construction_icon.png')
    },
    {
        'index': 1,
        'title': '质量管理',
        "type": "ZLGL",
        'image': require('../images/quality_icon.png')
    },
    {
        'index': 2,
        'title': '物资管理',
        "type": "WZGL",
        'image': require('../images/material_icon.png')
    },

]

var moduleType = []

var daySegArr = ['' + yesterday.getDate() + '日', '今日', '' + tomorrow.getDate() + '日', '周', '月', '年']
let typeSegArr = ['焊口', '支架']
let dayCateArr = ['dateBefore', 'dateCurrent', 'dateAfter', 'dateWeek', 'dateMonth', 'dateYear']

export default class HomeView extends Component {
    constructor(props) {
        super(props)
            var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
            var ds2 = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            selectedDayIndex: 1,
            selectedTypeIndex: 0,
            banners:[],
            dataSource: ds,
            dataSource2: ds2,
        };
    }

    componentWillMount(){
        this.fetchBanner();

    }

    fetchBanner(){
    var paramBody ={ }
    HttpRequest.get('/banner', paramBody, this.onBannerSuccess.bind(this),
        (e) => {

            try {
                var errorInfo = JSON.parse(e);
                Global.log(errorInfo.description)
                if (errorInfo != null && errorInfo.description) {
                    Global.log(errorInfo.description)
                } else {
                    Global.log(e)
                }
            }
            catch(err)
            {
                Global.log(err)
            }

            Global.log(' error:' + e)
        })
}

    bannerClickListener(index) {
    this.setState({
            clickTitle: this.state.banners[index].title ? `you click ${this.state.banners[index].title}` : 'this banner has no title',
        })

    }

    bannerOnMomentumScrollEnd(event, state) {
       //  Global.log(`--->onMomentumScrollEnd page index:${state.index}, total:${state.total}`);
        this.defaultIndex = state.index;
    }

    componentDidMount() {
        setTimeout(() => {
            this.getModuleInfo()
        }, 1000 * 0.2);

        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(moduleData),
            dataSource2: this.state.dataSource2.cloneWithRows(bottomModuleData),
        });


    }


    onBannerSuccess(response){
        this.state.banners = response.responseResult;
        Global.log('BannerSuccess:' + JSON.stringify(response.responseResult));
        // this.state.banners.map((item, i) => {
        //
        //     var imageUrl = '/banner/'+(i+1)+'.jpg';
        //     item.image =  HttpRequest.getDomain()+imageUrl;
        //     Global.log('bannerImageUrl'+i+':'+item.image);
        // });
        // this.state.banners.map((item, i) => {
        //
        //     var imageUrl = item.image;
        //     item.image =  HttpRequest.getDomain()+imageUrl;
        // });

        this.setState({banners:this.state.banners});
    }

    getModuleInfo() {
        var date = new Date()
        var now = dateformat(date, 'yyyy-mm-dd')

        var paramBody = {
            }
        HttpRequest.get('/module', paramBody, this.onGetModuleSuccess.bind(this),
            (e) => {
                try {
                    Global.alert(e)
                }
                catch (err) {
                    Global.log(err)
                }
            })
    }

    onGetModuleSuccess(response) {
        Global.log('onGetModuleSuccess:' + JSON.stringify(response))
        response.responseResult.map((item, i) => {
            if (item.type) {
                moduleType[item.type] = item
            }
        })

        this.setState({
            ...this.state
        })
    }

    onModuleItemClick(index,bottom) {
        Global.log('Did click item at:' + index)
        // if (true) {
        //     //test single page.
        //     this.props.navigator.push({
        //         component: IssueListViewContainer,
        //         props:{
        //             data:{class:'sdd',type:"GDJH"}
        //         }
        //     })
        //     return
        // }
            //
            var data = moduleData[index];
            if (bottom) {
                data = bottomModuleData[index];
            }

            if (data.type == 'WMSG') {
              this.props.navigator.push({
                  component: SafeWorkHomeView,
                   props: {
                       data:data,
                       type:data.type,
                       typeStr:typeSegArr[this.state.selectedTypeIndex],
                       category:dayCateArr[index],
                      }
              })
              return;
            }

            if (data.type == 'ZLGL') {
              this.props.navigator.push({
                  component: QualityControlHomeView,
                   props: {
                       data:data,
                       type:data.type,
                       typeStr:typeSegArr[this.state.selectedTypeIndex],
                       category:dayCateArr[index],
                      }
              })
              return;
            }

            if (data.type == 'WZGL') {

               this.props.navigator.push({
                  component: ResourceManageView,
                   props: {
                       data:data,
                       type:data.type,
                       typeStr:typeSegArr[this.state.selectedTypeIndex],
                       category:dayCateArr[index],
                      }
              })
              return;
            }



            if (Global.isCaptain(Global.UserInfo)) {
                this.props.navigator.push({
                    component: ModuleTabView,
                    name: 'ModuleTabView',
                     props: {
                         data:data,
                         type:data.type,
                         typeStr:typeSegArr[this.state.selectedTypeIndex],
                         category:dayCateArr[index],
                        }
                })
            }else if (Global.isMonitor(Global.UserInfo)) {
                data.user = new Object();
                data.user.id = Global.UserInfo.id;
                data.user.dept = new Object();
                data.user.dept.name = data.title;//change later. for dept


                this.props.navigator.push({
                    component: ModuleTabView,
                    name: 'ModuleTabView',
                     props: {
                         data:data,
                         type:data.type,
                         typeStr:typeSegArr[this.state.selectedTypeIndex],
                         category:dayCateArr[index],
                        }
                })
            }else if (Global.isGroup(Global.UserInfo)) {

                data.user = new Object();
                data.user.id = Global.UserInfo.id;
                data.user.dept = new Object();
                data.user.dept.name = data.title;//change later. for dept


                this.props.navigator.push({
                    component: ModuleTabView,
                    name: 'ModuleTabView',
                     props: {
                         data:data,
                         type:data.type,
                         typeStr:typeSegArr[this.state.selectedTypeIndex],
                         category:dayCateArr[index],
                        }
                })
            }else if (Global.isQCTeam(Global.UserInfo)) {

                data.user = new Object();
                data.user.id = Global.UserInfo.id;
                data.user.dept = new Object();
                data.user.dept.name = data.title;//change later. for dept


                this.props.navigator.push({
                    component: QCTabView,
                     props: {
                         data:data,
                         type:data.type,
                         typeStr:typeSegArr[this.state.selectedTypeIndex],
                         category:dayCateArr[index],
                        }
                })

            }else if (Global.isQC2Team(Global.UserInfo)) {

                data.user = new Object();
                data.user.id = Global.UserInfo.id;
                data.user.dept = new Object();
                data.user.dept.name = data.title;//change later. for dept


                this.props.navigator.push({
                    component: QCTabView,
                     props: {
                         data:data,
                         type:data.type,
                         typeStr:typeSegArr[this.state.selectedTypeIndex],
                         category:dayCateArr[index],
                        }
                })

            }else if (Global.isQC1Member(Global.UserInfo)) {

                //show main view

                                data.user = new Object();
                                data.user.id = Global.UserInfo.id;
                                data.user.dept = new Object();
                                data.user.dept.name = data.title;//change later. for dept


                                this.props.navigator.push({
                                    component: QCTabView,
                                     props: {
                                         data:data,
                                         type:data.type,
                                         typeStr:typeSegArr[this.state.selectedTypeIndex],
                                         category:dayCateArr[index],
                                        }
                                })

            }else if (Global.isQC2Member(Global.UserInfo)) {

                //show main view

                                data.user = new Object();
                                data.user.id = Global.UserInfo.id;
                                data.user.dept = new Object();
                                data.user.dept.name = data.title;//change later. for dept


                                this.props.navigator.push({
                                    component: QCTabView,
                                     props: {
                                         data:data,
                                         type:data.type,
                                         typeStr:typeSegArr[this.state.selectedTypeIndex],
                                         category:dayCateArr[index],
                                        }
                                })

            }else if (Global.isQC2SubMember(Global.UserInfo)) {


                                                data.user = new Object();
                                                data.user.id = Global.UserInfo.id;
                                                data.user.dept = new Object();
                                                data.user.dept.name = data.title;//change later. for dept


                                                this.props.navigator.push({
                                                    component: QCTabView,
                                                     props: {
                                                         data:data,
                                                         type:data.type,
                                                         typeStr:typeSegArr[this.state.selectedTypeIndex],
                                                         category:dayCateArr[index],
                                                        }
                                                })
            }else if(Global.isSolverLeader(Global.UserInfo)){
                data.user = new Object();
                data.user.id = Global.UserInfo.id;
                data.user.dept = new Object();
                data.user.dept.name = data.title;//change later. for dept


                this.props.navigator.push({
                    component: SolverLeaderView,
                     props: {
                         data:data,
                         type:data.type,
                         typeStr:typeSegArr[this.state.selectedTypeIndex],
                         category:dayCateArr[index],
                        }
                })
            }else if(Global.isCoordinator(Global.UserInfo)){
                data.user = new Object();
                data.user.id = Global.UserInfo.id;
                data.user.dept = new Object();
                data.user.dept.name = data.title;//change later. for dept


                this.props.navigator.push({
                    component: CoordinatorView,
                     props: {
                         data:data,
                         type:data.type,
                         typeStr:typeSegArr[this.state.selectedTypeIndex],
                         category:dayCateArr[index],
                        }
                })
            }else if(Global.isSolverMember(Global.UserInfo)){
                data.user = new Object();
                data.user.id = Global.UserInfo.id;
                data.user.dept = new Object();
                data.user.dept.name = data.title;//change later. for dept


                this.props.navigator.push({
                    component: SolverTabView,
                     props: {
                         data:data,
                         type:data.type,
                         typeStr:typeSegArr[this.state.selectedTypeIndex],
                         category:dayCateArr[index],
                        }
                })
            }else {
                // if(Global.existRoleName(Global.UserInfo)){
                //     Global.alert("当前角色无权限操作该模块，请联系管理员");
                //     return
                // }else{
                //     Global.alert("角色未知，请联系管理员，或者升级新版本试试");
                // }

                data.user = new Object();
                data.user.id = Global.UserInfo.id;
                data.user.dept = new Object();
                data.user.dept.name = data.title;//change later. for dept


                this.props.navigator.push({
                    component: CoordinatorView,
                     props: {
                         data:data,
                         type:data.type,
                         typeStr:typeSegArr[this.state.selectedTypeIndex],
                         category:dayCateArr[index],
                        }
                })
                
                Global.log('unkonwn roles ....')
            }


    }

    onDayIndexChange(index) {

        this.setState({
            selectedDayIndex: index
        })

        this.getModuleInfo(index)
    }

    onTypeIndexChange(index) {

        this.setState({
            selectedTypeIndex: index
        })
    }

    render() {
        return (
            <View style={styles.container}>
                 <ScrollView
                 keyboardDismissMode='on-drag'
                 keyboardShouldPersistTaps='always'
                 showsHorizontalScrollIndicator = {false}
                 showsVerticalScrollIndicator={false}
                 horizontal={false}
                 style={{width:width}}
                 >
                {this.renderTopView()}
                <View  style={{backgroundColor:'#ffffff',flex:1,height:8}}/>
                {this.renderToolsView()}
                {this.renderBottomModuleView()}
                 </ScrollView>
            </View>
        )
    }


    renderTopView() {
        var banners = JSON.stringify(this.state.banners);
        Global.log("this.state.banners="+banners)
        if (this.state.banners.length == 0) {
            return (
                <Image source={require('../images/banner_img.png')} style={styles.topView} resizeMode={Image.resizeMode.contain} />

            )
        }else{
            return (
                <View style={styles.rootcontainer}>
                <Image style={[{position:'absolute',left:0,top:0,resizeMode:'stretch', alignItems:'center',},styles.topView]} source={require('../images/banner_img.png')}/>

                <Banner
                    style={styles.topView}
                    banners={this.state.banners}
                    defaultIndex={this.defaultIndex}
                    onMomentumScrollEnd={this.bannerOnMomentumScrollEnd.bind(this)}
                    intent={this.bannerClickListener.bind(this)}
                />
                </View>

            )
        }
    }



    renderOtherRow(item,sectionId,rowId){
        return(
            //format title
            <TouchableOpacity style={{ paddingTop:10,paddingBottom:10,backgroundColor:'#ffffff',alignSelf:'stretch',flex:1}} key={item.index} onPress={() => { this.onModuleItemClick(item.index,true) }}>
            <View style={[{ alignSelf:'stretch',flex:1 }, styles.toolsItem]}>

                {this.renderDot(item)}

                <Text style={{ fontSize: px2dp(12), color: "#3b3b3b" }}>{item.title}</Text>
            </View>
            </TouchableOpacity>




        )
    }

    renderBottomModuleView(){

        return(

            <ListView
              dataSource={this.state.dataSource2}
              renderRow={this.renderOtherRow.bind(this)}
              style={[{ marginBottom:10,marginTop:10,}]}
               pageSize={3}
              contentContainerStyle={{
                  justifyContent: 'space-around',
                    flexDirection:'row', //改变ListView的主轴方向
                    flexWrap:'wrap', //换行
                     alignItems:'center', // 必须设置,否则换行不起作用
            }}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
          />
        )

    }


    renderDot(item){

        var data = moduleType[item.type]
        if (data && data.alert) {
            return(<View style={{flexDirection:"row"}}>

            <Image source={item.image} style={{ marginBottom: 6, width: 48, height: 48}} resizeMode={Image.resizeMode.contain} />
            {/* <View style={{ marginBottom: 6, width: 8, height: 8,borderWidth:1,
            borderColor : 'red',
            backgroundColor : 'red',
            borderRadius : 8,
            padding: 0,
            color:'red',}}></View> */}

            </View>)
        }else{

            return( <Image source={item.image} style={{ marginBottom: 6, width: 48, height: 48 }} resizeMode={Image.resizeMode.contain} />
            )
        }
    }

    renderRow(item,sectionId,rowId){
        return(

            //format title
            <TouchableOpacity style={{paddingTop:10,paddingBottom:10,backgroundColor:'#ffffff',width:width/4}} key={item.index} onPress={() => { this.onModuleItemClick(item.index,false) }}>
            <View style={[{width:width/4}, styles.toolsItem]}>

                {this.renderDot(item)}

                <Text style={{ fontSize: px2dp(12), color: "#707070" }}>{item.title}</Text>
            </View>
            </TouchableOpacity>


        )
    }

    renderToolsView() {
        return(

            <ListView
              dataSource={this.state.dataSource}
              renderRow={this.renderRow.bind(this)}
               pageSize={4}
              style={[{ marginBottom:10,}]}
              contentContainerStyle={{
                    justifyContent: 'space-around',
                    flexDirection:'row', //改变ListView的主轴方向
                    flexWrap:'wrap', //换行
                    alignItems:'center', // 必须设置,否则换行不起作用
            }}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
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
        alignSelf:'stretch'
    },
    segmentView: {
        height: 44,
        borderColor: '#00a629'
    },
    segmentSelectedView: {
        backgroundColor: '#00a629'
    },
    toolsView: {

        backgroundColor: "#fff",
        flexDirection: "row",
        flexWrap: "wrap"
    },
    toolsItem: {
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center"
    },
});
