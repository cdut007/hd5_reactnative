import React, {Component} from 'react';
import {View, Text, SectionList, Image, FlatList} from 'react-native';

import NavBar from '../../common/NavBar';
import SeparateComponent from '../../common/SeparateComponent';
import Dimensions from 'Dimensions';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import HttpRequest from '../../HttpRequest/HttpRequest';

const width = Dimensions.get('window').width;

var inPagenum = 1;	//入库http请求分页当前页

const sectionHeaders = {name:'物项名称', specificationNo:'规格型号', warehouse:'储存仓库', location:'货位', number:'数量'};
const departmentImages = [require('../../images/department_1_icon.png'),require('../../images/department_2_icon.png'),require('../../images/department_3_icon.png'),require('../../images/department_4_icon.png'),require('../../images/department_5_icon.png'),require('../../images/department_6_icon.png'),require('../../images/department_7_icon.png'),require('../../images/department_8_icon.png')];

export default class DailyReportView extends Component{

	constructor(props){
		super(props);
		this.state = {
			inStore: '今日入库',
			outStore: '今日出库',
		}
	}

	componentDidMount(){
		this.requestStatistics();
	}


	requestStatistics(){
		var param = {};
		HttpRequest.get(
			'/statistics/material',
			param,
			(response) => {
				let inStoreTitle = response.responseResult.input? '今日入库('+ response.responseResult.input + ')': '今日入库';
				let outStoreTitle = response.responseResult.output? '今日出库('+ response.responseResult.output + ')': '今日出库';
				this.setState({
					inStore: inStoreTitle,
					outStore: outStoreTitle
				})
			},
			(error) => {
				HttpRequest.printError(error);
			}
		);
	}

	render(){
		return(
			<View style={{flex: 1, flexDirection: 'column', backgroundColor: '#f2f2f2'}}>
				<NavBar
					title = {'库存日报'}
					leftIcon = {require('../../images/back.png')}
					leftPress = {() => this.back()} />
				<ScrollableTabView
				    tabBarUnderlineStyle={{backgroundColor: '#f77935'}}
                    tabBarBackgroundColor='#FFFFFF'
                    tabBarActiveTextColor='#f77935'
                    tabBarInactiveTextColor='#777777'>
                    <InStoreView tabLabel={this.state.inStore} />
					<OutStoreView tabLabel={this.state.outStore} />
                </ScrollableTabView>
			</View>
		);
	}

	back(){
		this.props.navigator.pop();
	}

}

class InStoreView extends Component{

	constructor(props){
		super(props);
		this.state = {
			inData: [],
			isRefreshing: false,
			hasMore: false
		}
	}

	componentDidMount(){
		this.requestInStoreData();
	}

	requestInStoreData(){
		var param = {
			pagesize: 10,
			pagenum: inPagenum,
			type: 'IN'
		}
		HttpRequest.get(
			'/material',
			param,
			(response) => {
				var result = response.responseResult;
				isHasMore = result.pageNum*result.pageSize < result.totalCounts;
				if(inPagenum==1){
					this.state.inData = result.data;
				}else{
					this.state.inData = this.state.inData.concat(result.data);
				}
				this.setState({
					isRefreshing: false,
					hasMore: isHasMore
				})
			},
			(error) =>{
				this.setState({
					isRefreshing: false,
					hasMore: false
				})
				HttpRequest.printError(error);
			}
		);
	}

	render(){
		return(
			<SectionList
				style={{marginTop: 10}}
				contentContainerStyle={{backgroundColor:'#fff'}}
				stickySectionHeadersEnabled ={true}
				keyExtractor={(item,index) => item.id}
				onRefresh={() => this.onRefresh()}
				refreshing={this.state.isRefreshing}
				onEndReached={() => this.onEndReached()}
				onEndReachedThreshold={0.5}
				ItemSeparatorComponent={() => <SeparateComponent lineStyle={{marginLeft:10, marginRight:10}}/>}
				SectionSeparatorComponent={() => <SeparateComponent />}
				renderItem={({item}) => this.renderInItem(item,'#707070')}
				renderSectionHeader={({section}) => this.renderInItem(section.key,'#1c1c1c')}
				sections={[{ key: sectionHeaders, data: this.state.inData}]} />
		);
	}

	renderInItem(item,color){
		return(
			<View style={{width:width, height:48, flexDirection:'row', backgroundColor:'#fff', alignItems:'center'}}>
				<Text style={{flex:1, textAlign:'center', color: color}}>{item.name}</Text>
				<Text style={{flex:1, textAlign:'center', color: color}}>{item.specificationNo}</Text>
				<Text style={{flex:1, textAlign:'center', color: color}}>{item.warehouse}</Text>	
				<Text style={{flex:1, textAlign:'center', color: color}}>{item.location}</Text>	
				<Text style={{flex:1, textAlign:'center', color: color}}>{item.number}</Text>			
			</View>
		);
	}

	onRefresh(){
		this.setState({isRefreshing: true})
		inPagenum = 1;
		this.requestInStoreData();
	}

	onEndReached(){
		if(this.state.hasMore){
			inPagenum++;
			this.requestInStoreData();
		}
	}
}

class OutStoreView extends Component{

	constructor(props){
		super(props);
		this.state = {
			outData:[]
		};
	}

	componentDidMount(){
		this.requestOutStoreData();
	}

	requestOutStoreData(){
		var param = {};
		HttpRequest.get(
			'/statistics/material/department',
			param,
			(response) => {this.setState({outData:response.responseResult.departments})},
			(error) =>{
				HttpRequest.printError(error);
			}
		);
	}

	render(){
		return(
			<FlatList 
				tabLabel={this.state.outStore} 
				style={{marginTop:10}}
				keyExtractor={(item,index) => item.department.id}
				contentContainerStyle={{backgroundColor:'#fff'}}
				ItemSeparatorComponent={() => <SeparateComponent lineStyle={{marginLeft:10, marginRight:10}}/>}
				data = {this.state.outData}
				renderItem={({item,index}) => this.renderOutItem(item,index)} />
		);
	}

	renderOutItem(item,index){
		return(
			<View style={{backgroundColor:'#fff', flexDirection:'row', width:width, height:48, alignItems:'center'}}>
				<Image source={departmentImages[(index)%8]} style={{width:34, height:34, marginLeft:10, marginRight:10}} />
				<Text style={{flex:1, color:'#555', fontSize:16, fontWeight:'bold'}}>{item.department.name}</Text>
				<Text style={{fontSize:14, color:'#e82628'}}>{item.output}</Text>
				<Image source={require('../../images/detailsIcon.png')} style={{width:20, height:20, marginRight:10}} />
			</View>
		);
	}
}