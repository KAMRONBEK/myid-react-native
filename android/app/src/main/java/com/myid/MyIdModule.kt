package com.myid

import android.app.Activity
import android.content.Intent
import android.graphics.Bitmap
import android.util.Base64
import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter
import uz.myid.android.sdk.capture.MyIdClient
import uz.myid.android.sdk.capture.MyIdConfig
import uz.myid.android.sdk.capture.MyIdException
import uz.myid.android.sdk.capture.MyIdResult
import uz.myid.android.sdk.capture.MyIdResultListener
import uz.myid.android.sdk.capture.model.MyIdBuildMode
import uz.myid.android.sdk.capture.model.MyIdCameraShape
import uz.myid.android.sdk.capture.model.MyIdEntryType
import uz.myid.android.sdk.capture.model.MyIdGraphicFieldType
import java.io.ByteArrayOutputStream
import java.util.*

class MyIdModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext), MyIdResultListener, ActivityEventListener {

    private val client = MyIdClient()

    init {
        reactContext.addActivityEventListener(this)
    }

    override fun getName(): String = "MyIdModule"

    @ReactMethod
    fun addListener(eventName: String?) {
        // Method to add listeners (placeholder for actual implementation if needed)
    }

    @ReactMethod
    fun removeListeners(count: Int?) {
        // Method to remove listeners (placeholder for actual implementation if needed)
    }

    @ReactMethod
    fun startMyId(clientId: String, clientHash: String, clientHashId: String, passportData: String, dateOfBirth: String, buildMode: String) {
        Log.d("MyIdModule", "startMyId called with clientId: $clientId")
        val mode = if (buildMode == "PRODUCTION") MyIdBuildMode.PRODUCTION else MyIdBuildMode.DEBUG
        val config = MyIdConfig.Builder(clientId)
            .withClientHash(clientHash, clientHashId)
            .withPassportData(passportData)
            .withBirthDate(dateOfBirth)
            .withBuildMode(mode)
            .withEntryType(MyIdEntryType.FACE)
            .withLocale(Locale("en"))
            .withCameraShape(MyIdCameraShape.CIRCLE)
            .build()

        reactContext.currentActivity?.let {
            val intent = client.createIntent(it, config)
            it.startActivityForResult(intent, MY_ID_REQUEST_CODE)
        } ?: Log.e("MyIdModule", "Current activity is null.")
    }

    override fun onActivityResult(activity: Activity?, requestCode: Int, resultCode: Int, data: Intent?) {
        if (requestCode == MY_ID_REQUEST_CODE) {
            Log.d("onActivity",data.toString())
            client.handleActivityResult(resultCode,  this)
        }
    }

    override fun onNewIntent(p0: Intent?) {
        TODO("Not yet implemented")
    }

    override fun onSuccess(result: MyIdResult) {
        Log.d("MyIdModule", "onSuccess called")
        val bitmap = result.getGraphicFieldImageByType(MyIdGraphicFieldType.FACE_PORTRAIT)
        val base64Image = bitmap?.let { encodeToBase64(it) }
        Log.d("base64Image",base64Image!!)
        val params = Arguments.createMap().apply {
            putString("code", result.code)
            putDouble("comparison", result.comparison.toDouble())
            putString("image", base64Image)
        }
        sendEvent("onSuccess", params)
    }

    override fun onError(e: MyIdException) {
        Log.d("MyIdModule", "onError called")
        val params = Arguments.createMap().apply {
            putString("message", e.message)
            putInt("code", e.code)
        }
        sendEvent("onError", params)
    }

    override fun onUserExited() {
        Log.d("MyIdModule", "onUserExited called")
        val params = Arguments.createMap().apply {
            putString("message", "User exited SDK")
        }
        sendEvent("onUserExited", params)
    }

    private fun sendEvent(eventName: String, params: WritableMap) {
        Log.d("MyIdModule", "sending event $eventName")
        reactContext.getJSModule(RCTDeviceEventEmitter::class.java).emit(eventName, params)
    }

    private fun encodeToBase64(bitmap: Bitmap): String {
        val outputStream = ByteArrayOutputStream()
        bitmap.compress(Bitmap.CompressFormat.PNG, 100, outputStream)
        return Base64.encodeToString(outputStream.toByteArray(), Base64.DEFAULT)
    }

    companion object {
        private const val MY_ID_REQUEST_CODE = 1
    }
}
