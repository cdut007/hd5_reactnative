import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Platform,
    ScrollView,
    RefreshControl,
    ActivityIndicator,
    TouchableNativeFeedback,
    TouchableHighlight,
    InteractionManager,
} from 'react-native';
import HttpRequest from '../../HttpRequest/HttpRequest'
import Dimensions from 'Dimensions';
import NavBar from '../../common/NavBar'
import LoadMoreFooter from '../../common/LoadMoreFooter.js'
import CircleLabelHeadView from '../../common/CircleLabelHeadView';
import px2dp from '../../common/util'
import SearchBar from '../../common/SearchBar';
import dateformat from 'dateformat'
import QCWitnessListView from './QCWitnessListView.js';
import ConstMapValue from '../../common/ConstMapValue.js';

const isIOS = Platform.OS == "ios"
var width = Dimensions.get('window').width;
import Global from '../../common/globals.js'



var LOADING = {};


export default class QCWitnessListViewContainer extends Component {
    constructor(props) {
        super(props)


        this.state = {

            title: "待见证",
        }


    }


        back() {
            this.props.navigator.pop()
        }




    componentDidMount() {


    }





    render() {
        return (
            <View style={styles.container}>
                <NavBar
                title={this.state.title}
                leftIcon={require('../../images/back.png')}
                leftPress={this.back.bind(this)} />
                {this.renderListView()}
            </View>
        )
    }


    renderListView() {
        var qc_witness_col_map = ConstMapValue.QC_Witness_Col_Map(this.props.type)
        return (
            <View style={{marginTop:10,}}>

            <View style={{backgroundColor:'#d6d6d6',height:0.5,width:width}}>
            </View>

            <View style={[{alignItems:'center',},styles.statisticsflexContainer]}>

            <View style={styles.cell}>

              <Text style={{color:'#1c1c1c',fontSize:10,marginBottom:2,}}>
                {qc_witness_col_map.col1}
              </Text>

            </View>


            <View style={styles.cell}>

            <Text style={{color:'#1c1c1c',fontSize:10,marginBottom:2,}}>
             {qc_witness_col_map.col2}
            </Text>

            </View>

            <View style={styles.cell}>

            <Text style={{color:'#1c1c1c',fontSize:10,marginBottom:2,}}>
            {qc_witness_col_map.col3}
            </Text>

            </View>

            <View style={styles.cell}>

            <Text style={{color:'#1c1c1c',fontSize:10,marginBottom:2,}}>
             {qc_witness_col_map.col4}
            </Text>

            </View>

            <View style={styles.cell}>

            <Text style={{color:'#1c1c1c',fontSize:10,marginBottom:2,}}>
             {qc_witness_col_map.col5}
            </Text>

            </View>



            </View>


            <View style={{backgroundColor:'#d6d6d6',height:0.5,width:width}}>
            </View>

            <QCWitnessListView
            style={{alignSelf:'stretch',flex:1}}
             type={this.props.type}
             status={'UNCOMPLETED'}
             navigator={this.props.navigator}
             />
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
    topView: {
        height: 150,
        width: width,
    },

    divider: {
    backgroundColor: '#d6d6d6',
    width: width,
    height: 0.5,
    },
    label:{
            color: '#ffffff',
            fontSize:16,
    },
    content:{
            color: '#1c1c1c',
            fontSize:16,
    },
    scrollSpinner: {
       marginVertical: 20,
     },
    flexContainer: {
           height: 54,
           width: width,
           backgroundColor: '#ffffff',
           // 容器需要添加direction才能变成让子元素flex
           flexDirection: 'row',
           alignItems: 'center',
           padding:10,
    },
    itemContainer: {
            flex:1,
            marginTop:0.5,
    },
     statisticsflexContainer: {
              height: 57.5,
              backgroundColor: '#ffffff',
              flexDirection: 'row',
          },

    cell: {
        flex: 1,
        height: 57.5,
        width:width/4,
        justifyContent: "center",
        alignItems: 'center',
         flexDirection: 'column',
    },

    cellLine: {
        width: 2,
        height: 14,
        backgroundColor: '#cccccc',
    },

});
