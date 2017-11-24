import React, {Component} from 'react';
import {View, Text, SectionList, TouchableOpacity} from 'react-native';
import Dimensions from 'Dimensions';

import NavBar from '../../common/NavBar';
import SeparateComponent from '../../common/SeparateComponent';
import HttpRequest from '../../HttpRequest/HttpRequest';
import ResourceDetailView from './ResourceDetailView';
import ConfirmDialog from '../../common/ConfirmDialog';
import InfoInputView from './InfoInputView';

const departmentHeaders = {material:{id:'序号', name:'物项名称'}, extractCount:'出库量', confirmCount:'核实量', receiver:'领料员'};
const inStoreHeaders = {id:'序号', name:'物项名称', warrantyNo:'质保号', number:'数量'};
const outStoreHeaders = {material:{id:'序号', name:'物项名称'}, extractCount:'出库量', department:{name:'出库单位'}, receiver:'领料员'};

var width = Dimensions.get('window').width;
var pagenum = 1;

/*
 *必须参数: title(标题), type(区分类型: 1-部门出库详情 2-批量入库 3-批量出库)
 */

export default class DepartmentDetailView extends Component{

	constructor(props){
		super(props); 
		let titleHeaders = [];
		switch(this.props.type){
			case 1:
				titleHeaders = departmentHeaders;
				break;
			case 2:
				titleHeaders = inStoreHeaders;
				break;
			case 3:
				titleHeaders = outStoreHeaders;
				break;
		}
		this.state = {
			data: [],
			headers: titleHeaders,
			isRefreshing: false,
			hasMore: false,
			isShow: false,
			content: ''
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
			case 2:
				this.setState({data:[{
    "id": 8,
    "name": "名称-8",
    "warehouse": "仓库-8",
    "location": "货位-8",
    "number": 195,
    "warrantyNo": "224877558",
    "nameEn": "英文名称-8",
    "specificationNo": "规格型号-8",
    "material": "材质-8",
    "securityLevel": "6",
    "warrantyLevel": "0",
    "standard": "标准-8",
    "positionNo": "位号-8",
    "furnaceNo": "炉批号-8",
    "warrantyCount": 38,
    "remark": "备注-8",
    "shipNo": "船次件号-8",
    "price": 63
  }]})
				break;
			case 3:
				this.setState({data:[{
        "id": 1,
        "warrantyNo": "220394141",
        "extractCount": 60,
        "confirmCount": 62,
        "totalPrice": 2728,
        "keeper": "保管员-1",
        "invoiceDate": 930240000000,
        "signDate": 1152633600000,
        "department": {
          "id": 104,
          "name": "经理部",
          "departmentResult": null
        },
        "receiver": "领用人-1",
        "extractNo": "出库单号-1",
        "planNo": "需求计划号-1",
        "remark": "备注-1",
        "accounting": "会计科目-1",
        "material": {
          "id": 1,
          "name": "名称-1",
          "warehouse": "仓库-1",
          "location": "货位-1",
          "number": 123,
          "warrantyNo": "220394141",
          "nameEn": "英文名称-1",
          "specificationNo": "规格型号-1",
          "material": "材质-1",
          "securityLevel": "6",
          "warrantyLevel": "9",
          "standard": "标准-1",
          "positionNo": "位号-1",
          "furnaceNo": "炉批号-1",
          "warrantyCount": 87,
          "remark": "备注-1",
          "shipNo": "船次件号-1",
          "price": 44
        }
      }]})
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
				<ConfirmDialog content={this.state.content} isShow={this.state.isShow} onCancel={() => {this.setState({isShow:false})}} onConfirm={() => this.setState({isShow:false})}/>
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
				{this.renderBottomButton()}
			</View>
		);
	}

	back(){
		this.props.navigator.pop();
	}

	renderHeader(){
		let info = '';
		let count = '';
		switch(this.props.type){
			case 1:
				info = this.props.item.department.name + '今日出库合计数: ';
				count = this.props.item.output;
				break;
			default:
				info = '本次扫描合计数: '
				count = 80;
				break;
		}
		return(
			<View style={{width: width, height:48, backgroundColor:'#fff', justifyContent:'center'}}>
				<Text style={{fontSize:14, color:'#777', marginLeft:10}}>
					<Text style={{fontWeight:'bold', color:'#1c1c1c'}}>{info}</Text>
					{count}
				</Text>
			</View>
		);
	}

	renderItem(item,color){
		switch(this.props.type){
			case 1:
				return this.renderDepartmentItem(item,color);
				break;
			case 2:
				return this.renderInStoreItem(item,color);
				break;
			case 3:
				return this.renderOutStoreItem(item,color);
				break;
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

	renderInStoreItem(item,color){
		return(
			<TouchableOpacity onPress={() => {this.props.navigator.push({component:ResourceDetailView,props:{type:5, item:item}})}}>
				<View style={{width:width, height:48, flexDirection:'row', backgroundColor:'#fff', alignItems:'center'}}>
					<Text style={{flex:1, textAlign:'center', color: color}}>{item.id}</Text>
					<Text style={{flex:1, textAlign:'center', color: color}}>{item.name}</Text>
					<Text style={{flex:1, textAlign:'center', color: color}}>{item.warrantyNo}</Text>	
					<Text style={{flex:1, textAlign:'center', color: color}}>{item.number}</Text>	
				</View>
			</TouchableOpacity>
		);
	}

	renderOutStoreItem(item,color){
		return(
			<TouchableOpacity onPress={() => {this.props.navigator.push({component:ResourceDetailView,props:{type:6, item:item}})}}>
				<View style={{width:width, height:48, flexDirection:'row', backgroundColor:'#fff', alignItems:'center'}}>
					<Text style={{flex:1, textAlign:'center', color: color}}>{item.material.id}</Text>
					<Text style={{flex:1, textAlign:'center', color: color}}>{item.material.name}</Text>
					<Text style={{flex:1, textAlign:'center', color: color}}>{item.extractCount}</Text>	
					<Text style={{flex:1, textAlign:'center', color: color}}>{item.department.name}</Text>	
					<Text style={{flex:1, textAlign:'center', color: color}}>{item.receiver}</Text>			
				</View>
			</TouchableOpacity>
		);
	}

	renderBottomButton(){
		if(this.props.type!=1){
			let title = '入库';
			switch(this.props.type){
				case 2:
					title = '入库';
					break;
				case 3:
					title = '出库';
					break;	
			}
			return(
				<TouchableOpacity
				  activeOpacity={0.8} 
				  style={{width:width, height:48, backgroundColor:'#f77935', alignItems:'center', justifyContent:'center'}}
				  onPress={() => this.clickBottomButton()}>
					<Text style={{color:'#fff', fontSize:18, fontWeight:'bold'}}>{title}</Text>
				</TouchableOpacity>
			);
		}
	}

	clickBottomButton(){
		switch(this.props.type){
			case 2:
				this.props.navigator.push({component:InfoInputView,props:{title:'核实入库',type:1}})
				break;
			case 3:
				this.setState({content:'确认出库',isShow:true})
				break;
		}
	}
}
