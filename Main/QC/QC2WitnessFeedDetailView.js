import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Platform,
    TouchableNativeFeedback,
    TouchableHighlight,
    ScrollView,
    AsyncStorage,
    TextInput,
    DeviceEventEmitter,
    Keyboard
} from 'react-native';
import Dimensions from 'Dimensions';
import NavBar from '../../common/NavBar';
import px2dp from '../../common/util';
import HttpRequest from '../../HttpRequest/HttpRequest'
import DisplayItemView from '../../common/DisplayItemView';
import EnterItemView from '../../common/EnterItemView';
import EditItemView from '../../common/EditItemView';
import Spinner from 'react-native-loading-spinner-overlay'
import dateformat from 'dateformat';
import Accordion from 'react-native-collapsible/Accordion';

import Global from '../../common/globals.js'
import CommitButton from '../../common/CommitButton'

import DateTimePickerView from '../../common/DateTimePickerView'

import MemberSelectView from '../../common/MemberSelectView'
import WitnessFailResultView from '../../Main/WitnessFailResultView';

const isIOS = Platform.OS == "ios"
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
var account = Object();
const MAX_IMAGE_COUNT = 5;
var options = {
    title: '', // specify null or empty string to remove the title
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '拍照', // specify null or empty string to remove this button
    chooseFromLibraryButtonTitle: '从相册选取', // specify null or empty string to remove this button
    cameraType: 'back', // 'front' or 'back'
    mediaType: 'photo', // 'photo' or 'video'
    videoQuality: 'medium', // 'low', 'medium', or 'high'
    durationLimit: 10, // video recording max time in seconds
    maxWidth: 1920, // photos only
    maxHeight: 1920, // photos only
    aspectX: 2, // aspectX:aspectY, the cropping image's ratio of width to height
    aspectY: 1, // aspectX:aspectY, the cropping image's ratio of width to height
    quality: 1, // photos only
    angle: 0, // photos only
    allowsEditing: false, // Built in functionality to resize/reposition the image
    noData: true, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos)
    storageOptions: { // if this key is provided, the image will get saved in the documents/pictures directory (rather than a temporary directory)
        skipBackup: true, // image will NOT be backed up to icloud
        path: 'images' // will save image at /Documents/images rather than the root
    }
};
import ImagePicker from 'react-native-image-picker'

export default class QC2WitnessFeedDetailView extends Component {
    constructor(props) {
        super(props);
        var data = this.props.data
        data.rollingPlan = new Object()
        this.state = {
            title: '见证回填',
            isHankouType:1,
            data:data,
            choose_address:null,
            choose_date:null,
            input_witnessdesc:null,
            input_dosage:null,
            choose_result:null,
            remark:null,
            fileArr: [{}],
            witnessAddresses:data.witnessAddresses,
            witness_resules:['合格','不合格'],
            witnessNotOkResultType:'不合格原因2',
            witnessNotOkResultTypes: ['不合格原因1','不合格原因2'],
        };
    }


    componentDidMount() {

        this.executeNetWorkRequest(this.props.data.rollingPlanId);
    }

     onGetDataSuccess(response){
         console.log('onGetDataSuccess@@@@')
         this.state.data.rollingPlan = response.responseResult
         this.setState({
             data:this.state.data,
         });
     }

    executeNetWorkRequest(id){
         console.log('executeNetWorkRequest:work id = ' + id);
         var paramBody = {
             }

    HttpRequest.get('/rollingplan/'+id, paramBody, this.onGetDataSuccess.bind(this),
        (e) => {

            try {
                var errorInfo = JSON.parse(e);
                if (errorInfo != null) {
                 console.log(errorInfo)
                } else {
                    console.log(e)
                }
            }
            catch(err)
            {
                console.log(err)
            }

            console.log('executeNetWorkRequest error:' + e)
        })
    }


    componentWillMount(){

    }
    componentWillUnmount(){

    }

    back() {
        this.props.navigator.pop()
    }


    render() {

        return (

            <View style={styles.container}>
            <NavBar title={this.state.title}
            leftIcon={require('../../images/back.png')}
            leftPress={this.back.bind(this)}
            />

            <View style={{backgroundColor:'#f2f2f2',height:10,width:width}}></View>
             {this.renderDetailView()}
             {this.renderFormView()}
             <Spinner
                 visible={this.state.loadingVisible}
             />
            </View>
        )
    }

