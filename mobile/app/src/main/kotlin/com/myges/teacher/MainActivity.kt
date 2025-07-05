package com.myges.teacher

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.ui.Modifier
import com.myges.teacher.navigation.MyGesNavigation
import com.myges.teacher.ui.theme.MyGESTeacherTheme
import dagger.hilt.android.AndroidEntryPoint

/**
 * Main activity for the MyGES Teacher mobile application.
 * 
 * This activity serves as the entry point for the teacher interface,
 * providing access to deliverables management, student reports,
 * and grading functionality.
 */

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MyGESTeacherTheme {
                Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
                    MyGesNavigation(
                        modifier = Modifier.padding(innerPadding)
                    )
                }
            }
        }
    }
}