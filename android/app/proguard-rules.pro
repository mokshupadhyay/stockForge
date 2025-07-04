# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# React Native
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jni.** { *; }

# Keep vector icons
-keep class com.oblador.vectoricons.** { *; }

# Keep NetInfo
-keep class com.reactnativecommunity.netinfo.** { *; }

# Keep Redux Toolkit
-keep class com.reduxjs.** { *; }

# Keep Axios
-keep class axios.** { *; }

# Remove logging in release
-assumenosideeffects class android.util.Log {
    public static boolean isLoggable(java.lang.String, int);
    public static int v(...);
    public static int i(...);
    public static int w(...);
    public static int d(...);
    public static int e(...);
}

# Remove console.log in release
-assumenosideeffects class * {
    *** console.log(...);
    *** console.warn(...);
    *** console.error(...);
    *** console.info(...);
    *** console.debug(...);
}
