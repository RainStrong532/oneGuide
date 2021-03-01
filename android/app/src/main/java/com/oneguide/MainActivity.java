package com.oneguide;

import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.reactnativenavigation.NavigationActivity;
import org.devio.rn.splashscreen.SplashScreen;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

public class MainActivity extends NavigationActivity {
//
//    @Override
//    protected String getMainComponentName() {
//      return "OneGuide";
//    }
//
//    @Override
//    protected ReactActivityDelegate createReactActivityDelegate() {
//      return new ReactActivityDelegate(this, getMainComponentName()) {
//        @Override
//        protected ReactRootView createRootView() {
//         return new RNGestureHandlerEnabledRootView(MainActivity.this);
//        }
//      };
//    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this,R.style.SplashScreenTheme);
        super.onCreate(savedInstanceState);
    }
}

