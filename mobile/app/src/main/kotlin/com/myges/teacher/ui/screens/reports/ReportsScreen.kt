package com.myges.teacher.ui.screens.reports

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.selection.SelectionContainer
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.res.stringResource
import com.myges.teacher.ui.components.*
import com.myges.teacher.data.model.MockData
import com.myges.teacher.data.model.Report
import com.myges.teacher.data.model.ReportStatus
import com.myges.teacher.R
import kotlinx.coroutines.launch
import java.time.format.DateTimeFormatter

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ReportsScreen(
    onNavigateBack: () -> Unit
) {
    var selectedReport by remember { mutableStateOf<Report?>(null) }
    var showPreview by remember { mutableStateOf(false) }
    val toastState = rememberToastState()
    val scope = rememberCoroutineScope()

    Box(modifier = Modifier.fillMaxSize()) {
        Column(modifier = Modifier.fillMaxSize()) {
            TopAppBar(
                title = { 
                    Text(
                        text = stringResource(R.string.reports_title),
                        fontWeight = FontWeight.Bold
                    ) 
                },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(
                            Icons.Default.ArrowBack,
                            contentDescription = stringResource(R.string.back_button),
                            tint = MaterialTheme.colorScheme.onSurface
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.background,
                    titleContentColor = MaterialTheme.colorScheme.onBackground
                )
            )
            
            when {
                selectedReport != null && !showPreview -> {
                    ReportDetailView(
                        report = selectedReport!!,
                        onBackClick = { selectedReport = null },
                        onPreviewClick = { showPreview = true },
                        onMarkAsRead = {
                            scope.launch {
                                toastState.showSuccess("Rapport marqué comme lu")
                            }
                        }
                    )
                }
                selectedReport != null && showPreview -> {
                    ReportPreviewView(
                        report = selectedReport!!,
                        onBackClick = { showPreview = false },
                        onReadFullReport = { showPreview = false }
                    )
                }
                else -> {
                    ReportsListView(
                        reports = MockData.reports,
                        onReportClick = { selectedReport = it }
                    )
                }
            }
        }
        
        ToastHost(
            toastState = toastState,
            modifier = Modifier.align(Alignment.TopCenter)
        )
    }
}

@Composable
fun ReportsListView(
    reports: List<Report>,
    onReportClick: (Report) -> Unit
) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Text(
                text = stringResource(R.string.student_reports),
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onBackground
            )
            Text(
                text = stringResource(R.string.student_reports_desc),
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
        
        items(reports) { report ->
            ReportListCard(
                report = report,
                onClick = { onReportClick(report) }
            )
        }
    }
}

