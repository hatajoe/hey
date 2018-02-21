package com.hey;

import hey.Hey;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

/**
 * Created by hatajoe on 2018/02/22.
 */

public class HeyModule extends ReactContextBaseJavaModule {
    ReactApplicationContext reactContext;

    public HeyModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "Core";
    }

    @ReactMethod
    public void connect(String url, String origin, final String eventName) {
        Hey.connect(url, origin, new hey.OnReceive() {
            @Override
            public void receive(String msg) {
                sendEvent(eventName, msg);
            }
        });
    }

    @ReactMethod
    public void disconnect() {
        Hey.disconnect();
    }

    @ReactMethod
    public void send(int hid, String buf) {
        Hey.send(hid, buf);
    }

    private void sendEvent(String eventName, String msg) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, msg);
    }
}
