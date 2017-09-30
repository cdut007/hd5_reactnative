import { AsyncStorage } from 'react-native';

const apiDomainAddr = 'http://39.108.165.171' //'http://192.168.99.36:8080/easycms-website'//
const apiAddr =  apiDomainAddr + '/hdxt/api'
var httpToken = ''
var Global = require('../common/globals');

module.exports = {
 getDomain(){
     return apiDomainAddr
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

    console.log('Get requesr:' + url)
    fetch(url, {
        method: 'GET',})
      .then((response) => response.text())
      .then((responseText) => {
        console.log("get request response:"+responseText);
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

    }


    var url = apiAddr + apiName +"?loginId="+logind

    var param = ""

    for(var element in body){
        param += element + "=" + body[element] + "&";
    }

    url =  url+'&'+param;

     try {
         console.log('Post requesr:' + url +":[param body]="+JSON.stringify(body))
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
            var response = JSON.parse(responseText);
            if (response.code == 1000) {
                successCallback(response,param);
            }else{
                if (response.message) {
                    failCallback(response.message)
                        console.log('Post requesr error:' + url +":response.message="+response.message)
                }else{

                    failCallback(response.responseText)
                }
            }

          })
          .catch(function(err){
            failCallback(err);
          });
    }else{
        fetch(url, {
            method: 'POST',})
          .then((response) => response.text())
          .then((responseText) => {
            console.log(responseText);
            var response = JSON.parse(responseText);
            if (response.code == 1000) {
                successCallback(response,body);
            }else{
                if (response.message) {
                    failCallback(response.message)
                        console.log('Post requesr error:' + url +":response.message="+response.message)
                }else{

                    failCallback(response.responseText)
                }
            }

          })
          .catch(function(err){
            failCallback(err);
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
        console.log('Post requesr:' + url +":[param body]="+JSON.stringify(formData))
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
            var response = JSON.parse(responseText);
            if (response.code == 1000) {
                successCallback(response,formData);
            }else{
                if (response.message) {
                    failCallback(response.message)
                        console.log('Post requesr error:' + url +":response.message="+response.message)
                }else{

                    failCallback(response.responseText)
                }
            }

          })
          .catch(function(err){
            console.log("uploadInfo- error---->:"+err);
            failCallback(err);
          });
}
}
