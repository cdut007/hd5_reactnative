import { AsyncStorage } from 'react-native';
import Xlog from 'react-native-xlog';

  var apiDomainAddr = 'http://116.236.114.61:9201' // old  k项

//var apiDomainAddr = 'http://125.77.122.66:9201' // 福清

// var apiDomainAddr = 'http://39.108.165.171:8080' //
var apiAddr =  apiDomainAddr + '/hdxt/api'
var httpToken = ''
var Global = require('../common/globals');

String.prototype.startWith=function(str){
  var reg=new RegExp("^"+str);
  return reg.test(this);
}

module.exports = {
 getDomain(){
     return apiDomainAddr
 },
 initDomain(){

      AsyncStorage.getItem('k_domain_info',function(errs,result)
      {
          console.log(' init k_domain_info:' + result)
          if (!errs && result && result.length)
          {
              var resultJSon = JSON.parse(result);
              apiDomainAddr = resultJSon.domain ;
              apiAddr =  apiDomainAddr + '/hdxt/api' ;
          }
          else
          {

          }

          //apiAddr =  'http://192.168.99.36:8080' + '/hdxt/api' ;
      });

 },
 setDomain(domain,env){
      apiDomainAddr = domain ;
      apiAddr =  apiDomainAddr + '/hdxt/api' ;
      var domainInfo = new Object()
      domainInfo.env = env
      domainInfo.domain = domain
      AsyncStorage.setItem('k_domain_info', JSON.stringify(domainInfo), (error, result) => {
          if (error) {
              console.log('save k_domain_info faild.')
          }
          console.log('k_domain_info: ' + result)

      });

 }, isTestDel(){
     if (Global.isTestDel){
         return true;
     }else {
         return false;
     }


    },
    testGet(apiName, body,successCallback, failCallback)
    {
        // if(!httpToken.length)
        // {
        //     httpToken = Global.token;
        //
        //     AsyncStorage.getItem('k_http_token',function(errs,result)
        //     {
        //         if (!errs)
        //         {
        //             httpToken = result
        //             console.log('httpToken = '+httpToken)
        //         }
        //         else
        //         {
        //             console.log('get http token error:' + errs)
        //         }
        //     });
        //
        //
        //
        // }else{
        //
        // }

        var url = 'http://111.231.52.72/hdxt/api' + apiName
        var param = ""
        //body.loginId=256
        if (Global.UserInfo)
        {
            body.loginId = 596
        }


        for(var element in body){
            param += element + "=" + body[element] + "&";
        }

        url =  url+"?"+param;

        console.log('Get request:' + url)
        Xlog.info('HttpRequestGet', url);
        fetch(url, {
            method: 'GET',})
            .then((response) => response.text())
            .then((responseText) => {
                console.log("get request response:"+responseText);
                Xlog.info('HttpRequestGetReuslt', responseText);
                if (Global.testerDebug) {
                    Global.showAlert(url+""+responseText)
                }
                var response = JSON.parse(responseText);
                if (response.code == 1000) {
                    successCallback(response,body);
                }else{
                    if (response.message) {
                        failCallback(response.message)
                    }else{
                        failCallback(response.responseText)
                    }

                }

            })
            .catch(function(err){
                failCallback(err);
                Xlog.info('HttpRequestGetReusltErr', ""+err);
                if (Global.testerDebug) {
                    Global.showAlert(url+"Error:"+err)
                }
                if (err == 'TypeError: Network request failed') {
                    Global.showToast('网络异常')
                }

            });

    },
    testPost(apiName, body,successCallback, failCallback)
{
    // if(!httpToken.length)
    // {
    //     httpToken = Global.token;

    //     AsyncStorage.getItem('k_http_token',function(errs,result)
    //     {
    //         if (!errs)
    //         {
    //             httpToken = result
    //             console.log('httpToken = '+httpToken)
    //         }
    //         else
    //         {
    //             console.log('get http token error:' + errs)
    //         }
    //     });
    // }

    var logind = '';
    if (Global.UserInfo)
    {
        logind = 596;

    }else {
        // logind = 620;
    }


    var url = 'http://111.231.52.72/hdxt/api' + apiName +"?loginId="+logind

    var param = ""

    for(var element in body){
        param += element + "=" + body[element] + "&";
    }


    url =  url+'&'+param;

    try {
        var tagInfo = 'Post request:' + url +":[param body]="+JSON.stringify(body)
        console.log(tagInfo)
        Xlog.info('HttpRequestPost', tagInfo);
    } catch (e) {

    } finally {

    }

    if (body.jsonBody) {
        fetch(url, {
            method: 'POST',
            headers: new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': httpToken
            }),
            body: JSON.stringify(body.jsonBody)})
            .then((response) => response.text())
            .then((responseText) => {
                console.log(responseText);
                Xlog.info('HttpRequestPostReuslt', responseText);
                if (Global.testerDebug) {
                    Global.showAlert(url+"PostResult:"+responseText)
                }

                var response = JSON.parse(responseText);
                if (response.code == 1000) {
                    successCallback(response,param);
                }else{
                    if (response.message) {
                        failCallback(response.message)
                        console.log('Post request error:' + url +":response.message="+response.message)
                    }else{

                        failCallback(response.responseText)
                    }
                }

            })
            .catch(function(err){
                failCallback(err);
                Xlog.info('HttpRequestPostReusltErr', ""+err);
                if (Global.testerDebug) {
                    Global.showAlert(url+"post Error:"+err)
                }
                if ((""+err).startWith('SyntaxError: JSON Parse error')) {
                    Global.showToast('服务不可用，请稍后再试')
                }
            });
    }else{
        fetch(url, {
            method: 'POST',})
            .then((response) => response.text())
            .then((responseText) => {
                console.log(responseText);
                Xlog.info('HttpRequestPostReuslt', responseText);
                if (Global.testerDebug) {
                    Global.showAlert(url+" post:"+responseText)
                }
                var response = JSON.parse(responseText);
                if (response.code == 1000) {
                    successCallback(response,body);
                }else{
                    if (response.message) {
                        failCallback(response.message)
                        console.log('Post request error:' + url +":response.message="+response.message)
                    }else{

                        failCallback(response.responseText)
                    }
                }

            })
            .catch(function(err){
                Xlog.info('HttpRequestPostReusltErr', ""+err);
                if (Global.testerDebug) {
                    Global.showAlert(url+"post Error:"+responseText)
                }
                failCallback(err);
                if ((""+err).startWith('SyntaxError: JSON Parse error')) {
                    Global.showToast('服务不可用，请稍后再试')
                }
            });
    }

},
get(apiName, body,successCallback, failCallback)
{
    // if(!httpToken.length)
    // {
    //     httpToken = Global.token;
    //
    //     AsyncStorage.getItem('k_http_token',function(errs,result)
    //     {
    //         if (!errs)
    //         {
    //             httpToken = result
    //             console.log('httpToken = '+httpToken)
    //         }
    //         else
    //         {
    //             console.log('get http token error:' + errs)
    //         }
    //     });
    //
    //
    //
    // }else{
    //
    // }

    var url = apiAddr + apiName
    var param = ""
  //body.loginId=256
    if (Global.UserInfo)
    {
        body.loginId = Global.UserInfo.id
    }


    for(var element in body){
        param += element + "=" + body[element] + "&";
    }

    url =  url+"?"+param;

    console.log('Get request:' + url)
     Xlog.info('HttpRequestGet', url);
    fetch(url, {
        method: 'GET',})
      .then((response) => response.text())
      .then((responseText) => {
        console.log("get request response:"+responseText);
         Xlog.info('HttpRequestGetReuslt', responseText);
         if (Global.testerDebug) {
             Global.showAlert(url+""+responseText)
         }
        var response = JSON.parse(responseText);
        if (response.code == 1000) {
            successCallback(response,body);
        }else{
            if (response.message) {
                failCallback(response.message)
            }else{
                failCallback(response.responseText)
            }

        }

      })
      .catch(function(err){
        failCallback(err);
          Xlog.info('HttpRequestGetReusltErr', ""+err);
          if (Global.testerDebug) {
              Global.showAlert(url+"Error:"+err)
          }
          if (err == 'TypeError: Network request failed') {
              Global.showToast('网络异常')
          }

      });

  },