    onDeliverySuccess(response){
        this.setState({
            loadingVisible: false
        })
        Global.showToast(response.message)
        //update
        this.props.data.realWitnessAddress = this.state.choose_address;
        this.props.data.realWitnessDate = this.state.choose_date;
        this.props.data.result = this.state.choose_result == '合格' ? 'QUALIFIED' : 'UNQUALIFIED' ;
        DeviceEventEmitter.emit('witness_update','witness_update');
        DeviceEventEmitter.emit('Qc_issueDeals','Qc_issueDeals');
        this.back();

    }

    startWitness(){
        if (!this.state.choose_date) {
            alert('请选择见证日期')
            return
        }

        if (!this.state.choose_address) {
            alert('请选择见证地点')
            return
        }
        var result = '3'
        if (!this.state.choose_result) {
            alert('请选择见证结果')
            return
        }else{

            if (this.state.choose_result == '合格') {
                result = '3'
            }else{
                result = '1'
                if (!this.state.witnessNotOkResultType) {
                    alert('请选择不合格原因')
                    return
                }
                if (!this.state.remark) {
                    alert('请填写不合格原因')
                    return
                }

                // if(this.state.fileArr.length<=1){
                //     alert('请选择至少一张图片');
                //     return;
                // }
            }
        }


        var bodyArray=[]
        for (var i = 0; i < this.state.data.length; i++) {
            var elemnt = new Object()

            elemnt.id = this.state.data[i].id
            elemnt.witnessaddress = this.state.data[i].choose_address
            elemnt.witnessdate = Global.formatFullDate(this.state.data[i].choose_date)
            bodyArray.push(elemnt)
        }

        this.setState({
            loadingVisible: true
        })

        if (result == '1') {
            var param = new FormData()
            param.append('id', this.props.data.id)
            param.append('witnessaddress', this.state.choose_address)
            param.append('witnessdate', this.state.choose_date)
            param.append('witnessdesc', this.state.input_witnessdesc)
            param.append('dosage', this.state.input_dosage)
            param.append('isok', result)
            param.append('remark', this.state.remark)
            param.append('failType', this.state.witnessNotOkResultType)
            if (this.state.fileArr.length>0) {
                this.state.fileArr.map((item, i) => {
                    if (item['fileSource']) {
                       let file = {uri: item['fileSource'], type: 'multipart/form-data', name: item['fileName']};   //这里的key(uri和type和name)不能改变,
                       param.append("file"+i,file);   //这里的files就是后台需要的key
                    }
                });
            }

            HttpRequest.uploadImage('/witness_op/result', param, this.onDeliverySuccess.bind(this),
                (e) => {
                    try {
                        alert(e)
                    }
                    catch (err) {
                        console.log(err)
                    }

                    this.setState({
                        loadingVisible: false
                    })
                })
        }else{
            var paramBody = {
                     id:this.props.data.id,
                     witnessaddress:this.state.choose_address,
                     witnessdate:this.state.choose_date,
                     witnessdesc:this.state.input_witnessdesc,
                     dosage:this.state.input_dosage,
                     isok:result,
                }

            HttpRequest.post('/witness_op/result', paramBody, this.onDeliverySuccess.bind(this),
                (e) => {
                    this.setState({
                        loadingVisible: false
                    });
                    try {
                        var errorInfo = JSON.parse(e);
                    }
                    catch(err)
                    {
                        console.log("error======"+err)
                    }
                        if (errorInfo != null) {
                            if (errorInfo.code == -1002||
                             errorInfo.code == -1001) {
                            alert(errorInfo.message);
                        }else {
                            alert(e)
                        }

                        } else {
                            alert(e)
                        }


                    console.log(' error:' + e)
                })
        }



    }


    renderFormView(){
            //1  fininshed retun, jsut san

                return(<View style={{height:50,width:width,flexDirection:'row'}}>
                        <View style={{height:50,flex:1}}><CommitButton title={'提交'}
                                onPress={this.startWitness.bind(this)}></CommitButton></View>
                                </View>)



    }



