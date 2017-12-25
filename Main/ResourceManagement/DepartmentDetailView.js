import React, {Component} from 'react';
import {View, Text, SectionList, TouchableOpacity} from 'react-native';
import Dimensions from 'Dimensions';

import NavBar from '../../common/NavBar';
import SeparateComponent from '../../common/SeparateComponent';
import HttpRequest from '../../HttpRequest/HttpRequest';
import ResourceDetailView from './ResourceDetailView';
import ConfirmDialog from '../../common/ConfirmDialog';
import InfoInputView from './InfoInputView';

const departmentHeaders = {no:'序号', name:'物项名称', number:'出库量', confirmCount:'核实量', whoGet:'领料员'};
const backStoreHeaders = {no:'序号', name:'物项名称', number:'退库量', issDept:'退库单位', keeper:'退库员'};
const outStoreHeaders = {no:'序号', name:'物项名称', number:'出库量', issDept:'出库单位', whoGet:'领料员'};
const queryHeaders = {no:'序号', name:'物项名称', specificationNo:'规格型号', number:'库存数量'};

var width = Dimensions.get('window').width;

/*
 *必须参数: title(标题), type(区分类型: 1-部门出库详情 2-批量退库 3-批量出库 4-物项查询列表) item(数据源) conditions(物项查询条件)
 */

export default class DepartmentDetailView extends Component{

	pagenum = 1;

	constructor(props){
		super(props); 
		let titleHeaders = [];
		switch(this.props.type){
			case 1:
				titleHeaders = departmentHeaders;
				break;
			case 2:
				titleHeaders = backStoreHeaders;
				break;
			case 3:
				titleHeaders = outStoreHeaders;
				break;
			case 4:
				titleHeaders = queryHeaders;
			    break;
		}
		this.state = {
			data: [],
			headers: titleHeaders,
			isLoading: true,
			isRefreshing: false,
			hasMore: false,
		}
	}

	componentDidMount(){
		this.requestNetInfo();
	}

	requestNetInfo(){
		this.setState({isLoading:true});
		switch(this.props.type){
			case 1:
				this.requestDepartmentInfo();
				break;
			case 2:
				this.setState({data:this.props.item, isRefreshing:false, isLoading:false, hasMore:false});
				break;
			case 3:
				this.setState({data:this.props.item, isRefreshing:false, isLoading:false, hasMore:false});
				break;
			case 4:
				this.requestQueryInfo();
				break;
		}
	}

	requestDepartmentInfo(){
		var param = {
			ISS_DEPT: this.props.item.issDept,
			pagesize: 10,
			pagenum: this.pagenum,
		};
		HttpRequest.post(
			'/material/materialTodayOutList',
			param,
			(response) => {
				let result = response.responseResult;
				let isHasMore = result.pageSize * result.pageNum < result.totalCount;
				if(this.pagenum == 1){                     
					this.state.data = result.data;
				}else{
					this.state.data = this.state.data.concat(result.data);
				}
				this.setState({
					isLoading: false,
					isRefreshing: false,
					hasMore: isHasMore
				});
			},
			(error) => {
				this.setState({
					isLoading: false,
					isRefreshing: false,
					hasMore: false
				});
				HttpRequest.printError(error);
			}
		)
	}

	requestQueryInfo(){
		let params = this.props.conditions;
		params.pagenum = this.pagenum;
		params.pagesize = 10;
		HttpRequest.post(
			'/material/materialQueryList',
			params,
			(response) => {
				let result = response.responseResult;
				let isHasMore = result.pagesize * result.pageNum < result.totalCounts;
				if(this.pagenum == 1){
					this.state.data = result.datas;
				}else{
					this.state.data = this.state.data.concat(result.datas);
				}
				this.setState({
					isLoading: false,
					isRefreshing: false,
					hasMore: isHasMore
				});
			},
			(error) => {
				this.setState({
					isLoading: false,
					isRefreshing: false,
					hasMore: false
				});
				HttpRequest.printError(error);
			}
		)
	}

	onRefresh(){
		this.setState({isRefreshing:true});
		this.pagenum = 1;
		this.requestNetInfo(); 
	}

