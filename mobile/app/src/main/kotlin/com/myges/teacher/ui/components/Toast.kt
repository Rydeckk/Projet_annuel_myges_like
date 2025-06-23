package com.myges.teacher.ui.components

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Error
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Popup
import androidx.compose.ui.window.PopupProperties
import kotlinx.coroutines.delay

enum class ToastType {
    SUCCESS, ERROR, WARNING, INFO
}

data class ToastData(
    val message: String,
    val type: ToastType = ToastType.INFO,
    val duration: Long = 3000L
)

class ToastState {
    private var _currentToast by mutableStateOf<ToastData?>(null)
    val currentToast: ToastData? get() = _currentToast

    fun showToast(toast: ToastData) {
        _currentToast = toast
    }

    fun hideToast() {
        _currentToast = null
    }
}

@Composable
fun rememberToastState(): ToastState {
    return remember { ToastState() }
}

@Composable
fun ToastHost(
    toastState: ToastState,
    modifier: Modifier = Modifier
) {
    val currentToast = toastState.currentToast
    val density = LocalDensity.current

    LaunchedEffect(currentToast) {
        if (currentToast != null) {
            delay(currentToast.duration)
            toastState.hideToast()
        }
    }

    if (currentToast != null) {
        Popup(
            alignment = Alignment.TopCenter,
            properties = PopupProperties(
                dismissOnBackPress = false,
                dismissOnClickOutside = false
            )
        ) {
            AnimatedVisibility(
                visible = currentToast != null,
                enter = slideInVertically(
                    initialOffsetY = { with(density) { -100.dp.roundToPx() } }
                ) + fadeIn(),
                exit = slideOutVertically(
                    targetOffsetY = { with(density) { -100.dp.roundToPx() } }
                ) + fadeOut()
            ) {
                ToastContent(
                    toast = currentToast,
                    modifier = modifier
                        .padding(horizontal = 16.dp, vertical = 8.dp)
                )
            }
        }
    }
}

@Composable
private fun ToastContent(
    toast: ToastData,
    modifier: Modifier = Modifier
) {
    val (icon, backgroundColor, contentColor) = when (toast.type) {
        ToastType.SUCCESS -> Triple(
            Icons.Default.CheckCircle,
            Color(0xFF22C55E),
            Color.White
        )
        ToastType.ERROR -> Triple(
            Icons.Default.Error,
            MaterialTheme.colorScheme.error,
            MaterialTheme.colorScheme.onError
        )
        ToastType.WARNING -> Triple(
            Icons.Default.Warning,
            Color(0xFFF59E0B),
            Color.White
        )
        ToastType.INFO -> Triple(
            Icons.Default.Info,
            MaterialTheme.colorScheme.primary,
            MaterialTheme.colorScheme.onPrimary
        )
    }

    Row(
        modifier = modifier
            .clip(RoundedCornerShape(8.dp))
            .background(backgroundColor)
            .padding(12.dp),
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            imageVector = icon,
            contentDescription = null,
            tint = contentColor,
            modifier = Modifier.size(20.dp)
        )
        Text(
            text = toast.message,
            color = contentColor,
            style = MaterialTheme.typography.bodyMedium,
            fontWeight = FontWeight.Medium
        )
    }
}

suspend fun ToastState.showSuccess(message: String, duration: Long = 3000L) {
    showToast(ToastData(message, ToastType.SUCCESS, duration))
}

suspend fun ToastState.showError(message: String, duration: Long = 4000L) {
    showToast(ToastData(message, ToastType.ERROR, duration))
}

suspend fun ToastState.showWarning(message: String, duration: Long = 3500L) {
    showToast(ToastData(message, ToastType.WARNING, duration))
}

suspend fun ToastState.showInfo(message: String, duration: Long = 3000L) {
    showToast(ToastData(message, ToastType.INFO, duration))
}