    getStatus(status){
        if (status == 'WITNESSED') {
            if (this.props.data.result == 'UNQUALIFIED') {
                return '不合格'
            }else if(this.props.data.result == 'QUALIFIED'){
                return '合格'
            }
        }else if (status == 'UNWITNESS'||status == 'ASSIGNED') {
            return '待见证'
        }
            return Global.getWitnesstatus(status)
    }

    renderDetailView(){
            return(<ScrollView
            style={styles.mainStyle}>
            {this.renderItem()}
            </ScrollView>);
    }

    getQCCheckStatus(sign){
        if (sign == 0) {
			return "未确认";
		}else if (sign == 1) {
			return "确认";
		}else if (sign == 2) {
			return "退回";
		}
        return '';
    }

    go2WorkStepDetail(){

    }

    go2ZhijiaUpdate(){

    }

    issueFeedBack(){
         this.props.navigator.push({
            component: IssueReportView,
             props: {
                 data:this.state.data,
                }
        })
    }

    issueDetail(){
        // this.props.navigator.push({
        //     component: PlanIssueListView,
        //      props: {
        //
        //          data:this.state.data,
        //         }
        // })
    }

    witnessDealBatTask(){
        this.props.navigator.push({
            component: SingleWorkRollDealBatWitnessView,
             props: {
                 data:this.state.data,
                }
        })
    }

    go2ItemDetail(menu){
        this.props.navigator.push({
            component: CommonContentView,
             props: {
                 title:menu.title,
                 content:menu.content,
                }
        })
    }


    onItemClick(menu){
         console.log('menu:work id = ' + menu.id);
        if (menu.id == '9') {
            this.go2WorkStepDetail();
        } else if (menu.id == '9a') {
            this.go2ZhijiaUpdate();
        } else if (menu.id == 'c') {
            this.setState({displayMore:!this.state.displayMore});
        } else if (menu.id == '10') {
            this.issueFeedBack();
        } else if (menu.id == '-1') {
            this.issueDetail();
        } else if (menu.id == 'e9') {
            this.witnessDealBatTask();
        } else {
            try {
                var  index = parseInt(menu.id);
                if (index >=11 && index<= 15) {
                    this.go2ItemDetail(menu);
                }
            }
            catch(err)
            {
                console.log(err)
            }
        }

    }


    onChangeText(keyValue,text){
        console.log(text+"content===="+keyValue);
        this.state[keyValue] = text;
        //this.setState({...this.state});
    }




    onSelectedDate(id,date){
     console.log(id+"date=="+date.getTime());

     this.state[id] = Global.formatFullDate(date);
     this.setState({...this.state});
    }

    onSelectedMember(id,member){


        console.log(JSON.stringify(member)+"choose====");

         this.state[id] = member[0];
        this.setState({...this.state});

    }

   chooseItemInfo(id,title,content,data,type){
      if (type == 'date') {

          return(<View>
              <View style= {{flex: 1,
              justifyContent: 'flex-start',
              flexDirection: 'row',
              paddingLeft:10,
              paddingRight:10,
              paddingTop:8,
              backgroundColor:'#ffffff',
              paddingBottom:8,
              height: 48,
              alignItems: 'center',}}>
                  <Text style= {{width: width * 0.33,fontSize: 14,color: "#1c1c1c"}}>{title} : </Text>
                  <DateTimePickerView
                  ref={(c) => this._selectD = c}
                                         type={'datetime'}
                                         minTime={new Date()}
                                         title={content}
                                         style={{color:'#6d9ee1',fontSize:14,flex:1}}
                                         onSelected={this.onSelectedDate.bind(this,id)}
                                     />
              </View>
             <View style={{backgroundColor: '#d6d6d6',
                 width: width,
                 height: 1,
                 marginLeft:10,}}/>
              </View>)

      }else{

          return(<View>
              <View style= {{flex: 1,
              justifyContent: 'flex-start',
              flexDirection: 'row',
              paddingLeft:10,
              paddingRight:10,
              paddingTop:8,
              backgroundColor:'#ffffff',
              paddingBottom:8,
              height: 48,
              alignItems: 'center',}}>
                  <Text style= {{width: width * 0.33,fontSize: 14,color: "#1c1c1c"}}>{title} : </Text>

                  <MemberSelectView
                  ref={(c) => this._selectM = c}
                  style={{color:'#6d9ee1',fontSize:14,flex:1}}
                  title={content}
                  data={data}
                  pickerTitle={title}
                  onSelected={this.onSelectedMember.bind(this,id)} />
              </View>
             <View style={{backgroundColor: '#d6d6d6',
                 width: width,
                 height: 1,
                 marginLeft:10,}}/>
              </View>)

      }

   }

