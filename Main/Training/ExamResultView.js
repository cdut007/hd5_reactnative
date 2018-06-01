/**
 * Created by Arlen_JY on 2018/6/1.
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
    Dimensions


} from 'react-native';
import CardView from 'react-native-cardview'
import Global from '../../common/globals'
import NavBar from '../../common/NavBar'
import px2dp from '../../common/util'
import HttpRequest from '../../HttpRequest/HttpRequest'
import ExamRecordView from './ExamRecordView'
import TrainingListView from './TrainingListView'
import CommitButton from '../../common/CommitButton'
import ExamTestView from './ExamTestView'
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
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
export default class ExamResultView extends Component{

    constructor (props){
        super(props);

        this.state = {

        }
    };

    componentWillMount(){


    }
    back(){
        this.props.navigator.pop();
    }



    renderCardView(){
        var CardViewArr = [];

        CardViewArr.push(

                <Image style={{width:width,height:height,flexDirection:'row',justifyContent: 'center',}} source={require('../../images/background1.png')}>
                    <View style = {{flexDirection:'row',justifyContent: 'center',}}>
                        <View style = {{flexDirection:'column',marginTop:65}}>
                            <Text style={{color: '#FFFFFF', fontSize: 32,textAlign:'center'}}>{"0"}</Text>
                            <Text style={{color: '#FFFFFF', fontSize: 32,textAlign:'center',marginTop:15}}>{"合格"}</Text>
                        </View>
                    </View>
                </Image>


            )

        return CardViewArr;
    }
    reExam(){
        Global.alert('reExam')
        let destinateRoute;
        const routers = this.props.navigator.getCurrentRoutes();
        for(let i = routers.length - 1; i >= 0; i--){
            if(routers[i].name == 'ExamHomeView'){

                destinateRoute = routers[i];
            }
        }
        if(destinateRoute){
            this.props.navigator.popToRoute(destinateRoute);
        }else{
            this.back();
        }
    }
    reTrain(){
        Global.alert('reTrain')
        let destinateRoute;
        const routers = this.props.navigator.getCurrentRoutes();
        for(let i = routers.length - 1; i >= 0; i--){
            if(routers[i].name == 'TrainingHomeView'){

                destinateRoute = routers[i];
            }
        }
        if(destinateRoute){
            this.props.navigator.popToRoute(destinateRoute);
        }else{
            this.back();
        }
    }
    renderBottomButton(){
        if (1== 1){
            return(
                <View style={{width:width-30,flexDirection:'row',marginLeft:15,position:'absolute',bottom:50}}>
                    <View style={{flex:1,flexDirection:'column',alignItems: "center",justifyContent:'space-between'}}>
                        <TouchableOpacity style={{height:40,marginBottom:15}} onPress={this.reExam.bind(this)}>
                            <View style={{borderColor:'orange',backgroundColor:'orange',borderRadius:5,borderWidth:1,padding:5,width:width-50,height:40,alignItems:'center',justifyContent:'center'}}>
                                <Text style={{color:'#FFFFFF',fontSize:14}}>重新考试</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={{height:40}} onPress={this.reTrain.bind(this)}>
                            <View style={{borderColor:'red',backgroundColor:'red',borderRadius:5,borderWidth:1,padding:5,width:width-50,height:40,alignItems:'center',justifyContent:'center'}}>
                                <Text style={{color:'#FFFFFF',fontSize:14}}>再次培训</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }else if (1 != 1){
            return(
                <View style={{height:50,width:width-30,flexDirection:'row',marginLeft:15,backgroundColor:'red'}}>
                    <View style={{height:50,flex:1,flexDirection:'row',alignItems: "space-between"}}>

                    </View>
                </View>
            );
        }else {

        }


    }

    render(){
        return(<View style={{flex:1,flexDirection: 'column', backgroundColor: '#f2f2f2'}}>
            <NavBar
                title={'考试成绩'}/>
            {this.renderCardView()}
            {this.renderBottomButton()}

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
