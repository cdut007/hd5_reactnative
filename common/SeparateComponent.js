import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';

export default class SeparateComponent extends Component{
	render(){
		return(
			<View style = {[styles.separateLineStyle,this.props.lineStyle]} />
		);
	}
}

const styles = StyleSheet.create({
	separateLineStyle: {
		backgroundColor: '#d6d6d6',
		height: 0.5
	}
})