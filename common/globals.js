'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {

  ToastAndroid,
  Platform
} = ReactNative;

import Toast from 'react-native-root-toast';

import JPushModule from 'jpush-react-native';

var currentRole;
var UserInfo;

var testerDebug = false



Date.prototype.format = function(fmt)
{ //author: meizz
    var o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
};

module.exports = {
    BASE_URL:'http://ucstage.sealedchat.com:8008/api',
    STAGING_BASE_URL:'http://ucstage.sealedchat.com:8008/api',
    ICON_URL:'http://ucstage.sealedchat.com:8008/api',
    formatDate(time){
        if (!time) {
            return ''
        }
        var curTime = new Date(time).format("yyyy/MM/dd");
        return curTime
    },
    formatFullDate(time){
        if (!time) {
            return ''
        }
        var curTime = new Date(time).format("yyyy-MM-dd hh:mm:ss");
        return curTime
    },
    formatFullDateWithChina(time){
        if (!time) {
            return ''
        }
        console.log('time=='+time);
        //东8区，东时区记做正数
        var zoneOffset = 8;
        //算出时差,并转换为毫秒：
        var date = new Date()
        var offset2 = date.getTimezoneOffset()* 60 * 1000;
        //算出现在的时间：
        var nowDate2 = time;
        //此时东2区的时间
        var currentZoneDate = new Date(nowDate2 + offset2 + zoneOffset*60*60*1000);

        console.log("东8区现在是："+currentZoneDate.getTime());
        console.log('当地时间是：'+nowDate2);
        var curTime = new Date(currentZoneDate.getTime()).format("yyyy-MM-dd hh:mm:ss");
        return curTime
    },

    formatDateWithChina(time){
        if (!time) {
            return ''
        }
        //东8区，东时区记做正数
        var zoneOffset = 8;
        //算出时差,并转换为毫秒：
        var date = new Date()
        var offset2 = date.getTimezoneOffset()* 60 * 1000;
        //算出现在的时间：
        var nowDate2 = time;
        //此时东2区的时间
        var currentZoneDate = new Date(nowDate2 + offset2 + zoneOffset*60*60*1000);

        console.log("东8区现在是："+currentZoneDate.getTime());
        console.log('当地时间是：'+nowDate2);

      return currentZoneDate.getTime();

        // var curTime = new Date(currentZoneDate.getTime()).format("yyyy-MM-dd hh:mm:ss");
        // return curTime
    },


    formatFullDateDisplay(time){
        if (!time) {
            return ''
        }
        var curTime = new Date(time).format("yyyy-MM-dd hh:mm");
        return curTime
    },
    existRole(user,roleName){

            for (var i = 0; i < user.roles.length; i++) {

                if (user.roles[i].roleType[0] == roleName) {
                    return true;
                }
            }

        return false;
    },
    existRoleName(user){
        if (!user || !user.roles ) {
            console.log('maybe crash recycle from the memery cache, can read data again ??')
            return false
        }
            for (var i = 0; i < user.roles.length; i++) {

                if (user.roles[i].roleType[0]) {
                    return true;
                }
            }

        return false;
    },
    isMonitor(user){
        if (!user || !user.roles ) {
            console.log('maybe crash recycle from the memery cache, can read data again ??')
            return false
        }

        return this.existRole(user, 'monitor');
    },
    isCaptain(user){
        if (!user || !user.roles) {
            console.log('maybe crash recycle from the memery cache, can read data again ??')
            return false
        }

        return this.existRole(user, 'captain');
    },isGroup(user){
        if (!user || !user.roles) {
            console.log('maybe crash recycle from the memery cache, can read data again ??')
            return false
        }

        return this.existRole(user, 'team');
    },isQCTeam(user){
        if (!user || !user.roles) {
            console.log('maybe crash recycle from the memery cache, can read data again ??')
            return false
        }

        return this.existRole(user, 'witness_team_qc1');
    },isQC2Team(user){
        if (!user || !user.roles) {
            console.log('maybe crash recycle from the memery cache, can read data again ??')
            return false
        }

        return this.existRole(user, 'witness_team_qc2');
    },isQC1Member(user){
        if (!user || !user.roles) {
            console.log('maybe crash recycle from the memery cache, can read data again ??')
            return false
        }

        return this.existRole(user, 'witness_member_qc1');
    },isQC2Member(user){
        if (!user || !user.roles) {
            console.log('maybe crash recycle from the memery cache, can read data again ??')
            return false
        }

        return this.existRole(user, 'witness_member_qc2');
    },isQC2SubMember(user){
        if (!user || !user.roles) {
            console.log('maybe crash recycle from the memery cache, can read data again ??')
            return false
        }

        return this.existRole(user, 'witness_member_czecqc') || this.existRole(user,'witness_member_paec') || this.existRole(user,'witness_member_czecqa');
    },isSolverMember(user){
        if (!user || !user.roles) {
            console.log('maybe crash recycle from the memery cache, can read data again ??')
            return false
        }

        return this.existRole(user, 'solver');
    },isSolverLeader(user){
        if (!user || !user.roles) {
            console.log('maybe crash recycle from the memery cache, can read data again ??')
            return false
        }

        return this.existRole(user, 'supervisor');
    },isCoordinator(user){
        if (!user || !user.roles) {
            console.log('maybe crash recycle from the memery cache, can read data again ??')
            return false
        }

        return this.existRole(user, 'coordinator');
    },
    isQCManager(user){
        if (!user || !user.roles) {
            console.log('maybe crash recycle from the memery cache, can read data again ??')
            return false
        }

        return this.existRole(user, 'QCManager');
    },
    isQC1(user){
        if (!user || !user.roles) {
            console.log('maybe crash recycle from the memery cache, can read data again ??')
            return false
        }

        return this.existRole(user, 'witness_team_qc1') || this.existRole(user, 'witness_team_qc2') || this.existRole(user, 'witness_member_qc1') || this.existRole(user, 'witness_member_qc2')|| this.existRole(user, 'qc_member');
    },
    isHSE(user){
        if (!user || !user.roles) {
            console.log('maybe crash recycle from the memery cache, can read data again ??')
            return false
        }

      var roleType = user.department ? user.department.name : user.department;

      return roleType == 'HSE部';

        // return this.existRole(user, 'HSE部');
    },
    isKeeper(user){
        if (!user || !user.roles) {
            console.log('maybe crash recycle from the memery cache, can read data again ??')
            return false
        }

        return this.existRole(user, 'keeper');
    },
    alert(content){
        if (Platform.OS === 'ios'){
            // Add a Toast on screen.
        let toast = Toast.show(content, {
            duration: Toast.durations.LONG,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
            onShow: () => {
                // calls on toast\`s appear animation start
            },
            onShown: () => {
                // calls on toast\`s appear animation end.
            },
            onHide: () => {
                // calls on toast\`s hide animation start.
            },
            onHidden: () => {
                // calls on toast\`s hide animation end.
            }
        });
    }else{
         ToastAndroid.show(content+'', ToastAndroid.SHORT)
    }

    },
    showToast(content){
         if (Platform.OS === 'ios'){
             // Add a Toast on screen.
         let toast = Toast.show(content, {
             duration: Toast.durations.LONG,
             position: Toast.positions.BOTTOM,
             shadow: true,
             animation: true,
             hideOnPress: true,
             delay: 0,
             onShow: () => {
                 // calls on toast\`s appear animation start
             },
             onShown: () => {
                 // calls on toast\`s appear animation end.
             },
             onHide: () => {
                 // calls on toast\`s hide animation start.
             },
             onHidden: () => {
                 // calls on toast\`s hide animation end.
             }
         });
     }else{
          ToastAndroid.show(content+'', ToastAndroid.SHORT)
     }

    },
    clearCache(){
    UserInfo=null;
    },
    getWitnesstatus(status){
        if (status == 'UNASSIGNED') {
            return '待指派'
        }else if (status == 'COMPLETED') {
            return '已完成'
        }else if (status == 'UNCOMPLETED') {
            return '未完成'
        }else if (status == 'PROGRESSING') {
            return '未完成'
        }else if (status == 'UNPROGRESSING') {
            return '未开始'
        }else {
            return status
        }
    },
    log(info){
            console.log('[hd5] '+info)
    },
    getAlartTime(alertTimeArry,time){
        for (var i = 0; i < alertTimeArry.length; i++) {
             if (alertTimeArry[i].value == time) {
                 return alertTimeArry[i].key
             }
        }
        return 'NONE'
    },
    getAlartTimeByKey(alertTimeArry,time){
        if (!alertTimeArry) {
            return ''
        }
        for (var i = 0; i < alertTimeArry.length; i++) {
             if (alertTimeArry[i].key == time) {
                 return alertTimeArry[i].value
             }
        }
        return '不提醒'
    },
    registerPush(alias){


      if (Platform.OS === 'android') {

        JPushModule.resumePush();
        JPushModule.setAlias(alias, (map) => {
                if (map.errorCode === 0) {
                    this.log("set alias succeed==="+alias);
                } else {
                    this.log("set alias failed, errorCode: " + map.errorCode);
                    if (map.errorCode == 6002) {
                        this.registerPush(alias)
                        this.log("set alias timeouted register again==="+alias);
                    }
                }
            });
      }


  },

      getFileName(path){
          var pos = path.lastIndexOf('/');
          if( pos<0 )
          return path;
          else
          return path.substring(pos+1);
      }
      ,

      getFileExtension(fileName){
          var pos = fileName.lastIndexOf('.');
          if( pos<0 )
          return '';
          else
          return fileName.substring(pos+1);
      }
      ,


      checkImgType(value){
      if (value == "") {

          return false;
      } else {
          if (!/(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(value)) {

              return false;
          }
      }
      return true;
  }  ,
  showAlert(content){
      alert(''+content)
  }


};