@Composable
fun ReportListCard(
    report: Report,
    onClick: () -> Unit
) {
    val formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy à HH:mm")
    
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() }
    ) {
        Column(
            modifier = Modifier.padding(20.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.Top
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = report.title,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.SemiBold,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    
                    Text(
                        text = "${report.student.firstName} ${report.student.lastName}",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    
                    Text(
                        text = report.project.title,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                
                ReportStatusBadge(status = report.status)
            }
            
            Spacer(modifier = Modifier.height(16.dp))
            
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = Icons.Default.Schedule,
                        contentDescription = null,
                        modifier = Modifier.size(16.dp),
                        tint = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = stringResource(R.string.created_on, report.createdAt.format(formatter)),
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                
                Row(
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = Icons.Default.Description,
                        contentDescription = null,
                        modifier = Modifier.size(16.dp),
                        tint = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = stringResource(R.string.characters_count, report.content.length),
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                
                Icon(
                    imageVector = Icons.Default.ChevronRight,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}

@Composable
fun ReportStatusBadge(status: ReportStatus) {
    val (color, text, icon) = when (status) {
        ReportStatus.DRAFT -> Triple(Color(0xFFF59E0B), stringResource(R.string.status_draft), Icons.Default.Edit)
        ReportStatus.SUBMITTED -> Triple(Color(0xFF3B82F6), stringResource(R.string.status_report_submitted), Icons.Default.Send)
        ReportStatus.REVIEWED -> Triple(Color(0xFF22C55E), stringResource(R.string.status_reviewed), Icons.Default.CheckCircle)
    }
    
    Surface(
        color = color.copy(alpha = 0.1f),
        shape = RoundedCornerShape(12.dp),
        modifier = Modifier.padding(4.dp)
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                modifier = Modifier.size(12.dp),
                tint = color
            )
            Spacer(modifier = Modifier.width(4.dp))
            Text(
                text = text,
                style = MaterialTheme.typography.labelSmall,
                color = color,
                fontWeight = FontWeight.Medium
            )
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ReportDetailView(
    report: Report,
    onBackClick: () -> Unit,
    onPreviewClick: () -> Unit,
    onMarkAsRead: () -> Unit
) {
    val formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy à HH:mm")
    
    Column(modifier = Modifier.fillMaxSize()) {
        TopAppBar(
            title = { 
                Text(
                    text = stringResource(R.string.report_details),
                    fontWeight = FontWeight.Bold
                ) 
            },
            navigationIcon = {
                IconButton(onClick = onBackClick) {
                    Icon(
                        Icons.Default.ArrowBack,
                        contentDescription = stringResource(R.string.back_button),
                        tint = MaterialTheme.colorScheme.onSurface
                    )
                }
            },
            colors = TopAppBarDefaults.topAppBarColors(
                containerColor = MaterialTheme.colorScheme.background,
                titleContentColor = MaterialTheme.colorScheme.onBackground
            )
        )
        
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Report information
            item {
            Card {
                CardHeader(
                    title = report.title,
                    subtitle = "${report.student.firstName} ${report.student.lastName} • ${report.project.title}"
                )
                
                CardContent {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        InfoItem(
                            label = stringResource(R.string.creation_date),
                            value = report.createdAt.format(formatter),
                            icon = Icons.Default.CalendarToday
                        )
                        InfoItem(
                            label = stringResource(R.string.length_label),
                            value = stringResource(R.string.length_characters, report.content.length),
                            icon = Icons.Default.Description
                        )
                    }
                    
                    Spacer(modifier = Modifier.height(16.dp))
                    
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = stringResource(R.string.status_label),
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            ReportStatusBadge(status = report.status)
                        }
                        
                        if (report.status != ReportStatus.REVIEWED) {
                            CustomButton(
                                onClick = onMarkAsRead,
                                text = stringResource(R.string.mark_as_read),
                                variant = ButtonVariant.OUTLINE,
                                size = ButtonSize.SMALL
                            )
                        }
                    }
                }
            }
            }
            
            // Student
            item {
            Card {
                CardHeader(
                    title = stringResource(R.string.student_information),
                    subtitle = stringResource(R.string.student_information_desc)
                )
                
                CardContent {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = Icons.Default.Person,
                            contentDescription = null,
                            modifier = Modifier.size(24.dp),
                            tint = MaterialTheme.colorScheme.primary
                        )
                        
                        Spacer(modifier = Modifier.width(12.dp))
                        
                        Column {
                            Text(
                                text = "${report.student.firstName} ${report.student.lastName}",
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.Medium,
                                color = MaterialTheme.colorScheme.onSurface
                            )
                            Text(
                                text = report.student.email,
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            Text(
                                text = stringResource(R.string.student_number, report.student.studentNumber),
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }
                }
            }
            }
            
            // Actions
            item {
            Card {
                CardHeader(
                    title = stringResource(R.string.actions_title),
                    subtitle = stringResource(R.string.actions_desc)
                )
                
                CardContent {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        CustomButton(
                            onClick = onPreviewClick,
                            text = stringResource(R.string.quick_preview),
                            variant = ButtonVariant.OUTLINE,
                            size = ButtonSize.MEDIUM,
                            modifier = Modifier.weight(1f),
                            leadingIcon = {
                                Icon(
                                    Icons.Default.Visibility,
                                    contentDescription = null,
                                    modifier = Modifier.size(16.dp)
                                )
                            }
                        )
                        
                        CustomButton(
                            onClick = onPreviewClick,
                            text = stringResource(R.string.read_full),
                            variant = ButtonVariant.PRIMARY,
                            size = ButtonSize.MEDIUM,
                            modifier = Modifier.weight(1f),
                            leadingIcon = {
                                Icon(
                                    Icons.Default.MenuBook,
                                    contentDescription = null,
                                    modifier = Modifier.size(16.dp)
                                )
                            }
                        )
                    }
                }
            }
            }
        }
    }
}

@Composable
fun ReportPreviewView(
    report: Report,
    onBackClick: () -> Unit,
    onReadFullReport: () -> Unit
) {
    Column(
        modifier = Modifier.fillMaxSize()
    ) {
        // Header with actions
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    IconButton(onClick = onBackClick) {
                        Icon(
                            Icons.Default.ArrowBack,
                            contentDescription = stringResource(R.string.back_button),
                            tint = MaterialTheme.colorScheme.onSurface
                        )
                    }
                    
                    Column {
                        Text(
                            text = report.title,
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                        Text(
                            text = "${report.student.firstName} ${report.student.lastName}",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
                
                CustomButton(
                    onClick = onReadFullReport,
                    text = stringResource(R.string.full_version),
                    variant = ButtonVariant.OUTLINE,
                    size = ButtonSize.SMALL
                )
            }
        }
        
        // Report content
        Card(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 16.dp)
                .padding(bottom = 16.dp)
        ) {
            SelectionContainer {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .verticalScroll(rememberScrollState())
                        .padding(20.dp)
                ) {
                    Text(
                        text = report.content,
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurface,
                        lineHeight = MaterialTheme.typography.bodyMedium.lineHeight
                    )
                }
            }
        }
    }
}

@Composable
fun InfoItem(
    label: String,
    value: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector
) {
    Row(
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            imageVector = icon,
            contentDescription = null,
            modifier = Modifier.size(16.dp),
            tint = MaterialTheme.colorScheme.onSurfaceVariant
        )
        Spacer(modifier = Modifier.width(8.dp))
        Column {
            Text(
                text = label,
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            Text(
                text = value,
                style = MaterialTheme.typography.bodyMedium,
                fontWeight = FontWeight.Medium,
                color = MaterialTheme.colorScheme.onSurface
            )
        }
    }
}