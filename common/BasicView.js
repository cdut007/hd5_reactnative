import React, {Component} from 'react';
import {ActivityIndicator, View, StyleSheet} from 'react-native';

import NavBar from './NavBar';
import Dimensions from 'Dimensions';

var dimension = Dimensions.get('window');

export default class BasicView extends Component{

	render(){
		if(this.props.isLoading){
			return this.renderLoading();
		}else{
			return this.renderContent();
		}
	}

	renderLoading(){
			return (
				<ActivityIndicator
				  style = {{flex: 1,}}
				  color = 'red'
				  animating = {this.props.isLoading}
				  size = 'large'/>
			);
	}

	renderContent(){
		  return(
				<View style={this.props.style}>
					<NavBar
					  title = {this.props.title}
					  leftIcon={require('../images/back.png')}
					  leftPress={() => this.props.navigator.pop()}/>
					{this.props.content}
				</View>
		  	);
	}

}

 // <BasicView
          // style={styles.container}
          //   title = '测试'
          //   content = {this.renderTest()}
          //   isLoading = {this.state.isLoading}
          //   navigator = {this.props.navigator}
          //    />

const styles = StyleSheet.create({
	root: {
		flex: 1,
	}
})