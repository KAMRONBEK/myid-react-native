package com.myid

import android.graphics.Bitmap
import android.util.Base64
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
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
import java.util.Locale
import javax.annotation.Nonnull


class MyIdModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext), MyIdResultListener {

    private val client = MyIdClient()

    @Nonnull
    override fun getName(): String {
        return "MyIdModule"
    }

    @ReactMethod
    fun addListener(eventName: String?) {
    }

    @ReactMethod
    fun removeListeners(count: Int?) {
    }

    @ReactMethod
    fun startMyId() {
//        clientId: String, clientHash: String, clientHashId: String, passportData: String, dateOfBirth: String, buildMode: String, promise: Promise
//        val mode = if (buildMode == "PRODUCTION") MyIdBuildMode.PRODUCTION else MyIdBuildMode.DEBUG

        val config: MyIdConfig = MyIdConfig.Builder("YOUR_CLIENT_ID")
            .withPassportData("AB1234567")
            .withBirthDate("01.09.19901")
            .withBuildMode(MyIdBuildMode.PRODUCTION)
            .withEntryType(MyIdEntryType.FACE)
            .withLocale(Locale("ru"))
            .withCameraShape(MyIdCameraShape.CIRCLE)
            .build()


        try {
            val intent = client.createIntent(reactContext.currentActivity!!, config)
            reactContext.currentActivity?.startActivityForResult(intent, 1)
        } catch (e: Exception) {
            println(e.message)
        }
    }

   override fun onSuccess(result: MyIdResult) {
        val bitmap = result.getGraphicFieldImageByType(MyIdGraphicFieldType.FACE_PORTRAIT)
        val base64Image = bitmap?.let { encodeToBase64(it) }

        val map = Arguments.createMap()
        map.putString("code", result.code)
        map.putDouble("comparison", result.comparison.toDouble())
        map.putString("image", base64Image)
        sendEvent(reactContext,"onSuccess", map)
    }

    private fun encodeToBase64(bitmap: Bitmap): String {
        val outputStream = ByteArrayOutputStream()
        bitmap.compress(Bitmap.CompressFormat.PNG, 100, outputStream)
        return Base64.encodeToString(outputStream.toByteArray(), Base64.DEFAULT)
    }
    override fun onError(e: MyIdException) {
        sendEvent(reactContext,"onError", Arguments.createMap().apply {
            putString("message", e.message)
            putInt("code", e.code)
        })
    }

    override fun onUserExited() {
        sendEvent(reactContext,"onUserExited", Arguments.createMap().apply {
            putString("message", "User exited SDK")
        })
    }

    private fun sendEvent(reactContext: ReactContext, eventName: String, params: WritableMap?) {
        reactContext
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        .emit(eventName, params)
    }
}
