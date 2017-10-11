package com.hd_app;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.Date;

import android.app.Activity;
import android.app.Application;
import android.content.ContentUris;
import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.Bitmap.CompressFormat;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.DocumentsContract;
import android.provider.MediaStore;
import android.text.TextUtils;


public class FileUtils {

	// 写在/mnt/sdcard/目录下面的文件

	private static String TAG = "FileUtils";

	/**
	 * @param fileName
	 * @param message
	 */
	public static void writeFileSdcard(String fileName, String message) {

		try {

			FileOutputStream fout = new FileOutputStream(fileName);
			byte[] bytes = message.getBytes();
			fout.write(bytes);
			fout.flush();
			fout.close();
		}

		catch (Exception e) {

			e.printStackTrace();

		}

	}

	public static long getMaxFileSendLimitedSize(Context context) {
		// TODO Auto-generated method stub
		long maxLen = 0;
		return maxLen;
		//
	}





	private static boolean checkSendfileSizeIsOk(final Activity activity, long fileSize,boolean showToast) {
		// check file size
		final long maxImageSize = getMaxFileSendLimitedSize(activity);
		if (maxImageSize <= fileSize) {
			if (showToast) {
				activity.runOnUiThread(new Runnable() {
					@Override
					public void run() {
//						activity.showToast(activity.getString(R.string.file_max_limit_info)
//								+" "+ (maxImageSize / (double) (1024 * 1024))
//								+ activity.getString(R.string.file_unit_m));

					}
				});
			}

			return false;
		}else if (0 == fileSize) {
			if (showToast) {
				activity.runOnUiThread(new Runnable() {
					@Override
					public void run() {
					//	activity.showToast(activity.getString(R.string.file_min_limit_info));
					}
				});
			}

			return false;

		}
		return true;
	}


	public static boolean checkSendfileSizeIsOk(Activity activity,
			File sendingFile,boolean showToast) {
		// check file size
		return checkSendfileSizeIsOk(activity, sendingFile.length(),showToast);
	}

	public static boolean checkSendfileSizeIsOk(Activity activity,
			File sendingFile) {
		// check file size
		//if file is video type and mp4  size around 20M~40M,we go video compress first.
		if (checkSendVideoFileSize(activity,sendingFile)) {

//			Intent intent = new Intent(activity, ScanVideoActivity.class);
//			intent.setAction(ScanVideoActivity.VIDEO_SCAN);
//			intent.addFlags(Intent.FLAG_ACTIVITY_REORDER_TO_FRONT);
//			intent.putExtra("filePath", sendingFile.getAbsolutePath());
//			intent.putExtra("fileName", sendingFile.getName());
//			intent.putExtra("extraType", "compress_video");
//			activity.startActivityForResult(intent,);

			return false;
		}
		return checkSendfileSizeIsOk(activity, sendingFile, true);
	}

	/**file is video type and mp4  size around 20M~40M,we go video compress first.
	 * @param activity
	 * @param sendingFile
	 * @return
	 */
	private static boolean checkSendVideoFileSize(Activity activity,
			File sendingFile) {



		return false;
	}

	public static void showFileChooser(Activity instance, int requestCode) {

		Intent intent = new Intent(Intent.ACTION_GET_CONTENT);

		intent.setType("video/*;image/*");

		intent.addCategory(Intent.CATEGORY_OPENABLE);

		try {

			instance.startActivityForResult(
					Intent.createChooser(intent,"ss"),
					requestCode);

		} catch (android.content.ActivityNotFoundException ex) {
			// Potentially direct the user to the Market with a Dialog
		}
	}

	public static String getFileNameByDate() {
		Date date = new Date(System.currentTimeMillis());
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd-HHmmss");
		return dateFormat.format(date);
	}


	public static String getVideoFileName() {
		Date date = new Date(System.currentTimeMillis());
		SimpleDateFormat dateFormat = new SimpleDateFormat(
				"'VIDEO'_yyyy-MM-dd-HHmmss");
		return dateFormat.format(date) + ".mp4";
	}

	public static String getPhotoFileName() {
		Date date = new Date(System.currentTimeMillis());
		SimpleDateFormat dateFormat = new SimpleDateFormat(
				"'IMG'_yyyy-MM-dd-HHmmss");
		return dateFormat.format(date) + ".jpg";
	}

