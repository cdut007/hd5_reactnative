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
    formatFullDateDisplay(time){
        if (!time) {
            return ''
        }
        var curTime = new Date(time).format("yyyy-MM-dd hh:mm");
        return curTime
    },
    isMonitor(user){
        if (!user) {
            console.log('maybe crash recycle from the memery cache, can read data again ??')
            return false
        }
        var roleType = user.roles[0].roleType[0]
        return roleType == 'monitor'
    },
    isCaptain(user){
        if (!user) {
            console.log('maybe crash recycle from the memery cache, can read data again ??')
            return false
        }
        var roleType = user.roles[0].roleType[0]
        return roleType == 'captain'
    },isGroup(user){
        if (!user) {
            console.log('maybe crash recycle from the memery cache, can read data again ??')
            return false
        }
        var roleType = user.roles[0].roleType[0]
        return roleType == 'team'
    },isQCTeam(user){
        if (!user) {
            console.log('maybe crash recycle from the memery cache, can read data again ??')
            return false
        }
        var roleType = user.roles[0].roleType[0]
        return roleType == 'witness_team_qc1'
    },isQC2Team(user){
        if (!user) {
            console.log('maybe crash recycle from the memery cache, can read data again ??')
            return false
        }
        var roleType = user.roles[0].roleType[0]
        return roleType == 'witness_team_qc2'
    },isQC1Member(user){
        if (!user) {
            console.log('maybe crash recycle from the memery cache, can read data again ??')
            return false
        }
        var roleType = user.roles[0].roleType[0]
        return roleType == 'witness_member_qc1'
    },isQC2Member(user){
        if (!user) {
            console.log('maybe crash recycle from the memery cache, can read data again ??')
            return false
        }
        var roleType = user.roles[0].roleType[0]
        return roleType == 'witness_member_qc2'
    },isQC2SubMember(user){
        if (!user) {
            console.log('maybe crash recycle from the memery cache, can read data again ??')
            return false
        }
        var roleType = user.roles[0].roleType[0]
        return roleType == 'witness_member_czecqc' || roleType == 'witness_member_paec' || roleType == 'witness_member_czecqa'
    },isSolverMember(user){
        if (!user) {
            console.log('maybe crash recycle from the memery cache, can read data again ??')
            return false
        }
        var roleType = user.roles[0].roleType[0]
        return roleType == 'solver'
    },isSolverLeader(user){
        if (!user) {
            console.log('maybe crash recycle from the memery cache, can read data again ??')
            return false
        }
        var roleType = user.roles[0].roleType[0]
        return roleType == 'supervisor'
    },isCoordinator(user){
        if (!user) {
            console.log('maybe crash recycle from the memery cache, can read data again ??')
            return false
        }
        var roleType = user.roles[0].roleType[0]
        return roleType == 'coordinator'
    },
    isQCManager(user){
        if (!user) {
            console.log('maybe crash recycle from the memery cache, can read data again ??')
            return false
        }
        var roleType = user.roles[0].roleType[0]
        return roleType == 'QCManager'
    },
    isQC1(user){
        if (!user) {
            console.log('maybe crash recycle from the memery cache, can read data again ??')
            return false
        }
        var roleType = user.roles[0].roleType[0]
        return roleType == 'QC1'
    },
    isHSE(user){
        if (!user) {
            console.log('maybe crash recycle from the memery cache, can read data again ??')
            return false
        }
        var roleType = user.department.name;
        return roleType == 'HSE部'
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