   notOKView(){

       return(<View>
           {this.renderSelectView()}
           <View style={{backgroundColor: 'white', width: width, height: 150, paddingTop: 10, paddingLeft: 10,}}>
               <Text style={{color: '#1c1c1c', fontSize: 14}}>填写不合格原因:</Text>
               <TextInput
                   style={{flex: 1, fontSize: 14, color: '#1c1c1c', padding: 5, textAlignVertical: 'top',}}
                   underlineColorAndroid ='transparent'
                   multiline = {true}
                   onChangeText={(text) => this.setState({ remark: text })}
                   value={this.state.content} />
           </View>
           {this.renderFileView()}
       </View>)
   }


   renderFileView() {
       return (
           <View style={{flexDirection: 'row', flexWrap: 'wrap', width: width, paddingTop: 10, paddingRight: 10}} horizontal={true} >
                   {this.renderImages()}
           </View>
       )
   }


   onSelectFile(idx) {
       this.currentFileIdx = idx

       let showPicker = () => {
           ImagePicker.showImagePicker(options, (response) => {
               //   console.log('Response = ', response);
               if (response.didCancel) {
                   console.log('User cancelled image picker');
               }
               else if (response.error) {
                   console.log('ImagePicker Error: ', response.error);
               }
               else if (response.customButton) {
                   console.log('User tapped custom button: ', response.customButton);
               }
               else {
                   // You can display the image using either data:
                   // const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
                   var source;
                   if (Platform.OS === 'android') {
                        source = {uri: response.uri, isStatic: true};
                    } else {
                       source = {
                          uri: response.uri.replace('file://', ''),
                          isStatic: true
                       };
                   }

                  var fileInfo = this.state.fileArr[this.currentFileIdx]
                  fileInfo['fileSource'] = source.uri
                   fileInfo['fileName'] = response.fileName

                   if(this.state.fileArr.length<MAX_IMAGE_COUNT && this.state.fileArr[this.state.fileArr.length-1]['fileSource']){
                       this.state.fileArr.push({});
                   }
                   this.setState({
                       ...this.state
                   });
               }
           });
       }


       showPicker()

   }

   onDeleteFile(idx) {

       if(this.state.fileArr[idx]['fileSource']){
           this.state.fileArr.splice(idx, 1)
           this.setState({
               ...this.state
           })
       }


   }

   renderImages(){
       var imageViews = [];
       {this.state.fileArr.map((item,i) => {
               imageViews.push(
                   <TouchableOpacity
                    key={i}
                    onPress = {() => this.onSelectFile(i) }
                    onLongPress = { () => this.onDeleteFile(i) }
                    style={{width: 70, height: 70, marginLeft: 10, marginBottom: 10,}}>
                       {
                           item['fileSource']
                            ?
                           (<Image resizeMode={'cover'} style={{ width: 70, height: 70, borderRadius: 4, borderWidth: 0.5}} source={{uri: item['fileSource']}} />)
                            :
                           (<Image resizeMode={'cover'} style={{ width: 70, height: 70, borderRadius: 4, borderWidth: 0.5}} source={require('../../images/add_pic_icon.png')} />)
                       }
                   </TouchableOpacity>
               );
       })}
       if(this.state.fileArr[this.state.fileArr.length-1]['fileSource']){
               this.state.fileArr.push({});
           }
       return imageViews;
   }

   renderSelectView(){
       return(<View style={{alignItems:'center',padding:10,backgroundColor:'#f2f2f2', width: width,  height: 56}}>

               <TouchableOpacity onPress={() => this._selectM.onPickClick()} style={{
                     borderWidth:0.5,
                     alignItems:'center',
                     borderColor : '#f77935',
                     backgroundColor : 'white',
                     borderRadius : 4,
                     flexDirection:'row',
                     flex: 1,
                     paddingLeft:10,
                     paddingRight:10,
                     paddingTop:8,
                     paddingBottom:8}}>

                   <MemberSelectView
                   ref={(c) => this._selectM = c}
                    style={{color:'#f77935',fontSize:14,flex:1}}
                    title={this.state.witnessNotOkResultType}
                    data={this.state.witnessNotOkResultTypes}
                    pickerTitle={'不合格原因类型'}
                    onSelected={(data) => this.onSelectedType(data)}/>

                   <Image style={{width:20,height:20,}} source={require('../../images/unfold.png')}/>

               </TouchableOpacity>

           </View>)
   }

