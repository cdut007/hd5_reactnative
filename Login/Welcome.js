import React,{Component} from 'react';
import HttpRequest from '../HttpRequest/HttpRequest'
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    AsyncStorage,
    Image
} from 'react-native';
import Dimensions from 'Dimensions';
import LoginView from './LoginView'
import RegisterView from './RegisterView'

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
var index;
export default class Welcome extends Component
{
    constructor(props)
    {
        super(props)
        index = this.props.index;
    }
    state =
    {

    }


    onLoginPress()
    {
        this.props.navigator.push({
            component: LoginView,
            index: this.props.index
        })
    }
    componentDidMount() {
        setTimeout(() => {//logout timeout  15s
            //if (this.state.loadingVisible == true) {
              this.onLoginPress();
        //   }else{
        //
        //   }

        }, 1000 * 2);
    }


    onRegiserPress()
    {
        this.props.navigator.push({
            component: RegisterView,
        })
    }

    render()
    {
        return (
            <View style = {styles.rootcontainer}>
              <Image style={{position:'absolute',left:0,top:0,resizeMode:'stretch', alignItems:'center',
              width:width,height:height,
    justifyContent:'center',
    flex:1}} source={require('../images/bg_img.png')}/>
            <View style = {styles.container}>

            </View>
            </View>
        )
    }
}

const styles = StyleSheet.create(
    {

        buttonText:{
                    color: '#ffffff',
                    fontSize:45,
                    fontWeight:'bold',
                    alignSelf:'center',
                    justifyContent: 'center',
                    alignItems: 'center',
            },
        logo: {
        marginTop: 20,
        alignSelf:'center',
        height: 100,
        width: 100,
        resizeMode: Image.resizeMode.contain,
    },
        container:
        {
            flex: 1,
            flexDirection:'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
        },
        rootcontainer:
        {
            flex: 1,
            flexDirection:'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            backgroundColor: '#ebebeb',
        },

        loginText:
        {
            color: '#ffffff',
            fontSize:18,
        },
        labelText:
        {
            marginTop: 70,
            color: '#ffffff',
            fontSize:45,
            backgroundColor: '#00000000'
        },

        loginButton:
        {
            margin: 30,
            height:50,
            width: width - 60,
            backgroundColor: '#1a8eaf',
            borderRadius:5,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems:'center',
        },
});
