/**
 * Created by Arlen_JY on 2018/6/1.
 */
/**
 * Created by Arlen_JY on 2018/5/31.
 */
/**
 * Created by Arlen_JY on 2018/5/30.
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
import  ExamResultView from './ExamResultView'
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
export default class ExamTestView extends Component{

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
            <CardView
                style = {{marginTop: 10, marginLeft: 10, marginRight: 10, backgroundColor: '#ffffff', height: height*0.7, flexDirection: 'row', alignItems: 'center',justifyContent:'center'}}
                cardElevation = {4}
                cornerRadius = {6}>
                <View style = {{flexDirection:'row',alignItems: 'center'}}>
                    <View style = {{flexDirection:'column',}}>
                        <Text style={{color: '#444444', fontSize: 18, fontWeight: 'bold',}}>{"考试种类:"}</Text>
                        <Text style={{color: '#444444', fontSize: 18, fontWeight: 'bold',marginTop:15}}>{"考试内容:"}</Text>
                        <Text style={{color: '#444444', fontSize: 18, fontWeight: 'bold',marginTop:15}}>{"合格标准:"}</Text>
                    </View>
                    <View style = {{flexDirection:'column',}}>
                        <Text style={{color: '#444444', fontSize: 18,marginLeft:30,textAlign:'left'}}>{this.props.title}</Text>
                        <Text style={{color: '#444444', fontSize: 18,marginLeft:30,marginTop:15,textAlign:'left'}}>{"全部"}</Text>
                        <Text style={{color: '#444444', fontSize: 18,marginLeft:30,marginTop:15,textAlign:'left'}}>{"60分合格"}</Text>
                    </View>
                </View>

            </CardView>)

        return CardViewArr;
    }
    lastStep(){
        Global.alert('lastStep')
    }
    nextStep(){
        Global.alert('nextStep')
    }
    renderBottomButton(){
        if (1== 1){
            return(
                <View style={{height:50,width:width-30,flexDirection:'row',marginLeft:15,position:'absolute',bottom:15}}>
                    <View style={{height:50,flex:1,flexDirection:'row',alignItems: "center",justifyContent:'space-between'}}>
                        <TouchableOpacity style={{marginLeft:15,height:40}} onPress={this.lastStep.bind(this)}>
                            <View style={{borderColor:'orange',borderRadius:5,borderWidth:1,padding:5,width:70,alignItems:'center'}}>
                            <Text>上一题</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={{marginRight:15,height:40}} onPress={this.nextStep.bind(this)}>
                            <View style={{borderColor:'orange',borderRadius:5,borderWidth:1,padding:5,width:70,alignItems:'center'}}>
                                <Text>下一题</Text>
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
    startExam(){

    }
    endExam(){
        this.props.navigator.push({
            component:ExamResultView,
            props:{

            }
        })
    }
    render(){
        return(<View style={{flex:1,flexDirection: 'column', backgroundColor: '#f2f2f2'}}>
            <NavBar
                title={'考试'}
                rightPress={this.endExam.bind(this)}
                rightText={'交卷'}
                leftIcon={require('../../images/back.png')}
                leftPress={this.back.bind(this)} />
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
