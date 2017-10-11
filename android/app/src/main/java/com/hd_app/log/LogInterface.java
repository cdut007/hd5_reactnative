package com.hd_app.log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.hd_app.LogUtils;

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
    public void sendLogReport() {
        LogUtils.sendLog(getCurrentActivity());
    }
}