	/**
	 * Get a file path from a Uri. This will get the the path for Storage Access
	 * Framework Documents, as well as the _data field for the MediaStore and
	 * other file-based ContentProviders.
	 *
	 * @param context
	 *            The context.
	 * @param uri
	 *            The Uri to query.
	 * @author paulburke
	 */
	public static String getPath(final Context context, final Uri uri) {

		final boolean isKitKat = Build.VERSION.SDK_INT >= 19;// 4.4

		// DocumentProvider
		if (isKitKat && DocumentsContract.isDocumentUri(context, uri)) {
			// ExternalStorageProvider
			if (isExternalStorageDocument(uri)) {
				final String docId = DocumentsContract.getDocumentId(uri);
				final String[] split = docId.split(":");
				final String type = split[0];

				if ("primary".equalsIgnoreCase(type)) {
					return Environment.getExternalStorageDirectory() + "/"
							+ split[1];
				}

				// TODO handle non-primary volumes
			}
			// DownloadsProvider
			else if (isDownloadsDocument(uri)) {

				final String id = DocumentsContract.getDocumentId(uri);
				final Uri contentUri = ContentUris.withAppendedId(
						Uri.parse("content://downloads/public_downloads"),
						Long.valueOf(id));

				return getDataColumn(context, contentUri, null, null);
			}
			// MediaProvider
			else if (isMediaDocument(uri)) {
				final String docId = DocumentsContract.getDocumentId(uri);
				final String[] split = docId.split(":");
				final String type = split[0];

				Uri contentUri = null;
				if ("image".equals(type)) {
					contentUri = MediaStore.Images.Media.EXTERNAL_CONTENT_URI;
				} else if ("video".equals(type)) {
					contentUri = MediaStore.Video.Media.EXTERNAL_CONTENT_URI;
				} else if ("audio".equals(type)) {
					contentUri = MediaStore.Audio.Media.EXTERNAL_CONTENT_URI;
				}

				final String selection = "_id=?";
				final String[] selectionArgs = new String[] { split[1] };

				return getDataColumn(context, contentUri, selection,
						selectionArgs);
			}
		}
		// MediaStore (and general)
		else if ("content".equalsIgnoreCase(uri.getScheme())) {
			return getDataColumn(context, uri, null, null);
		}
		// File
		else if ("file".equalsIgnoreCase(uri.getScheme())) {
			return uri.getPath();
		}

		return null;
	}

	/**
	 * Get the value of the data column for this Uri. This is useful for
	 * MediaStore Uris, and other file-based ContentProviders.
	 *
	 * @param context
	 *            The context.
	 * @param uri
	 *            The Uri to query.
	 * @param selection
	 *            (Optional) Filter used in the query.
	 * @param selectionArgs
	 *            (Optional) Selection arguments used in the query.
	 * @return The value of the _data column, which is typically a file path.
	 */
	public static String getDataColumn(Context context, Uri uri,
			String selection, String[] selectionArgs) {

		Cursor cursor = null;
		final String column = MediaStore.MediaColumns.DATA;
		final String[] projection = { column };

		try {
			cursor = context.getContentResolver().query(uri, projection,
					selection, selectionArgs, null);
			if (cursor != null && cursor.moveToFirst()) {
				final int column_index = cursor.getColumnIndexOrThrow(column);

				return cursor.getString(column_index);
			}
		} finally {
			if (cursor != null)
				cursor.close();
		}
		return null;
	}

	/**
	 * @param uri
	 *            The Uri to check.
	 * @return Whether the Uri authority is ExternalStorageProvider.
	 */
	public static boolean isExternalStorageDocument(Uri uri) {
		return "com.android.externalstorage.documents".equals(uri
				.getAuthority());
	}

	/**
	 * @param uri
	 *            The Uri to check.
	 * @return Whether the Uri authority is DownloadsProvider.
	 */
	public static boolean isDownloadsDocument(Uri uri) {
		return "com.android.providers.downloads.documents".equals(uri
				.getAuthority());
	}

	/**
	 * @param uri
	 *            The Uri to check.
	 * @return Whether the Uri authority is MediaProvider.
	 */
	public static boolean isMediaDocument(Uri uri) {
		return "com.android.providers.media.documents".equals(uri
				.getAuthority());
	}

