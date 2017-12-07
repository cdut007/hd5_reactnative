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
			<View style = {{flex: 1, flexDirection: 'column', backgroundColor:'#f2f2f2'}}>
				<NavBar
					title = {this.props.title}
					leftIcon={require('../images/back.png')}
	              	leftPress={this.back.bind(this)} />
	            <TextInput
	            	style = {{flex: 1, fontSize: 16, color: '#1b1b1b', textAlignVertical: 'top'}}
	            	underlineColorAndroid = 'transparent' 
	            	multiline = {true} 
	            	onChangeText = {(text) => this.setState({message: text})}
	            	placeholder = {this.props.placeholder}
	            	placeholderTextColor = '#777777'/>
	            <CommitButton
	            	containerStyle = {{flex: 0}}
	            	title = {this.props.buttonTitle}
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
			alert(this.props.placeholder);
			return;
		}
		this.props.callback(this.state.message);
		this.props.navigator.pop();
	}
}