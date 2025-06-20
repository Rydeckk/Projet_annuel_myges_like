package com.myges.teacher

import android.app.Application
import dagger.hilt.android.HiltAndroidApp

/**
 * Application class for the MyGES Teacher mobile app.
 * 
 * This class initializes the application and sets up dependency injection
 * using Hilt for the teacher interface of the MyGES educational platform.
 */
@HiltAndroidApp
class MyGesTeacherApplication : Application()