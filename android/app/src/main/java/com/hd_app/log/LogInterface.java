package com.hd_app.log;

import android.net.Uri;

import com.RNFetchBlob.RNFetchBlob;
import com.RNFetchBlob.RNFetchBlobConst;
import com.RNFetchBlob.Utils.PathResolver;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.IllegalViewOperationException;
import com.hd_app.LogUtils;
import com.tencent.bugly.Bugly;
import com.tencent.bugly.beta.Beta;

/**
 * Created by lly on 2017/10/11.
 */

public class LogInterface extends ReactContextBaseJavaModule {

    public LogInterface(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "LogInterface";
    }

    @ReactMethod
    public void checkUpgrade() {
        Beta.checkUpgrade();
    }

    @ReactMethod
    public void sendLogReport() {
        LogUtils.sendLog(getCurrentActivity());
    }


    @ReactMethod
    public void normalizePath(String path, Promise promise) {
        try {
            String pathStr = getPath(path);
            WritableMap map = Arguments.createMap();
            map.putString("path", pathStr);

            promise.resolve(map);
        } catch (IllegalViewOperationException e) {
            promise.reject(e);
        }
    }

      String getPath(String path){
          if(path == null)
              return null;
          if(!path.matches("\\w+\\:.*"))
              return path;
          if(path.startsWith("file://")) {
              return path.replace("file://", "");
          }

          Uri uri = Uri.parse(path);
          if(path.startsWith(RNFetchBlobConst.FILE_PREFIX_BUNDLE_ASSET)) {
              return path;
          }
          else
              return PathResolver.getRealPathFromURI(getCurrentActivity(), uri);
      }






}