	onEndReached(){
		if(this.state.hasMore && !this.state.isLoading){
			this.pagenum++;
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
					renderItem={({item}) => this.renderItem(item,'#707070',false)}
					renderSectionHeader={({section}) => this.renderItem(section.key,'#1c1c1c',true)}
					sections={[{ key: this.state.headers, data: this.state.data}]} />
			</View>
		);
	}

	back(){
		this.props.navigator.pop();
	}

	renderItem(item,color,isHeader){
		switch(this.props.type){
			case 1:
				return this.renderDepartmentItem(item,color,isHeader);
				break;
			case 2:
				return this.renderBackStoreItem(item,color,isHeader);
				break;
			case 3:
				return this.renderOutStoreItem(item,color,isHeader);
				break;
			case 4:
				return this.renderQueryItem(item, color, isHeader);
				break;
		}
	}

	renderDepartmentItem(item,color,isHeader){
		return(
			<TouchableOpacity onPress={() => {this.props.navigator.push({component:ResourceDetailView,props:{type:1, item:item}})}}>
				<View style={{width:width, height:48, flexDirection:'row', backgroundColor:'#fff', alignItems:'center'}}>
					<Text style={{flex:1, textAlign:'center', color: color}}>{item.no}</Text>
					<Text style={{flex:1, textAlign:'center', color: color}}>{item.name}</Text>
					<Text style={{flex:1, textAlign:'center', color: color}}>{item.number}</Text>	
					<Text style={{flex:1, textAlign:'center', color: color}}>{item.confirmCount}</Text>	
					<Text style={{flex:1, textAlign:'center', color: color}}>{item.whoGet}</Text>			
				</View>
			</TouchableOpacity>
		);
	}

	renderBackStoreItem(item,color,isHeader){
		return(
			<TouchableOpacity onPress={() => {isHeader ? {} : this.props.navigator.push({component:ResourceDetailView,props:{type:5, item:item, callback:(item)=>this.callback(item)}})}}>
				<View style={{width:width, height:48, flexDirection:'row', backgroundColor: item.hasDone ? '#fff9f6' : '#fff', alignItems:'center'}}>
					<Text style={{flex:1, textAlign:'center', color: color}}>{item.no}</Text>
					<Text style={{flex:1, textAlign:'center', color: color}}>{item.name}</Text>
					<Text style={{flex:1, textAlign:'center', color: color}}>{item.number}</Text>	
					<Text style={{flex:1, textAlign:'center', color: color}}>{item.issDept}</Text>	
					<Text style={{flex:1, textAlign:'center', color: color}}>{item.keeper}</Text>	
				</View>
			</TouchableOpacity>
		);
	}

	renderOutStoreItem(item,color,isHeader){
		return(
			<TouchableOpacity onPress={() => {isHeader ? {} : this.props.navigator.push({component:ResourceDetailView,props:{type:4, item:item, callback:(item)=>this.callback(item)}})}}>
				<View style={{width:width, height:48, flexDirection:'row', backgroundColor: item.hasDone ? '#fff9f6' : '#fff', alignItems:'center'}}>
					<Text style={{flex:1, textAlign:'center', color: color}}>{item.no}</Text>
					<Text style={{flex:1, textAlign:'center', color: color}}>{item.name}</Text>
					<Text style={{flex:1, textAlign:'center', color: color}}>{item.number}</Text>	
					<Text style={{flex:1, textAlign:'center', color: color}}>{item.issDept}</Text>	
					<Text style={{flex:1, textAlign:'center', color: color}}>{item.whoGet}</Text>			
				</View>
			</TouchableOpacity>
		);
	}

	renderQueryItem(item,color,isHeader){
		return(
			<TouchableOpacity onPress={() => {isHeader ? {} : this.props.navigator.push({component:ResourceDetailView,props:{type:6, item:item}})}}>
				<View style={{width:width, height:48, flexDirection:'row', backgroundColor:'#fff', alignItems:'center'}}>
					<Text style={{flex:1, textAlign:'center', color: color}}>{item.no}</Text>
					<Text style={{flex:1, textAlign:'center', color: color}}>{item.name}</Text>
					<Text style={{flex:1, textAlign:'center', color: color}}>{item.specificationNo}</Text>	
					<Text style={{flex:1, textAlign:'center', color: color}}>{item.number}</Text>	
				</View>
			</TouchableOpacity>
		);
	}

	callback(item){
		item.hasDone = true;
		this.setState({data:this.state.data});
	}
}
