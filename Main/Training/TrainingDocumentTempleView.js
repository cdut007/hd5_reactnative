/**
 * Created by Arlen_JY on 2018/6/7.
 */


import React,{
    Component
} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    ListView,
    Dimensions,
    BackAndroid


} from 'react-native';
import CardView from 'react-native-cardview'
import Global from '../../common/globals'
import NavBar from '../../common/NavBar'
import px2dp from '../../common/util'
import HttpRequest from '../../HttpRequest/HttpRequest'
import ExamRecordView from './ExamRecordView'
import TrainingListView from './TrainingListView'
var width = Dimensions.get('window').width;
var moduleData = [
    {
        'index': 0,
        'title': '基础培训',
        "type": "JCPX",
        'image': require('../../images/basicIcon.png')
    },
    {
        'index': 1,
        'title': '技能培训',
        "type": "JNPX",
        'image': require('../../images/skillIcon.png')
    },
    {
        'index': 2,
        'title': '专项培训',
        "type": "ZXPX",
        'image': require('../../images/specialIcon.png')
    },
    {
        'index': 3,
        'title': '学习记录',
        "type": "XXJL",
        'image': require('../../images/recordIcon.png')
    }
]
export default class TrainingDocumentTempleView extends Component{

    constructor (props){
        super(props);

        this.state = {

        }
    };

    componentWillMount(){
        var me = this;
        BackAndroid.addEventListener('harwardBackPress', () => {
            const routers = me.props.navigator.getCurrentRoutes();
            if (routers.length > 1) {
                me.props.navigator.pop();
                return true;
            } else {
                if (routers[0].name == 'MainPage'||routers[0].name == 'LoginView') {
                    BackAndroid.exitApp();
                    return true;
                } else {
                    me.props.navigator.pop();
                    return true;
                }

            }
            return false;
        });
    }


    componentWillUnmount() {
        BackAndroid.removeEventListener('hardwareBackPress');
    }
    back(){
        this.props.navigator.pop();
    }


    goToCardDetail(item){
        if (item.type == 'JCPX'){
            //基础培训
            this.props.navigator.push({
                component:TrainingListView,
                props:{
                    type:item.type,
                    title:item.title
                }
            })
        }else if (item.type == 'JNPX'){
            //技能培训
            this.props.navigator.push({
                component:TrainingListView,
                props:{
                    type:item.type,
                    title:item.title
                }
            })
        }else if (item.type == 'ZXPX'){
            //专项培训
            this.props.navigator.push({
                component:TrainingListView,
                props:{
                    type:item.type,
                    title:item.title
                }
            })
        }else if (item.type == 'XXJL'){
            //学习记录
            this.props.navigator.push({
                component:ExamRecordView,
                props:{
                    type:item.type,
                    title:item.title
                }
            })
        }
        // Global.alert(typeStr);
    }
    renderCardView(){
        var CardViewArr = [];
        moduleData.map((item,i) => {
            CardViewArr.push(<TouchableOpacity onPress = {() => this.goToCardDetail(item)}>
                <CardView
                    style = {{marginTop: 10, marginLeft: 10, marginRight: 10, backgroundColor: '#ffffff', height: width*0.28, flexDirection: 'row', alignItems: 'center'}}
                    cardElevation = {4}
                    cornerRadius = {6}>
                    <Image
                        style = {{marginLeft:15,width: 80, height: 80, }}
                        source = {item.image} />
                    <View>
                        <Text style={{color: '#444444', fontSize: 18, fontWeight: 'bold',marginLeft:30}}>{item.title}</Text>
                    </View>
                </CardView>
            </TouchableOpacity>)
        });
        return CardViewArr;
    }
    render(){
        return(<View style={{flex:1,flexDirection: 'column', backgroundColor: '#f2f2f2'}}>
            <NavBar
                title={'图文详情'}
                leftIcon={require('../../images/back.png')}
                leftPress={this.back.bind(this)} />
            {this.renderCardView()}

        </View>)


    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
    },
    toolsItem: {
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center"
    },

});