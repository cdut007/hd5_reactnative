package com.hd_app;

import java.io.File;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;
 import android.util.Log; 

import android.app.Activity;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.LabeledIntent;
import android.content.pm.PackageManager;
import android.content.pm.PackageManager.NameNotFoundException;
import android.content.pm.ResolveInfo;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.os.Parcelable;
import android.preference.PreferenceManager;


public class LogUtils {

	private final static String TAG = "LogUtils";

	public static void sendLog(Activity context) {

		try {

			context.startActivity(CollectLogs.getLogReportIntent("<<<请添加bug问题描述>>>", context));

		} catch (Exception e) {

			Log.e(TAG, "Impossible to send logs..."+ e.getLocalizedMessage());
		}


	}



	public static String getSupportEmail(SharedPreferences preferences) {
		return preferences.getString("SUPPORT_MAIL", "");
	}
	public static void  setSupportEmail(String supportMail,SharedPreferences preferences) {

		 preferences.edit().putString("SUPPORT_MAIL", supportMail).commit();

	}


 public static void  sendFeedback2(Context context){

	String versionName="";

	try {

		versionName=context.getPackageManager().getPackageInfo(context.getPackageName(), 0).versionName;


	} catch (NameNotFoundException e) {

		e.printStackTrace();
	}

	StringBuffer sb=new StringBuffer();
    sb.append("We would like to hear your feedback and improvement ideas. Please feel free to share below :").append("\r\n").append("\r\n").append("\r\n")
    .append("Attach Screenshots (if any) : ").append("\r\n").append("\r\n").append("\r\n")
	.append("Running on ").append(android.os.Build.MODEL).append("\r\n")
	.append("OS Version : ").append(android.os.Build.VERSION.RELEASE).append("\r\n")
	.append("Client Version : ").append(versionName);

	 Intent emailIntent = new Intent(Intent.ACTION_SENDTO, Uri.fromParts("mailto","messageplus_feedback@starhub.com", null));
     emailIntent.putExtra(Intent.EXTRA_SUBJECT, "Message+ - Feedback");
     emailIntent.putExtra(Intent.EXTRA_TEXT, sb.toString());
     context.startActivity(Intent.createChooser(emailIntent, "Choose email client"));

}
 public static void sendFeedback(Context context, String to, String subject, String body) {
	    StringBuilder builder = new StringBuilder("mailto:" + Uri.encode(to));
	    if (subject != null) {
	        builder.append("?subject=" + Uri.encode(Uri.encode(subject)));
	        if (body != null) {
	            builder.append("&body=" + Uri.encode(Uri.encode(body)));
	        }
	    }
	    String uri = builder.toString();
	    Intent intent = new Intent(Intent.ACTION_SENDTO, Uri.parse(uri));
	    context.startActivity(intent);
	}
	public static void removeDuplicateWithOrder(List<ResolveInfo> list) {

		if (list == null) {

			return;

		}

		Set<String> set = new HashSet<String>();

		List<ResolveInfo> newList = new ArrayList<ResolveInfo>();

		for (Iterator<ResolveInfo> iter = list.iterator(); iter.hasNext();) {

			ResolveInfo info = (ResolveInfo) iter.next();

			if (set.add(info.activityInfo.packageName)) {

				newList.add(info);

			}
		}

		list.clear();

		list.addAll(newList);

	}

}
