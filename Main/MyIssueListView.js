import React, {Component} from 'react';
import {View} from 'react-native';

import IssueListView from './IssueListView';
import NavBar from '../common/NavBar';

/**
 *必要参数: title(标题) status(问题状态)
 */

export default class MyIssueListView extends Component{

	render(){
		return(
			<View style={{backgroundColor:'#f2f2f2', flex:1}}>
				<NavBar
					title={this.props.title}
					leftIcon={require('../images/back.png')}
					leftPress={() => this.back()} />
				{this.renderListView()}
			</View>
		);
	}

	back(){
		this.props.navigator.pop();
	}

	renderListView() {
        return (
            <View style={{marginTop:10,}}>
	            <IssueListView
	              isMyIssue={true}
	              type={this.props.type}
	              status={this.props.status}
	              navigator={this.props.navigator} />
            </View>
        );
    }

}