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
import CheckBox from 'react-native-checkbox'
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
            singleCheck:false
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
                style = {{marginTop: 10, marginLeft: 10, marginRight: 10, backgroundColor: '#ffffff', height: height*0.7, flexDirection: 'row', alignItems: 'flex-start',justifyContent:'flex-start'}}
                cardElevation = {4}
                cornerRadius = {6}>
                <View style = {{flexDirection:'column',alignItems: 'flex-start'}}>
                    <View style = {{flexDirection:'row',backgroundColor:'blue',borderRadius:5,borderWidth:0.5,marginLeft:10,marginTop:10,padding:3}}>
                        <Text style={{color: '#FFFF FF', fontSize: 18, fontWeight: 'bold',}}>{"单选"}</Text>

                    </View>
                    <View style = {{flexDirection:'column',}}>
                        <Text style={{color: '#444444', fontSize: 18,marginLeft:10,marginRight:15,marginTop:5,textAlign:'left'}}>{"1、"+"下列哪个物质是点火源？下列哪个物质是点火源？下列哪个物质是点火源？下列哪个物质是点火源？下列哪个物质是点火源？"+'('+'5'+'分)'}</Text>
                    </View>
                    <View style = {{flexDirection:'column',}}>

                            {this.renderCheckBoxItem()}


                    </View>
                </View>

            </CardView>)

        return CardViewArr;
    }
    renderCheckBoxItem(){
        var  checkBoxViewArr = [ ];
        var  checkBoxArr = [ 1, 2, 3,4,5,6];
         checkBoxArr.map((item,i) => {
             checkBoxViewArr.push(
                 <View>
                     <CheckBox
                         containerStyle={{marginLeft:30,marginTop:15}}
                         label='A、电火花'
                         checkedImage={require('../../images/choose_icon_click.png')}
                         uncheckedImage={require('../../images/choose_icon.png')}
                         checked={this.state.singleCheck == null ?  false:this.state.singleCheck }
                         onChange={(checked) => {
                             Global.log(checked+'this.state.singleCheck=='+this.state.singleCheck)
                             var selected1 = !checked
                             if (selected1){

                             }else {

                             }
                             this.setState({
                                 singleCheck:selected1,


                             })




                         }
                         }
                     />

             </View>)
         })

        return checkBoxViewArr;
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
