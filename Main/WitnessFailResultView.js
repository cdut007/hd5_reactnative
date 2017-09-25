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


import Dimensions from 'Dimensions';
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

import NavBar from '../common/NavBar'
var Global = require('../common/globals');

import DisplayItemView from '../common/DisplayItemView';
import DisplayMoreItemView from '../common/DisplayMoreItemView';

export default class WitnessFailResultView extends Component {
    constructor(props) {
        super(props)

    }


    back() {
        this.props.navigator.pop()
    }




    render() {
        return (
            <View style={styles.container}>
                <NavBar
                    title="不合格详情"
                    leftIcon={require('../images/back.png')}
                    leftPress={this.back.bind(this)} />
                    <ScrollView
                    keyboardDismissMode='on-drag'
                    keyboardShouldPersistTaps={false}
                    style={styles.main_container}>
                    <DisplayItemView
                     title={'不合格类别'}
                     detail={this.props.data.content}
                    />
                    <DisplayMoreItemView
                     title={'不合格原因'}
                     detail={this.props.data.reason}
                    />
                </ScrollView>
            </View>
        )
    }


}


const styles = StyleSheet.create({
    container: {
        flex:1,
        width:width,
        height:height,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    main_container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
    },

})
