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
    AsyncStorage
} from 'react-native';
import Dimensions from 'Dimensions';
import NavBar from '../common/NavBar';
import px2dp from '../common/util';
import HttpRequest from '../HttpRequest/HttpRequest'
import CircleImage from '../common/CircleImage';
import SettingView from './SettingView';

const isIOS = Platform.OS == "ios"
var width = Dimensions.get('window').width;
var account = Object();
var Global = require('../common/globals');

export default class MeView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
        };
    }

    componentWillMount(){
        var me = this
        AsyncStorage.getItem('k_login_info',function(errs,result)
        {
            console.log('me page k_login_info:' + result)
            if (!errs && result && result.length)
            {
                var resultJSon = JSON.parse(result);
                me.setState({name: resultJSon.responseResult.realname})
            }
            else
            {

            }
        });
    }

    setting() {
        this.props.navigator.push({
            component: SettingView,
        })
    }
    onMineIssuePress(){

    }
    onMinePlanPress(){

    }
    onMineWitnessPress(){


    }

    render() {
        return (
            <View style={styles.container}>
            <NavBar title={this.state.name}
            rightIcon={require('../images/setting_icon.png')}
            rightPress={this.setting.bind(this)}
            />

            <TouchableOpacity style={styles.item}  onPress={this.onMineIssuePress.bind(this)}>
            <Text style={styles.defaultText}>我的问题</Text>
            </TouchableOpacity>
            <View style={styles.divider}/>

            <TouchableOpacity style={styles.item} onPress={this.onMinePlanPress.bind(this)}>
            <Text style={styles.defaultText}>我的计划</Text>
            </TouchableOpacity>
            <View style={styles.divider}/>

            <TouchableOpacity style={styles.item} onPress={this.onMineWitnessPress.bind(this)}>
            <Text style={styles.defaultText}>我的见证</Text>
            </TouchableOpacity>
            <View style={styles.divider}/>

            </View>
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
    item: {
    width: width,
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
    height:50,
    justifyContent: 'center',
    alignItems: 'center',
},
    divider: {
    backgroundColor: '#8E8E8E',
    width: width,
    height: 0.5,
},
    centerLayout:{
      justifyContent:'center',
      alignItems:'center',
    },
    itemLayout:{
        backgroundColor:'#ffffff',
        justifyContent:'center',
        width:width,
        height:50,
        alignItems:'center',
    },


    defaultText:{
            color: '#000000',
            fontSize:16,
            justifyContent: "center",
            alignItems: 'center',
    },

       itemLine:{
           width: width,
           height: 1,
           backgroundColor: '#cccccc',
       },

});
