import React, {Component} from 'react';
import {View, Text, SectionList, TouchableOpacity} from 'react-native';
import Dimensions from 'Dimensions';

import NavBar from '../../common/NavBar';
import SeparateComponent from '../../common/SeparateComponent';
import HttpRequest from '../../HttpRequest/HttpRequest';
import ResourceDetailView from './ResourceDetailView';

const departmentHeaders = {material:{id:'序号', name:'物项名称'}, extractCount:'出库量', confirmCount:'核实量', receiver:'领料员'};

var width = Dimensions.get('window').width;
var pagenum = 1;

/*
 *必须参数: title(标题), type(区分类型: 1-部门出库详情)
 */

export default class DepartmentDetailView extends Component{

	constructor(props){
		super(props); 
		this.state = {
			data: [],
			headers: departmentHeaders,
			isRefreshing: false,
			hasMore: false
		}
	}

	componentDidMount(){
		this.requestNetInfo();
	}

	requestNetInfo(){
		switch(this.props.type){
			case 1:
				this.requestDepartmentInfo();
				break;
		}
	}

	requestDepartmentInfo(){
		var param = {
			type : 'OUT',
			departmentId: this.props.item.department.id,
			pagesize: 10,
			pagenum: pagenum,
		};
		HttpRequest.get(
			'/material',
			param,
			(response) => {
				let result = response.responseResult;
				let isHasMore = result.pageSize * result.pageNum < result.totalCount;
				if(pagenum ==1){
					this.state.data = result.data;
				}else{
					this.state.data = this.state.data.concat(result.data);
				}
				this.setState({
					isRefreshing: false,
					hasMore: isHasMore
				});
			},
			(error) => {
				this.setState({
					isRefreshing: false,
					hasMore: false
				});
				HttpRequest.printError(error);
			}
		)
	}

	onRefresh(){
		pagenum = 1;
		this.requestNetInfo();
	}

	onEndReached(){
		if(this.state.hasMore){
			pagenum++;
			this.requestNetInfo();
		}
	}


	render(){
		return(
			<View style={{flex:1, backgroundColor:'#f2f2f2', flexDirection:'column'}}>
				<NavBar
					title={this.props.title}
					leftIcon={require('../../images/back.png')}
					leftPress={() => this.back()} />
				{this.renderHeader()}
				<SectionList
					style={{marginTop:10}}
					contentContainerStyle={{backgroundColor:'#fff'}}
					stickySectionHeadersEnabled ={true}
					keyExtractor={(item,index) => item.id}
					onRefresh={() => this.onRefresh()}
					refreshing={this.state.isRefreshing}
					onEndReached={() => this.onEndReached()}
					onEndReachedThreshold={0.5}
					ItemSeparatorComponent={() => <SeparateComponent lineStyle={{marginLeft:10, marginRight:10}}/>}
					SectionSeparatorComponent={() => <SeparateComponent />}
					renderItem={({item}) => this.renderItem(item,'#707070')}
					renderSectionHeader={({section}) => this.renderItem(section.key,'#1c1c1c')}
					sections={[{ key: this.state.headers, data: this.state.data}]} />
			</View>
		);
	}

	back(){
		this.props.navigator.pop();
	}

	renderHeader(){
		let info = '';
		switch(this.props.type){
			case 1:
				info = this.props.item.department.name + '今日出库合计数: ';
				break;
		}
		return(
			<View style={{width: width, height:48, backgroundColor:'#fff', justifyContent:'center'}}>
				<Text style={{fontSize:14, color:'#777', marginLeft:10}}>
					<Text style={{fontWeight:'bold', color:'#1c1c1c'}}>{info}</Text>
					{this.props.item.output}
				</Text>
			</View>
		);
	}

	renderItem(item,color){
		switch(this.props.type){
			case 1:
				return this.renderDepartmentItem(item,color);
		}
	}

	renderDepartmentItem(item,color){
		return(
			<TouchableOpacity onPress={() => {this.props.navigator.push({component:ResourceDetailView,props:{type:1, item:item}})}}>
				<View style={{width:width, height:48, flexDirection:'row', backgroundColor:'#fff', alignItems:'center'}}>
					<Text style={{flex:1, textAlign:'center', color: color}}>{item.material.id}</Text>
					<Text style={{flex:1, textAlign:'center', color: color}}>{item.material.name}</Text>
					<Text style={{flex:1, textAlign:'center', color: color}}>{item.extractCount}</Text>	
					<Text style={{flex:1, textAlign:'center', color: color}}>{item.confirmCount}</Text>	
					<Text style={{flex:1, textAlign:'center', color: color}}>{item.receiver}</Text>			
				</View>
			</TouchableOpacity>
		);
	}
}
