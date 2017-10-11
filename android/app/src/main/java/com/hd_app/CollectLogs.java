/**
 * Copyright (C) 2010-2012 Regis Montoya (aka r3gis - www.r3gis.fr)
 * This file is part of CSipSimple.
 *
 *  CSipSimple is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *  If you own a pjsip commercial license you can also redistribute it
 *  and/or modify it under the terms of the GNU Lesser General Public License
 *  as an android library.
 *
 *  CSipSimple is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with CSipSimple.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.hd_app;
import android.util.Log;
import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.text.SimpleDateFormat;
import java.util.Date;




import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.PackageManager.NameNotFoundException;
import android.net.Uri;
import android.preference.PreferenceManager;
import android.text.format.DateUtils;

public class CollectLogs {

	private static final Object LINE_SEPARATOR = "\n";
	private static final String THIS_FILE = "Collect Logs";

	private static class LogResult {
		public StringBuilder head;
		public File file;

		public LogResult(StringBuilder aHead, File aFile) {
			head = aHead;
			file = aFile;
		}
	};


	protected final static LogResult getLogs(Context ctxt) {
		//Clear old files
		File file = new File(StorageUtils.getLogFile(ctxt));
		File parent = file.getParentFile();
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
						  Date dateAgo = new Date(System.currentTimeMillis());
						  String timeStr = df.format(dateAgo);
		String dest = parent.getAbsolutePath()+File.separator+timeStr+"logs.zip";
		try {
			FileUtils.zipFolder(StorageUtils.getLogFile(ctxt),dest, false);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	/*	StorageUtils.cleanLogsFiles(ctxt);

        final StringBuilder log = new StringBuilder();
        File outFile = null;
        try{
        	ArrayList<String> commandLine = new ArrayList<String>();
            commandLine.add("logcat");

            outFile = StorageUtils.getLogsFile(ctxt);
        	if( outFile != null) {
    			commandLine.add("-f");
    			commandLine.add(outFile.getAbsolutePath());
        	}

            commandLine.add("-d");
            commandLine.add("D");

            Process process = Runtime.getRuntime().exec(commandLine.toArray(new String[0]));
            BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(process.getInputStream()));

            String line ;
            while ((line = bufferedReader.readLine()) != null){
                log.append(line);
                log.append(LINE_SEPARATOR);
            }

        }
        catch (IOException e){
            Log.e(THIS_FILE, "Collect logs failed : "+e.getLocalizedMessage());//$NON-NLS-1$
            log.append("Unable to get logs : " + e.toString());
        }
*/
        return new LogResult(new StringBuilder(), new File(dest));
	}

	protected final static StringBuilder getDeviceInfo() {
		final StringBuilder log = new StringBuilder();

		log.append( "设备信息 : ");
        log.append(LINE_SEPARATOR);
        log.append("android.os.Build.BOARD : " + android.os.Build.BOARD );
        log.append(LINE_SEPARATOR);
		log.append("android.os.Build.BRAND : " + android.os.Build.BRAND );
        log.append(LINE_SEPARATOR);
		log.append("android.os.Build.DEVICE : " + android.os.Build.DEVICE );
        log.append(LINE_SEPARATOR);
		log.append("android.os.Build.ID : " + android.os.Build.ID );
        log.append(LINE_SEPARATOR);
		log.append("android.os.Build.MODEL : " + android.os.Build.MODEL );
        log.append(LINE_SEPARATOR);
		log.append("android.os.Build.PRODUCT : " + android.os.Build.PRODUCT );
        log.append(LINE_SEPARATOR);
		log.append("android.os.Build.TAGS : " + android.os.Build.TAGS );
        log.append(LINE_SEPARATOR);
        log.append("android.os.Build.CPU_ABI : " + android.os.Build.CPU_ABI );
        log.append(LINE_SEPARATOR);
		log.append("android.os.Build.VERSION.INCREMENTAL : " + android.os.Build.VERSION.INCREMENTAL );
        log.append(LINE_SEPARATOR);
		log.append("android.os.Build.VERSION.RELEASE : " + android.os.Build.VERSION.RELEASE );
        log.append(LINE_SEPARATOR);
		log.append("android.os.Build.VERSION.SDK_INT : " + android.os.Build.VERSION.SDK_INT );
        log.append(LINE_SEPARATOR);

		return log;
	}

	protected final static String getApplicationInfo(Context ctx) {
		String result = "";
		PackageManager pm = ctx.getPackageManager();
        result += "Based on ";
        result += ctx.getApplicationInfo().loadLabel(pm);
        result += " version : ";

		PackageInfo pinfo =getCurrentPackageInfos(ctx);
		if(pinfo != null) {
			result += pinfo.versionName + " r" + pinfo.versionCode;
		}
		return result;
	}

	protected final static PackageInfo getCurrentPackageInfos(Context ctx) {
        PackageInfo pinfo = null;
        try {
            pinfo = ctx.getPackageManager().getPackageInfo(ctx.getPackageName(), 0);
        } catch (NameNotFoundException e) {
            Log.e(THIS_FILE, "Impossible to find version of current package !!");
        }
        return pinfo;
    }

	protected static Intent getLogReportIntent(String userComment, Context ctx) {


		LogResult logs = getLogs(ctx);


		Intent sendIntent = new Intent(Intent.ACTION_SEND);

        sendIntent.putExtra(Intent.EXTRA_SUBJECT, "日志报告");

        sendIntent.putExtra(Intent.EXTRA_EMAIL, new String[] {"316458704@qq.com"});



        StringBuilder log = new StringBuilder();
        log.append(userComment);
        log.append(LINE_SEPARATOR);
        log.append(LINE_SEPARATOR);
        log.append(getApplicationInfo(ctx));
        log.append(LINE_SEPARATOR);
        log.append(getDeviceInfo());
        log.append(LINE_SEPARATOR);
        log.append(logs.head);


        if(logs.file != null) {
        	sendIntent.putExtra( Intent.EXTRA_STREAM, Uri.fromFile(logs.file) );

        }


        log.append(LINE_SEPARATOR);
        log.append(LINE_SEPARATOR);
        log.append(userComment);

        sendIntent.setType("plain/text");

        sendIntent.putExtra(Intent.EXTRA_TEXT, log.toString());

        return sendIntent;
	}




}