	// get file absolute path.
	public static String Uri2Filename(Application application, Uri uriName) {
		String file = null;

		file = getPath(application, uriName);
		// if (null != uriName) {
		// if (0 == uriName.getScheme().toString().compareTo("content")) {
		// Cursor c = application.getContentResolver().query(
		// uriName, null, null, null, null);
		// if (null != c && c.moveToFirst()) {
		// try {
		// int column_index = c
		// .getColumnIndexOrThrow(MediaStore.MediaColumns.DATA);
		// file = c.getString(column_index);
		// } catch (IllegalArgumentException e) {
		// e.printStackTrace();
		// try {
		// int column_index = c
		// .getColumnIndexOrThrow(MediaStore.Images.Thumbnails.DATA);
		// file = c.getString(column_index);
		// } catch (Exception e2) {
		// e2.printStackTrace();
		// Toast.makeText(application,application.getString(R.string.choose_image_file_error),
		// Toast.LENGTH_LONG).show();
		// }
		// }
		//
		// }
		// } else if (0 == uriName.getScheme().toString().compareTo("file")) {
		// file = uriName.toString().replace("file://", "");
		// }
		// }
		return file;
	}

	// 文件拷贝
	// 要复制的目录下的所有非子目录(文件夹)文件拷贝
	public static int CopySdcardFile(String fromFile, String toFile) {
		boolean status =copyfile(
				new File(fromFile), new File(toFile), true);
		if (!status) {
			return -1;
		}
		return 0;

	}
	private static void writeToOutFile(File toFile, FileInputStream fosfrom)
			throws IOException {
		FileOutputStream fosto = null;
		fosto = new FileOutputStream(toFile);
		byte bt[] = new byte[1024];
		int c;
		while ((c = fosfrom.read(bt)) > 0) {
			fosto.write(bt, 0, c);
		}
		fosto.close();

	}

	private static boolean copyfile(File fromFile, File toFile, boolean rewrite) {
		FileInputStream fosfrom;
		boolean result;
		if (!fromFile.exists() || !fromFile.isFile() || !fromFile.canRead())
			return false;
		boolean isSucceed = false;
		if (!toFile.getParentFile().exists()) {
			isSucceed = toFile.getParentFile().mkdirs();

		}
		if (toFile.exists() && rewrite) {
			isSucceed = toFile.delete();

		}
		fosfrom = null;
		result = false;

		try {
			fosfrom = new FileInputStream(fromFile);
			writeToOutFile(toFile, fosfrom);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally {
			if (null != fosfrom)
				try {
					fosfrom.close();
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}

		}

		result = true;

		return result;
	}

	public static String getFileName(String filename) {
		if ((filename != null) && (filename.length() > 0)) {
			int dot = filename.lastIndexOf('/');
			if (dot==-1) {
				dot = filename.lastIndexOf("\\");
			}
			if ((dot > -1) && (dot < (filename.length()))) {
				return filename.substring(dot+1);
			}
		}
		return filename;
	}

	/*
	 * Java文件操作 获取不带扩展名的文件名
	 */
	public static String getFileNameNoEx(String filename) {
		if ((filename != null) && (filename.length() > 0)) {
			int dot = filename.lastIndexOf('.');
			if ((dot > -1) && (dot < (filename.length()))) {
				return filename.substring(0, dot);
			}
		}
		return filename;
	}

	/**
	 * Return the extension portion of the file's name .
	 *
	 * @see #getExtension
	 */
	public static String getExtension(File f) {
		return (f != null) ? getExtension(f.getName()) : "";
	}

	public static String getExtension(String filename) {
		return getExtension(filename, "");
	}

	public static String getExtension(String filename, String defExt) {
		if ((filename != null) && (filename.length() > 0)) {
			int i = filename.lastIndexOf('.');

			if ((i > -1) && (i < (filename.length() - 1))) {
				return filename.substring(i + 1);
			}
		}
		return defExt;
	}

	public static boolean getSdcardAviable() {

		Boolean isSDPresent = android.os.Environment.getExternalStorageState()
				.equals(android.os.Environment.MEDIA_MOUNTED);

		return isSDPresent;
	}

	public static String trimExtension(String filename) {
		if ((filename != null) && (filename.length() > 0)) {
			int i = filename.lastIndexOf('.');
			if ((i > -1) && (i < (filename.length()))) {
				return filename.substring(0, i);
			}
		}
		return filename;
	}




	public static void scanMediaFileToGallery(Context context, String path) {
		File file = new File(path);
		Uri uri = Uri.fromFile(file);
		Intent intent = new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE, uri);
		context.sendBroadcast(intent);
	}

