package com.myges.teacher.ui.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

enum class ButtonVariant {
    PRIMARY, SECONDARY, OUTLINE, GHOST, DESTRUCTIVE
}

enum class ButtonSize {
    SMALL, MEDIUM, LARGE
}

@Composable
fun CustomButton(
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    variant: ButtonVariant = ButtonVariant.PRIMARY,
    size: ButtonSize = ButtonSize.MEDIUM,
    enabled: Boolean = true,
    shape: Shape = RoundedCornerShape(6.dp),
    content: @Composable RowScope.() -> Unit
) {
    val colors = when (variant) {
        ButtonVariant.PRIMARY -> ButtonDefaults.buttonColors(
            containerColor = MaterialTheme.colorScheme.primary,
            contentColor = MaterialTheme.colorScheme.onPrimary
        )
        ButtonVariant.SECONDARY -> ButtonDefaults.buttonColors(
            containerColor = MaterialTheme.colorScheme.secondary,
            contentColor = MaterialTheme.colorScheme.onSecondary
        )
        ButtonVariant.OUTLINE -> ButtonDefaults.outlinedButtonColors(
            containerColor = Color.Transparent,
            contentColor = MaterialTheme.colorScheme.onSurface
        )
        ButtonVariant.GHOST -> ButtonDefaults.textButtonColors(
            containerColor = Color.Transparent,
            contentColor = MaterialTheme.colorScheme.onSurface
        )
        ButtonVariant.DESTRUCTIVE -> ButtonDefaults.buttonColors(
            containerColor = MaterialTheme.colorScheme.error,
            contentColor = MaterialTheme.colorScheme.onError
        )
    }

    val contentPadding = when (size) {
        ButtonSize.SMALL -> PaddingValues(horizontal = 12.dp, vertical = 6.dp)
        ButtonSize.MEDIUM -> PaddingValues(horizontal = 16.dp, vertical = 8.dp)
        ButtonSize.LARGE -> PaddingValues(horizontal = 24.dp, vertical = 12.dp)
    }

    val minHeight = when (size) {
        ButtonSize.SMALL -> 32.dp
        ButtonSize.MEDIUM -> 40.dp
        ButtonSize.LARGE -> 48.dp
    }

    when (variant) {
        ButtonVariant.OUTLINE -> {
            OutlinedButton(
                onClick = onClick,
                modifier = modifier.heightIn(min = minHeight),
                enabled = enabled,
                shape = shape,
                colors = colors,
                contentPadding = contentPadding,
                border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline),
                content = content
            )
        }
        ButtonVariant.GHOST -> {
            TextButton(
                onClick = onClick,
                modifier = modifier.heightIn(min = minHeight),
                enabled = enabled,
                shape = shape,
                colors = colors,
                contentPadding = contentPadding,
                content = content
            )
        }
        else -> {
            Button(
                onClick = onClick,
                modifier = modifier.heightIn(min = minHeight),
                enabled = enabled,
                shape = shape,
                colors = colors,
                contentPadding = contentPadding,
                content = content
            )
        }
    }
}

@Composable
fun CustomButton(
    onClick: () -> Unit,
    text: String,
    modifier: Modifier = Modifier,
    variant: ButtonVariant = ButtonVariant.PRIMARY,
    size: ButtonSize = ButtonSize.MEDIUM,
    enabled: Boolean = true,
    isLoading: Boolean = false,
    leadingIcon: @Composable (() -> Unit)? = null,
    trailingIcon: @Composable (() -> Unit)? = null
) {
    CustomButton(
        onClick = onClick,
        modifier = modifier,
        variant = variant,
        size = size,
        enabled = enabled && !isLoading
    ) {
        if (isLoading) {
            CircularProgressIndicator(
                modifier = Modifier.size(16.dp),
                strokeWidth = 2.dp,
                color = when (variant) {
                    ButtonVariant.PRIMARY -> MaterialTheme.colorScheme.onPrimary
                    ButtonVariant.SECONDARY -> MaterialTheme.colorScheme.onSecondary
                    ButtonVariant.DESTRUCTIVE -> MaterialTheme.colorScheme.onError
                    else -> MaterialTheme.colorScheme.onSurface
                }
            )
        } else {
            if (leadingIcon != null) {
                leadingIcon()
                Spacer(modifier = Modifier.width(8.dp))
            }
            Text(
                text = text,
                fontWeight = FontWeight.Medium
            )
            if (trailingIcon != null) {
                Spacer(modifier = Modifier.width(8.dp))
                trailingIcon()
            }
        }
    }
}