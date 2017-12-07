import React, {Component} from 'react';
import {View, Text, TouchableOpacity, ListView, StyleSheet} from 'react-native';

import Dimensions from 'Dimensions';

import NavBar from '../../common/NavBar'
import CircleLabelHeadView from '../../common/CircleLabelHeadView';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import IssueListViewContainer from '../IssueListViewContainer';
import HttpRequest from '../../HttpRequest/HttpRequest';
import IssueRightTabView from '../IssueRightTabView';

import Spinner from 'react-native-loading-spinner-overlay';

var width = Dimensions.get('window').width;


export default class SolverLeaderView extends Component{

	constructor(props){
		super(props);
		

		this.state = {
			loadingVisible: false,
			dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
		}
	}

	componentDidMount(){
		this.requestStatistics();
	}

	requestStatistics(){
		let param = {type: 'GDJH'};
		this.setState({loadingVisible: true});
		HttpRequest.get('/statistics/problem', param, this.onGetDataSuccess.bind(this),
			(e) => {
				this.setState({loadingVisible: false,});
                try {
                  var errorInfo = JSON.parse(e);
                  if (errorInfo != null) {
                   console.log(errorInfo)
                  } else {
                      console.log(e)
                  }
                }
                catch(err)
                {
                    console.log(err)
                }
                console.log('executeNetWorkRequest error:' + e)
			}
		)
	}

	onGetDataSuccess(response){
		if(response.responseResult){
			let results = response.responseResult.supervisor;
			this.setState({
				loadingVisible: false,
				dataSource: this.state.dataSource.cloneWithRows(results),
			})
		}
	}

	render(){
		return(
			<View style = {styles.container}>
				<NavBar
	                title={'管道问题'}
	                leftIcon={require('../../images/back.png')}
	                leftPress={this.back.bind(this)} />
	            <ScrollableTabView 
	            	locked={true}
                    tabBarUnderlineStyle={{backgroundColor: '#f77935'}}
                    tabBarBackgroundColor='#FFFFFF'
                    tabBarActiveTextColor='#f77935'
                    tabBarInactiveTextColor='#777777'>
                    <ListView
                    	tabLabel={'问题列表'}
						dataSource = {this.state.dataSource}
						renderRow = {(rowData)=>this.renderRow(rowData)} 
						automaticallyAdjustContentInsets={false}
	            	    keyboardDismissMode="on-drag"
	               	    keyboardShouldPersistTaps='always'
	           	  	    showsVerticalScrollIndicator={false} />
                   	<IssueRightTabView {...this.props} tabLabel={'我的问题'}/>
				</ScrollableTabView>
           	  	<Spinner visible = {this.state.loadingVisible} />
			</View>
		);
	}

	renderEmpty(){
		if(this.state.dataSource.getRowCount() <= 0) {
           	return (
           	    <Text style={{fontSize: 14, flex: 1, fontWeight: 'bold'}}>Empty</Text>
           	);  			
        }
	}

	back(){
		this.props.navigator.pop();
	}

	renderRow(rowData){
		return(
			<TouchableOpacity style={styles.itemContainer} onPress={ () => this.onItemPress(rowData) }>
				<View style={{width: width, height: 54, flexDirection: 'row', alignItems: 'center',}}>
					<CircleLabelHeadView contactName={rowData.user.realname} imageStyle={{marginLeft: 10,}}/>
					<Text style={{fontSize: 16, color: '#1c1c1c', marginLeft: 10,}}>{rowData.user.realname}</Text>
					<View style={{marginLeft: 8, marginRight: 12, backgroundColor: '#aeaeae', width: 2, height: 14}} />
					<Text style={{fontSize: 14, color: '#888888'}}>{rowData.statistics.total}</Text>
				</View>
				<View style={{width: width, height: 0.5, backgroundColor: '#d6d6d6'}} />
				<View style={{width: width, height: 57.5, flexDirection: 'row',}}>
					{this.renderCell('未处理', rowData.statistics.pre, '#1c1c1c')}
					{this.renderCell('已回执', rowData.statistics.done, '#1c1c1c')}
					{this.renderCell('已解决', rowData.statistics.solved, '#1c1c1c')}
					{this.renderCell('未解决', rowData.statistics.unsolved, '#e82628')}
				</View>
			</TouchableOpacity>
		);
	}

	renderCell(title, value, color){
		return(
			<View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
				<Text style={{color: color, fontSize: 12,}}>{title}</Text>
				<Text style={{color: color, fontSize: 12, marginTop: 2}}>{value}</Text>
			</View>
		);
	}

	onItemPress(rowData){
		this.props.navigator.push({
			component: IssueListViewContainer,
			props: {
				data: rowData,
				type: this.props.type
			}
		})
	}
}

const styles = StyleSheet.create({
	container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
    },
    itemContainer: {
    	backgroundColor: 'white',
    	marginTop: 10,
    	flex: 1,
    	flexDirection: 'column',
    }
})