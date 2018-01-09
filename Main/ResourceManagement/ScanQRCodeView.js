import React, { Component } from 'react';
import {View, Image, Text} from 'react-native';

import NavBar from '../../common/NavBar';
import Dimensions from 'Dimensions';
import QRCodeView from 'react-native-camera';
import DepartmentDetailView from './DepartmentDetailView';
import ResourceDetailView from './ResourceDetailView';
import HttpRequest from '../../HttpRequest/HttpRequest';
import Spinner from 'react-native-loading-spinner-overlay';
import Global from '../../common/globals';

var width = Dimensions.get('window').width;

const STATUS = [
  'CANCEL',  //以TK为开头的二维码扫描结果
  'OUT',    //以CK,SJ为开头的二维码扫描结果
  'IN'     //剩余的其他扫描结果
  ];

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
						<Text style = {{color: '#9e9d9c', fontSize: 12}}>入库</Text>
					</View>
					<View style = {{flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
						<Image 
							style = {{width: 36, height: 36}}
							source = {require('../../images/output_icon.png')} />
						<Text style = {{color: '#9e9d9c', fontSize: 12}}>出库</Text>
					</View>
					<View style = {{flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
						<Image 
							style = {{width: 36, height: 36}}
							source = {require('../../images/return_icon.png')} />
						<Text style = {{color: '#9e9d9c', fontSize: 12}}>退库</Text>
					</View>
				</View>
				<Spinner visible={this.state.isLoading} />
			</View>
		);
	}
 	 	
	back(){
		this.props.navigator.pop();
	}

	onBarCodeReceived(e){
		if(e.data && !this.state.isLoading){
	      this.setState({isLoading:true});
	      var params = {id:e.data};
	      if(e.data.indexOf('TK') != -1){
	        params.type = STATUS[0];
	      }else if(e.data.indexOf('CK') != -1 || e.data.indexOf('SJ') != -1){
	        params.type = STATUS[1];
	      }else{
	        params.type = STATUS[2];
	      }
	      HttpRequest.get(
	        `/material/enpower/${e.data}`,
	        params,
	        (response) => {
	          this.setState({isLoading:false});
	          if(e.data.indexOf('TK') != -1){
	            this.props.navigator.replace({component:DepartmentDetailView, props:{title:'退库单', type:2, item:response.responseResult}})
	          }else if(e.data.indexOf('CK') != -1 || e.data.indexOf('SJ') != -1){
	            this.props.navigator.replace({component:DepartmentDetailView, props:{title:'出库单', type:3, item:response.responseResult}})
	          }else{
	            this.props.navigator.replace({component:ResourceDetailView, props:{type:3, item:response.responseResult}})
	          }
	        },
	        (error) => {
	       	  Global.alert('此单已处理')
	          HttpRequest.printError(error);
	          this.setState({isLoading:false});
	        }
	      )
	    }
	}
}