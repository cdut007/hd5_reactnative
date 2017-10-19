package com.hd_app;

import android.app.Application;
import android.os.Environment;

import com.beefe.picker.PickerViewPackage;
import com.engsshi.xlog.XLogModule;
import com.engsshi.xlog.XLogPackage;
import com.engsshi.xlog.XLogSetting;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.hd_app.log.LogReactPackage;
import com.imagepicker.ImagePickerPackage;
import com.reactlibrary.RNCardViewPackage;
import com.tencent.bugly.Bugly;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new XLogPackage(),
                    new PickerViewPackage(),
                    new ImagePickerPackage(),
                    new RNCardViewPackage(),
                    new LogReactPackage()
                    );
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
        Bugly.init(getApplicationContext(), "8627b7cc8e", false);
        final String appName = this.getString(R.string.app_name);
        final String logPath = Environment.getExternalStorageDirectory().getAbsolutePath() + "/" + appName + "/log";

        XLogSetting xLogSetting = XLogSetting.builder()
                .setLevel(XLogSetting.LEVEL_DEBUG)
                .setPath(logPath)
                .setCacheDir("")
                .setAppenderMode(XLogSetting.APPENDER_MODE_ASYNC)
                .setNamePrefix(appName)
                .setOpenConsoleLog(true)
                .build();
        //XLogModule.init(xLogSetting)
        XLogModule.initWithNativeCrashInclude(xLogSetting, this);
        XLogModule.open(); //optional, for this, you can log before into RNView

        // TODO Auto-generated method stub


    }
}
