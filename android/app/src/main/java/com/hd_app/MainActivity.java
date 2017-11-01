package com.hd_app;
import android.content.pm.PackageManager;
import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;

import javax.annotation.Nullable;


import cn.jpush.android.api.JPushInterface;


public class MainActivity extends ReactActivity {

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new ReactActivityDelegate(this,getMainComponentName()){
            @Nullable
            @Override
            protected Bundle getLaunchOptions() {
                Bundle initialProperties = new Bundle();
                String version = "";
                try {
                    version =  getPackageManager().getPackageInfo(getPackageName(),0).versionName;
                } catch (PackageManager.NameNotFoundException e) {
                    e.printStackTrace();
                }
                initialProperties.putString("version",version);
                return initialProperties;
            }
        };
    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "hd_app";
    }


        @Override
        protected void onCreate(Bundle savedInstanceState) {
        // TODO Auto-generated method stub
        super.onCreate(savedInstanceState);
         // JPushInterface.setDebugMode(true); 	// 设置开启日志,发布时请关闭日志
        JPushInterface.init(this);
            //LogUtils.sendLog(this);
        }

        @Override
protected void onPause() {
    super.onPause();
    JPushInterface.onPause(this);
}

@Override
protected void onResume() {
    super.onResume();
    JPushInterface.onResume(this);
}

}