   onSelectedType(data){
       this.setState({witnessNotOkResultType: data[0]})
   }


   getNoticeType(noticePoint){
       if (noticePoint == 'CZEC_QA') {
           return 'CZEC QA'
       }
       if (noticePoint == 'CZEC_QC') {
           return 'CZEC QC'
       }

       return noticePoint

   }





    renderItem() {
               // 数组
               var itemAry = [];
               // 颜色数组
               var date = this.state.choose_date
               if (!date) {
                   date = '选择见证时间'
               }

               var address = this.state.choose_address
               if (!address) {
                   address = '选择见证地点'
               }

               var result = this.state.choose_result
               if (!result) {
                   result = '选择见证结果'
               }

               var displayAry = [{title:'见证时间',id:'choose_date',content:date,type:'date'},
                 {title:'见证地点',id:'choose_address',content:address,data:this.state.witnessAddresses,type:'choose'},
                 {title:'见证结果',id:'choose_result',content:result,data:this.state.witness_resules,type:'choose'},

                 {title:'简要描述',id:'input_witnessdesc',content:this.state.input_witnessdesc,type:'input'},
                 {type:'devider'},

           ];



                if (this.state.choose_result == '不合格') {
                 displayAry.push({title:'不合格绘制',id:'not_ok',type:'not_ok'});
                }


               // 遍历
               for (var i = 0; i<displayAry.length; i++) {
                   if (displayAry[i].type == 'input') {
                        var keyValue = displayAry[i].id;
                       itemAry.push(
                           <EditItemView key={displayAry[i].id}
                            topic={displayAry[i].title}
                            content={displayAry[i].content}
                            onChangeText={this.onChangeText.bind(this,keyValue)}
                           />
                       );
                   } else if (displayAry[i].type == 'devider') {
                       itemAry.push(
                          <View style={styles.divider}/>
                       );
                   }else if (displayAry[i].type == 'choose') {
                       itemAry.push(
                          this.chooseItemInfo(displayAry[i].id,displayAry[i].title,displayAry[i].content,displayAry[i].data,'member')
                       );
                   }else if (displayAry[i].type == 'not_ok') {
                       itemAry.push(
                          this.notOKView()
                       );
                   }else if (displayAry[i].type == 'date') {
                       itemAry.push(
                          this.chooseItemInfo(displayAry[i].id,displayAry[i].title,displayAry[i].content,displayAry[i].data,'date')
                       );
                   }else{
                       itemAry.push(
                           <DisplayItemView key={displayAry[i].id}
                            title={displayAry[i].title}
                            detail={displayAry[i].content}
                           />
                       );
                   }

               }
               return itemAry;
           }


}


const styles = StyleSheet.create({
    container: {
        flex:1,
        width:width,
        height:height,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    divider: {
    backgroundColor: '#f2f2f2',
    width: width,
    height: 10,
},
    mainStyle: {
        width: width,
        flex:1,
    },
    item: {
    width: width,
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
    height:50,
    justifyContent: 'center',
    alignItems: 'center',
},

    centerLayout:{
      justifyContent:'center',
      alignItems:'center',
    },
    itemLayout:{
        backgroundColor:'#ffffff',
        justifyContent:'center',
        width:width,
        height:50,
        alignItems:'center',
    },


    defaultText:{
            color: '#000000',
            fontSize:16,
            justifyContent: "center",
            alignItems: 'center',
    },
       statisticsflexContainer: {
                height: 60,
                backgroundColor: '#ffffff',
                flexDirection: 'row',
            },

      cell: {
          flex: 1,
          height: 60,
          justifyContent: "center",
          alignItems: 'center',
           flexDirection: 'column',
      },

      cellLine: {
          width: 2,
          height: 14,
          backgroundColor: '#cccccc',
      },

});