post(apiName, body,successCallback, failCallback)
  {
    // if(!httpToken.length)
    // {
    //     httpToken = Global.token;

    //     AsyncStorage.getItem('k_http_token',function(errs,result)
    //     {
    //         if (!errs)
    //         {
    //             httpToken = result
    //             console.log('httpToken = '+httpToken)
    //         }
    //         else
    //         {
    //             console.log('get http token error:' + errs)
    //         }
    //     });
    // }

    var logind = '';
    if (Global.UserInfo)
    {
        logind = Global.UserInfo.id;

    }else {
        // logind = 620;
    }


    var url = apiAddr + apiName +"?loginId="+logind

    var param = ""

    for(var element in body){
        param += element + "=" + body[element] + "&";
    }


    url =  url+'&'+param;

     try {
         var tagInfo = 'Post request:' + url +":[param body]="+JSON.stringify(body)
         console.log(tagInfo)
         Xlog.info('HttpRequestPost', tagInfo);
     } catch (e) {

     } finally {

     }

if (body.jsonBody) {
        fetch(url, {
            method: 'POST',
                headers: new Headers({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': httpToken
                }),
                body: JSON.stringify(body.jsonBody)})
          .then((response) => response.text())
          .then((responseText) => {
            console.log(responseText);
                 Xlog.info('HttpRequestPostReuslt', responseText);
                 if (Global.testerDebug) {
                     Global.showAlert(url+"PostResult:"+responseText)
                 }

            var response = JSON.parse(responseText);
            if (response.code == 1000) {
                successCallback(response,param);
            }else{
                if (response.message) {
                    failCallback(response.message)
                        console.log('Post request error:' + url +":response.message="+response.message)
                }else{

                    failCallback(response.responseText)
                }
            }

          })
          .catch(function(err){
            failCallback(err);
              Xlog.info('HttpRequestPostReusltErr', ""+err);
              if (Global.testerDebug) {
                  Global.showAlert(url+"post Error:"+err)
              }
              if ((""+err).startWith('SyntaxError: JSON Parse error')) {
                  Global.showToast('服务不可用，请稍后再试')
              }
          });
    }else{
        fetch(url, {
            method: 'POST',})
          .then((response) => response.text())
          .then((responseText) => {
            console.log(responseText);
                 Xlog.info('HttpRequestPostReuslt', responseText);
                 if (Global.testerDebug) {
                     Global.showAlert(url+" post:"+responseText)
                 }
            var response = JSON.parse(responseText);
            if (response.code == 1000) {
                successCallback(response,body);
            }else{
                if (response.message) {
                    failCallback(response.message)
                        console.log('Post request error:' + url +":response.message="+response.message)
                }else{

                    failCallback(response.responseText)
                }
            }

          })
          .catch(function(err){
                   Xlog.info('HttpRequestPostReusltErr', ""+err);
                   if (Global.testerDebug) {
                       Global.showAlert(url+"post Error:"+responseText)
                   }
            failCallback(err);
            if ((""+err).startWith('SyntaxError: JSON Parse error')) {
                Global.showToast('服务不可用，请稍后再试')
            }
          });
    }

  },

  uploadImage(apiName ,formData,successCallback, failCallback ) {
    var logind = '';
    if (Global.UserInfo)
    {
        logind = Global.UserInfo.id;

    }


    var url = apiAddr + apiName +"?loginId="+logind

    try {
        console.log('Post request:' + url +":[param body]="+JSON.stringify(formData))
    } catch (e) {

    } finally {

    }

    fetch(url,{
        method:'POST',
        headers:{
            'Content-Type':'multipart/form-data',
        },
        body:formData,
    })
       .then((response) => response.text())
          .then((responseText) => {
            console.log("uploadInfo---->:"+responseText);
            if (Global.testerDebug) {
                Global.showAlert(url+ "upload:"+responseText)
            }
            var response = JSON.parse(responseText);
            if (response.code == 1000) {
                successCallback(response,formData);
            }else{
                if (response.message) {
                    failCallback(response.message)
                        console.log('Post request error:' + url +":response.message="+response.message)
                }else{

                    failCallback(response.responseText)
                }
            }

          })
          .catch(function(err){
            console.log("uploadInfo- error---->:"+err);
              Xlog.info('HttpRequestPostReusltErrUpload', ""+err);
              if (Global.testerDebug) {
                  Global.showAlert(url+ "upload Error:"+err)
              }
            failCallback(err);
            if ((""+err).startWith('SyntaxError: JSON Parse error')) {
                Global.showToast('服务不可用，请稍后再试')
            }
          });
},
  printError(error){
    try {
      var errorInfo = JSON.parse(error);
      if (errorInfo != null) {
        Global.log(errorInfo)
      } else {
        Global.log(error)
      }
    }
    catch(error)
    {
      Global.log(error)
    }
    Global.log('Network error:' + error)
  }
}
