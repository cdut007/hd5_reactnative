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
import com.hd_app.R;
import android.content.ContentResolver;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.SharedPreferences.Editor;

import android.os.Environment;
import android.preference.PreferenceManager;

import android.text.format.DateFormat;



import java.text.SimpleDateFormat;

import java.io.File;
import java.util.Date;



public class StorageUtils {

	private static final String THIS_FILE = "StorageUtils";

	private Context context;

	private final static String LOGS_FOLDER = "PMSlogs";


	public static  String getLogFile(Context context) {
		// TODO Auto-generated method stub
		final String appName = context.getString(R.string.app_name);
		final String logPath = Environment.getExternalStorageDirectory().getAbsolutePath() + "/" + appName + "/log";
		SimpleDateFormat df = new SimpleDateFormat("yyyyMMdd");
						  Date dateAgo = new Date(System.currentTimeMillis());
						  String timeStr = df.format(dateAgo);
	   return  logPath + File.separator + appName + "_"+timeStr+ ".xlog";
	}


	private static File getStorageFolder(Context ctxt, boolean preferCache) {
		File root = Environment.getExternalStorageDirectory();
		if(!root.canWrite() || preferCache) {
			root = ctxt.getCacheDir();
		}

	    if (root.canWrite()){
			File dir = new File(root.getAbsolutePath() + File.separator + getSDCardFolder());
			if(!dir.exists()) {
				dir.mkdirs();
				Log.d(THIS_FILE, "Create directory " + dir.getAbsolutePath());
			}


			Log.i(THIS_FILE, "Create directory " + dir.getAbsolutePath());
			return dir;
	    }
	    return null;
	}

	private static String getSDCardFolder() {
        return "mylogs";
    }

	private static File getSubFolder(Context ctxt, String subFolder, boolean preferCache) {
		File root = getStorageFolder(ctxt, preferCache);
		if(root != null) {
			File dir = new File(root.getAbsoluteFile() + File.separator + subFolder);
			dir.mkdirs();
			return dir;
		}
		return null;
	}



	protected static File getLogsFolder(Context ctxt) {
		return getSubFolder(ctxt, LOGS_FOLDER, false);
	}

	protected static File getLogsFile(Context ctxt) {
        File dir = StorageUtils.getLogsFolder(ctxt);
        File outFile = null;
        if( dir != null) {
            Date d = new Date();
            StringBuffer fileName = new StringBuffer();

            fileName.append("logs_");
            fileName.append(DateFormat.format("yy-MM-dd_kkmmss", d));
            fileName.append(".txt");
            outFile = new File(dir.getAbsoluteFile() + File.separator + fileName.toString());
        }

        return outFile;
	}

	protected static void cleanLogsFiles(Context ctxt) {
		File logsFolder = getLogsFolder(ctxt);
		if(logsFolder != null) {
			File[] files = logsFolder.listFiles();
			if(files != null) {
    			for(File file: files) {
    				if(file.isFile()) {
    					file.delete();
    				}
    			}
			}
		}
	}


	protected Context getContext() {
		return context;
	}

}
