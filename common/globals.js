
import Toast from 'react-native-root-toast';

var currentRole;
var UserInfo;



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
        var curTime = new Date(time).format("yyyy/MM/dd");
        return curTime
    },
    formatFullDate(time){
        var curTime = new Date(time).format("yyyy-MM-dd hh:mm:ss");
        return curTime
    },
    formatFullDateDisplay(time){
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
    },
    showToast(content){
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
        }else {
            return status
        }
    },


};
