package com.oneguide;

import com.dylanvann.fastimage.FastImageViewPackage;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.reactnativenavigation.NavigationApplication;
import com.reactnativenavigation.react.NavigationReactNativeHost;
import com.reactnativenavigation.react.ReactGateway;

import org.devio.rn.splashscreen.SplashScreenReactPackage;
import org.reactnative.camera.RNCameraPackage;

import com.rngrp.RNGRPPackage;

import fr.bamlab.rnimageresizer.ImageResizerPackage;

import com.RNFetchBlob.RNFetchBlobPackage;

//import co.apptailor.googlesignin.RNGoogleSigninPackage;

import com.swmansion.reanimated.ReanimatedPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends NavigationApplication {

    @Override
    public void onCreate() {
        super.onCreate();
    }

    @Override
    protected ReactGateway createReactGateway() {
        ReactNativeHost host = new NavigationReactNativeHost(this, isDebug(), createAdditionalReactPackages()) {
            @Override
            protected String getJSMainModuleName() {
                return "index";
            }
        };
        return new ReactGateway(this, isDebug(), host);
    }

    @Override
    public boolean isDebug() {
        return BuildConfig.DEBUG;
    }

    protected List<ReactPackage> getPackages() {
        // Add additional packages you require here
        // No need to add RnnPackage and MainReactPackage
        return Arrays.<ReactPackage>asList(
                // new RNGoogleSigninPackage(),
                new ReactNativeConfigPackage(),
                new FastImageViewPackage(),
                new SplashScreenReactPackage(),
                new RNCameraPackage(),
                new RNGRPPackage(),
                new ImageResizerPackage(),
                new RNFetchBlobPackage(),
                new ReanimatedPackage(),
                new RNGestureHandlerPackage()

        );
    }

    @Override
    public List<ReactPackage> createAdditionalReactPackages() {
        return getPackages();
    }
}