	public interface DownloadFileEndListener {
		void DownloadedFile(File file);
	}


	private static void saveBitmap2TempFile(File file, Bitmap bitmap) {

		ByteArrayOutputStream bos = new ByteArrayOutputStream();
		bitmap.compress(CompressFormat.JPEG, 70 /* ignored for PNG */, bos);
		byte[] bitmapdata = bos.toByteArray();

		// write the bytes in file
		FileOutputStream fos = null;
		try {

			fos = new FileOutputStream(file);

			fos.write(bitmapdata);
			fos.flush();
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally {

			try {
				fos.close();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

		}

	}

	public static boolean isFileExist(String fileName) {
		if (TextUtils.isEmpty(fileName)) {
			return false;
		}
		File file = new File(fileName);
		return file.exists();

	}

	public static void createFileDir(String dir) {
		File file = new File(dir);
		if (!file.exists()) {
			file.mkdirs();
		}
	}


	public static void createFileDirNoMedia(String dir) {
		File file = new File(dir);
		if (!file.exists()) {
			file.mkdirs();
		}
		File targetFile=new File(dir+".nomedia");

	    if(!targetFile.exists()){
	    	try {
	    		File parent=targetFile.getParentFile();
		    	if (parent!=null&&!parent.exists()) {
		    		parent.mkdirs();
				}
		    	targetFile.createNewFile();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

	    }

	}


	/**
	 * 取得压缩包中的 文件列表(文件夹,文件自选)
	 * @param zipFileString		压缩包名字
	 * @param bContainFolder	是否包括 文件夹
	 * @param bContainFile		是否包括 文件
	 * @return
	 * @throws Exception
	 */
	public static java.util.List<java.io.File> getFileList(String zipFileString, boolean bContainFolder, boolean bContainFile)throws Exception {
		java.util.List<java.io.File> fileList = new java.util.ArrayList<java.io.File>();
		java.util.zip.ZipInputStream inZip = new java.util.zip.ZipInputStream(new java.io.FileInputStream(zipFileString));
		java.util.zip.ZipEntry zipEntry;
		String szName = "";

		while ((zipEntry = inZip.getNextEntry()) != null) {
			szName = zipEntry.getName();

			if (zipEntry.isDirectory()) {

				// get the folder name of the widget
				szName = szName.substring(0, szName.length() - 1);
				java.io.File folder = new java.io.File(szName);
				if (bContainFolder) {
					fileList.add(folder);
				}

			} else {
				java.io.File file = new java.io.File(szName);
				if (bContainFile) {
					fileList.add(file);
				}
			}
		}//end of while

		inZip.close();

		return fileList;
	}

	/**
	 * 返回压缩包中的文件InputStream
	 *
	 * @param zipFilePath		压缩文件的名字
	 * @param fileString	解压文件的名字
	 * @return InputStream
	 * @throws Exception
	 */
	public static java.io.InputStream upZip(String zipFilePath, String fileString)throws Exception {
		java.util.zip.ZipFile zipFile = new java.util.zip.ZipFile(zipFilePath);
		java.util.zip.ZipEntry zipEntry = zipFile.getEntry(fileString);

		return zipFile.getInputStream(zipEntry);

	}

	/**
	 * 解压一个压缩文档 到指定位置
	 * @param zipFileString	压缩包的名字
	 * @param outPathString	指定的路径
	 * @throws Exception
	 */
	public static void unZipFolder(InputStream input, String outPathString)throws Exception {
		java.util.zip.ZipInputStream inZip = new java.util.zip.ZipInputStream(input);
		java.util.zip.ZipEntry zipEntry = null;
		String szName = "";

		while ((zipEntry = inZip.getNextEntry()) != null) {
			szName = zipEntry.getName();

			if (zipEntry.isDirectory()) {

				// get the folder name of the widget
				szName = szName.substring(0, szName.length() - 1);
				java.io.File folder = new java.io.File(outPathString + java.io.File.separator + szName);
				folder.mkdirs();

			} else {

				java.io.File file = new java.io.File(outPathString + java.io.File.separator + szName);
				file.createNewFile();
				// get the output stream of the file
				java.io.FileOutputStream out = new java.io.FileOutputStream(file);
				int len;
				byte[] buffer = new byte[1024];
				// read (len) bytes into buffer
				while ((len = inZip.read(buffer)) != -1) {
					// write (len) byte from buffer at the position 0
					out.write(buffer, 0, len);
					out.flush();
				}
				out.close();
			}
		}//end of while

		inZip.close();
	}

	/**
	 * 解压一个压缩文档 到指定位置
	 * @param zipFileString	压缩包的名字
	 * @param outPathString	指定的路径
	 * @throws Exception
	 */
	public static void unZipFolder(String zipFileString, String outPathString)throws Exception {
		unZipFolder(new java.io.FileInputStream(zipFileString),outPathString);
	}//end of func


	/**
	 * 压缩文件,文件夹
	 *
	 * @param srcFilePath	要压缩的文件/文件夹名字
	 * @param zipFilePath	指定压缩的目的和名字
	 * @throws Exception
	 */
	public static void zipFolder(String srcFilePath, String zipFilePath,boolean containMediaLog)throws Exception {
		//创建Zip包
		java.util.zip.ZipOutputStream outZip = new java.util.zip.ZipOutputStream(new java.io.FileOutputStream(zipFilePath));

		//打开要输出的文件
		java.io.File file = new java.io.File(srcFilePath);

		//压缩
		zipFiles(file.getParent()+java.io.File.separator, file.getName(), outZip,containMediaLog);

		//完成,关闭
		outZip.finish();
		outZip.close();

	}//end of func

	/**
	 * 压缩文件
	 * @param folderPath
	 * @param filePath
	 * @param zipOut
	 * @throws Exception
	 */
	private static void zipFiles(String folderPath, String filePath, java.util.zip.ZipOutputStream zipOut,boolean containMediaLog)throws Exception{
		if(zipOut == null){
			return;
		}
		String parentFilePath=folderPath+filePath;

		java.io.File file = new java.io.File(parentFilePath);

		//判断是不是文件
		if (file.isFile()) {

			java.util.zip.ZipEntry zipEntry =  new java.util.zip.ZipEntry(filePath);
			java.io.FileInputStream inputStream = new java.io.FileInputStream(file);
			zipOut.putNextEntry(zipEntry);

			int len;
			byte[] buffer = new byte[4096];

			while((len=inputStream.read(buffer)) != -1)
			{
				zipOut.write(buffer, 0, len);
			}

			zipOut.closeEntry();

			inputStream.close();

		}
		else {

			//文件夹的方式,获取文件夹下的子文件

			String[] fileList = file.list();


			//如果判断时间是5天前的文件就删除

			for (int i = 0; i < fileList.length; i++) {


				File fileChild=new File(parentFilePath+java.io.File.separator+fileList[i]);

				if(!fileChild.exists()){

					continue;
				}

				long lastModifyTime = fileChild.lastModified();

				SimpleDateFormat format=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

			    Date date1=new Date(lastModifyTime);

			    String time1=format.format(date1);


				   // 最后修改时间在5天之外的文件删除

				   if(lastModifyTime+(5*1000*60*60*24)<System.currentTimeMillis()){


					   fileChild.delete();

				   }
			}

			//如果没有子文件, 则添加进去即可
			fileList= file.list();


			if (fileList.length <= 0) {
				java.util.zip.ZipEntry zipEntry =  new java.util.zip.ZipEntry(filePath+java.io.File.separator);
				zipOut.putNextEntry(zipEntry);
				zipOut.closeEntry();
			}

			//如果有子文件, 遍历子文件
			for (int i = 0; i < fileList.length; i++) {

		     	File fileChild=new File(parentFilePath+java.io.File.separator+fileList[i]);

		     	if(!containMediaLog){

					if(!fileChild.exists()||!fileChild.getName().startsWith("En_hrcs")){

						continue;
					}
		     	}
				zipFiles(folderPath, filePath+java.io.File.separator+fileList[i], zipOut,containMediaLog);
			}//end of for

		}//end of if

	  }

}
