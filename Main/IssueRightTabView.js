import React, {Component} from 'react';
import {View, Image, Text, TouchableOpacity} from 'react-native';

import CardView from 'react-native-cardview';
import NavBar from '../common/NavBar';
import ScrollableTabView  from 'react-native-scrollable-tab-view';
import HttpRequest from '../HttpRequest/HttpRequest';

import Dimensions from 'Dimensions';
import Global from '../common/globals';
import MyIssueListView from './MyIssueListView';

const width = Dimensions.get('window').width;

const MY_ISSUE_STATUS = ['MYREPLY','MYUNSOLVED','MYSOLVED']

export default class IssueTabView extends Component{

	constructor(props){
		super(props);
		this.state = {
			reply: 0,
			unsolved: 0,
			solved: 0
		}
	}

	componentDidMount(){
		this.requestStatistics();
	}

	requestStatistics(){
		const params = {
			type: 'GDJH'
		};
		HttpRequest.get(
			'/question/statistics',
			 params, 
			 (response) => {
			 	const result = response.responseResult;
			 	this.setState({
			 		reply: result.reply,
			 		unsolved: result.unsolved,
			 		solved: result.solved
			 	})
			 },
			 (error) => {
			 	HttpRequest.printError(error);
			 }
		);
	}

	render(){
		return(
			<View style={{marginTop:10}}>
               	{this.renderMyIssueItem(require('../images/reform_1_icon.png'),'已反馈('+this.state.reply+')',0)}
               	{this.renderMyIssueItem(require('../images/unsolved_icon.png'),'未解决('+this.state.unsolved+')',1)}
               	{this.renderMyIssueItem(require('../images/resolved_icon.png'),'已解决('+this.state.solved+')',2)}
            </View>	    
		);
	}

	renderMyIssueItem(image, name, position){
		return(
			<TouchableOpacity onPress={() => this.onClick(position)}>
				<CardView 
					cardElevation={3}
					cornerRadius={6}
					style={{width:width-30, height:(width-30)/3, backgroundColor:'white', marginLeft:10, marginRight:10, flexDirection:'row', alignItems:'center'}}>
					<Image source={image} style={{width:70, height:70, marginLeft:20, marginRight:20}}/>
					<Text style={{fontSize:16, color:'#292929'}}>{name}</Text>
				</CardView>
			</TouchableOpacity>
		);
	}

	onClick(position){
		switch(position){
			case 0:
				this.props.navigator.push({component:MyIssueListView, props:{title:'已反馈', status:MY_ISSUE_STATUS[0]}})
				break;
			case 1:
				this.props.navigator.push({component:MyIssueListView, props:{title:'未解决', status:MY_ISSUE_STATUS[1]}})
				break;
			case 2:
				this.props.navigator.push({component:MyIssueListView, props:{title:'已解决', status:MY_ISSUE_STATUS[2]}})
				break;
		}
	}

}