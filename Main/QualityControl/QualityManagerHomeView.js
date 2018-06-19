/**
 * Created by Arlen_JY on 2018/6/13.
 */
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
    // AlertIOS,

} from 'react-native';

import Dimensions from 'Dimensions'
import NavBar from '../../common/NavBar';

import ProblemAssignView from '../QualityControl/ProblemAssignView'
import ResultCheckView from '../QualityControl/ResultCheckView'
import ProblemReport from '../QualityControl/ProblemReport'
import QualityProblemCheckView from '../QualityControl/QualityProblemCheckView'
import Global from '../../common/globals'

var width = Dimensions.get('window').width;

var safeModule = [
    {
        'title':"问题报告",
        'image': require('../../images/reportIcon.png'),
        'index': 0,
        "type":"WTBG",
        "right":true,
        "bottom":true,

    },
    {
        'title':"问题分派",
        'image': require('../../images/checkIcon.png'),
        'index': 1,
        "type":"WTFP",
        "right":false,
        "bottom":true,
    },
    {
        'title':"结果验证",
        'image': require('../../images/correctionIcon.png'),
        'index': 2,
        "type":"JGYZ",
        "right":true,
        "bottom":false,
    },
    {
        'title':"问题查阅",
        'image': require('../../images/lookIcon.png'),
        'index': 3,
        "type":"WTCY",
        "right":false,
        "bottom":false,
    },
]

export  default class QualityManagerHomeView extends Component {

    constructor(props) {
        super(props)

        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

        this.state = {
            title: "质量管理",
            dataSource: ds,
        }

    }

    componentDidMount() {

        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(safeModule),
        });


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
                    leftPress={this.back.bind(this)}/>
                <ScrollView style={styles.content}>
                    {this.renderHeaderView()}
                    {this.renderToolsView()}
                </ScrollView>

            </View>
        )
    }

    renderHeaderView(){
        return(
            <View style = {{width:width,height:200,backgroundColor:'#3CDEBA',alignItems:'center',justifyContent:'center'}}>
                <Image source={require('../../images/construction_icon.png')} style={{width:120,height:120}} resizeMode={Image.resizeMode.contain}></Image>
            </View>
        );
    }

    renderToolsView() {
        return(

            <ListView
                dataSource={this.state.dataSource}
                renderRow={this.renderRow.bind(this)}
                contentContainerStyle={{
                    justifyContent: 'space-around',
                    flexDirection:'row', //改变ListView的主轴方向
                    flexWrap:'wrap', //换行
                    alignItems:'center', // 必须设置,否则换行不起作用
                    marginLeft:30,
                    marginRight:30,
                    marginTop:50,
                    marginBottom:50,
                }}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
            />
        )
        i

    }

    renderRow(item,sectionId,rowId){
        return(
            <View key = {item.index}
                  style={[{width:width/2-30,
                      height:width/2-30,
                      borderRightWidth:item.right ? 1 : 0,
                      borderBottomWidth:item.bottom ? 1 : 0,
                      borderColor:'#DDDDDD',
                  }, styles.toolsItem]}>

                {this.renderDot(item)}

            </View>
        )
    }

    _itemClick(item){

// AlertIOS.Global.alert(item.type,item.title);

        if (item.type == "WTSH" && !Global.isHSE(Global.UserInfo)) {
            Global.alert("当前用户不是HSE部门成员,无法执行该操作");
            return;
        }

        var Component;

        switch (item.type) {
            case "WTBG":
            {
                Component =   ProblemReport;
            }
                break;

                break;
            case "WTFP":
            {
                Component = ProblemAssignView;
            }
                break;
            case "JGYZ":
            {
                Component = ResultCheckView;
            }
                break;
            case "WTCY":
            {
                Component = QualityProblemCheckView;
            }
                break;

        }

        if (Component) {
            this.props.navigator.push({
                component: Component,

            })
        }


    }

    renderDot(item){

        return(
            <TouchableOpacity style={{alignSelf:'center'}}
                              onPress={this._itemClick.bind(this,item)}>
                <Image source={item.image} style={styles.circle_outter} resizeMode={Image.resizeMode.contain}></Image>
                <Text style={styles.item}> {item.title} </Text>
            </TouchableOpacity>
        );

    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        backgroundColor: '#fff',
    },
    toolsItem: {
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",

    },
    item: {
        color: "#FBAC2B",
        alignSelf:'center',
        fontSize:16,
    },
    circle_outter:{
        marginBottom: 6,
        alignSelf:'center',
        width: 88,
        height: 88,
    },

});
