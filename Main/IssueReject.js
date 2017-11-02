import React, {Component} from 'react';
import {View, TextInput, Keyboard,} from 'react-native';

import NavBar from '../common/NavBar';
import CommitButton from '../common/CommitButton';

export default class IssueReject extends Component{

	constructor(props){
		super(props);
		this.state = {
			message: '',
		}
	}

	render(){
		return(
			<View style = {{flex: 1, flexDirection: 'column'}}>
				<NavBar
					title = '退回理由'
					leftIcon={require('../images/back.png')}
	              	leftPress={this.back.bind(this)} />
	            <TextInput
	            	style = {{flex: 1, fontSize: 16, color: '#1b1b1b', textAlignVertical: 'top'}}
	            	underlineColorAndroid = 'transparent' 
	            	multiline = {true} 
	            	onChangeText = {(text) => this.setState({message: text})}
	            	placeholder = '请输入退回理由'
	            	placeholderTextColor = '#777777'/>
	            <CommitButton
	            	containerStyle = {{flex: 0}}
	            	title = '确认退回'
	            	onPress = {() => this.confirm()} />     
			</View>
		);
	}

	back(){
		this.props.navigator.pop()
	}

	confirm(){
		Keyboard.dismiss();
		if(this.state.message == ''){
			alert('请输入退回理由');
			return;
		}
		this.props.callback(this.state.message);
		this.props.navigator.pop();
	}
}