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
    Picker,
    AsyncStorage,
    TextInput,
    ScrollView
} from 'react-native';


import CommitButton from '../../common/CommitButton'
import NavBar from '../../common/NavBar'
import Dimensions from 'Dimensions'
import LoginView from '../../Login/LoginView'
var Global = require('../../common/globals');
var width = Dimensions.get('window').width;

import DisplayItemView from '../../common/DisplayItemView';

import DisplayMoreItemView from '../../common/DisplayMoreItemView';

import EditItemView from '../../common/EditItemView';


import HttpRequest from '../../HttpRequest/HttpRequest'

export default class ChooseMemberView extends Component {
    constructor(props) {
        super(props)
        var title = "通告接收人员"
        if (this.props.meeting) {
            title = "参会人员"
        }
        this.state = {

            title:title,
        }
    }


    back() {
        this.props.navigator.pop()
    }


        componentDidMount() {

            this.executeDepartMentRequest();
            }


            onGetDataSuccess(response,paramBody){
                 Global.log('onGetDataSuccess@@@@')


            }

    executeDepartMentRequest(){

      Global.log('executeDepartMentRequest ')
      var loading = false;



       this.setState({
         isLoading: loading,
       });


                        var paramBody = {

                            }

            HttpRequest.get('/department', paramBody, this.onGetDataSuccess.bind(this),
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

  saveTopic(){

      this.back()
  }


    render() {

            return (
                <View style={styles.container}>
                    <NavBar
                        title={this.state.title}
                        leftIcon={require('../../images/back.png')}
                        leftPress={this.back.bind(this)} />
                        <ScrollView
                        style={styles.mainStyle}>
                        <DisplayItemView
                         title={'参会总人数'}
                         detail={this.state.subject}
                        />



                        </ScrollView>

                </View>
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
})
