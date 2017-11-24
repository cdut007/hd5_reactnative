import React, { Component } from 'react';
import {View, Image, Text} from 'react-native';

import NavBar from '../../common/NavBar';
import Dimensions from 'Dimensions';
import QRCodeView from 'react-native-camera';
import DepartmentDetailView from './DepartmentDetailView';
import ResourceDetailView from './ResourceDetailView';

var width = Dimensions.get('window').width;

export default class ScanQRCodeView extends Component{

	constructor(props){
		super(props);
		this.state = {
			isLoading: false
		}
	}

	render(){
		return(
			<View style = {{flex: 1, flexDirection: 'column',}} >
				<NavBar
					style = {{backgroundColor: '#1b1612'}}
					titleStyle = {{color: '#ffffff'}}
					lineStyle = {{backgroundColor: '#1b1612'}}
					title = {'二维码'}
					leftIcon = {require('../../images/white_back_icon.png')}
					leftPress = {this.back.bind(this)} />
				<QRCodeView
					style = {{flex: 1, alignItems: 'center', justifyContent: 'center'}}
					onBarCodeRead = {(e) => this.onBarCodeReceived(e)}>
					<Image
						source = {require('../../images/discern_icon.png')}
						style = {{width: width*0.7, height: width*0.7}} />
					<Text style = {{fontSize: 14, color: '#f77935', marginTop: 20}}>
						自动识别，支持以下物项业务处理
					</Text>
				</QRCodeView>
				<View style = {{width: width, height: 80, backgroundColor: '#1b1612', flexDirection: 'row'}}>
					<View style = {{flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
						<Image 
							style = {{width: 36, height: 36}}
							source = {require('../../images/storage_icon.png')} />
						<Text style = {{color: '#9e9d9c', fontSize: 12}}>单/批量入库</Text>
					</View>
					<View style = {{flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
						<Image 
							style = {{width: 36, height: 36}}
							source = {require('../../images/output_icon.png')} />
						<Text style = {{color: '#9e9d9c', fontSize: 12}}>单/批量出库</Text>
					</View>
					<View style = {{flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
						<Image 
							style = {{width: 36, height: 36}}
							source = {require('../../images/return_icon.png')} />
						<Text style = {{color: '#9e9d9c', fontSize: 12}}>退库处理</Text>
					</View>
					<View style = {{flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
						<Image 
							style = {{width: 36, height: 36}}
							source = {require('../../images/stock_icon.png')} />
						<Text style = {{color: '#9e9d9c', fontSize: 12}}>库存查询</Text>
					</View>
					<View style = {{flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
						<Image 
							style = {{width: 36, height: 36}}
							source = {require('../../images/delivery_record_icon.png')} />
						<Text style = {{color: '#9e9d9c', fontSize: 12}}>出库记录</Text>
					</View>
				</View>
			</View>
		);
	}
 	 	
	back(){
		this.props.navigator.pop();
	}

	onBarCodeReceived(e){
		if(e.data && !this.state.isLoading){
			this.setState({isLoading:true})
			if(e.data == 2){
				this.props.navigator.replace({component:DepartmentDetailView,props:{title:'入库单',type:2}})
			}else if(e.data == 3){
				this.props.navigator.replace({component:DepartmentDetailView,props:{title:'出库单',type:3}})
			}else if(e.data == 4){
				this.props.navigator.replace({component:ResourceDetailView,props:{type:3,item:{
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
  }}})
			}else if(e.data == 5){
				this.props.navigator.replace({component:ResourceDetailView,props:{type:4,item:{
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
      }}})
			}else if(e.data == 6){
				this.props.navigator.replace({component:ResourceDetailView,props:{type:7,item:{
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
      }}})
			}else if(e.data == 7){
				this.props.navigator.replace({component:ResourceDetailView,props:{type:8,item:{
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
  }}})
			}else if(e.data == 8){
				this.props.navigator.replace({component:ResourceDetailView,props:{type:9,item:{
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
      }}})
			}
		}
	}
}