package com.myges.teacher.ui.screens.deliverables

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
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
import com.myges.teacher.data.model.Deliverable
import com.myges.teacher.data.model.DeliverableSubmission
import com.myges.teacher.data.model.SubmissionStatus
import com.myges.teacher.R
import kotlinx.coroutines.launch
import java.time.format.DateTimeFormatter

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DeliverablesScreen(
    onNavigateBack: () -> Unit
) {
    var selectedDeliverable by remember { mutableStateOf<Deliverable?>(null) }
    val toastState = rememberToastState()
    val scope = rememberCoroutineScope()

    Box(modifier = Modifier.fillMaxSize()) {
        Column(modifier = Modifier.fillMaxSize()) {
            TopAppBar(
                title = { 
                    Text(
                        text = stringResource(R.string.deliverables_title),
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
            
            if (selectedDeliverable == null) {
                DeliverablesListView(
                    deliverables = MockData.deliverables,
                    onDeliverableClick = { selectedDeliverable = it }
                )
            } else {
                DeliverableDetailView(
                    deliverable = selectedDeliverable!!,
                    onBackClick = { selectedDeliverable = null },
                    onDownloadFile = { submission ->
                        scope.launch {
                            toastState.showSuccess("Fichier ${submission.fileName} téléchargé avec succès")
                        }
                    }
                )
            }
        }
        
        ToastHost(
            toastState = toastState,
            modifier = Modifier.align(Alignment.TopCenter)
        )
    }
}

@Composable
fun DeliverablesListView(
    deliverables: List<Deliverable>,
    onDeliverableClick: (Deliverable) -> Unit
) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Text(
                text = stringResource(R.string.deliverables_management),
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onBackground
            )
            Text(
                text = stringResource(R.string.deliverables_management_desc),
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
        
        items(deliverables) { deliverable ->
            DeliverableListCard(
                deliverable = deliverable,
                onClick = { onDeliverableClick(deliverable) }
            )
        }
    }
}

@Composable
fun DeliverableListCard(
    deliverable: Deliverable,
    onClick: () -> Unit
) {
    val project = MockData.projects.find { it.id == deliverable.projectId }
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
                        text = deliverable.title,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.SemiBold,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    
                    if (project != null) {
                        Text(
                            text = project.title,
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
                
                StatusBadge(
                    count = deliverable.submissions.size,
                    total = MockData.students.size
                )
            }
            
            Spacer(modifier = Modifier.height(12.dp))
            
            Text(
                text = deliverable.description,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                maxLines = 2
            )
            
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
                        text = stringResource(R.string.due_date_format, deliverable.dueDate.format(formatter)),
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
fun StatusBadge(count: Int, total: Int) {
    val percentage = if (total > 0) (count * 100) / total else 0
    val (color, text) = when {
        percentage >= 90 -> Color(0xFF22C55E) to "$count/$total"
        percentage >= 70 -> Color(0xFFF59E0B) to "$count/$total"
        percentage >= 50 -> Color(0xFFEF4444) to "$count/$total"
        else -> MaterialTheme.colorScheme.outline to "$count/$total"
    }
    
    Surface(
        color = color.copy(alpha = 0.1f),
        shape = RoundedCornerShape(12.dp),
        modifier = Modifier.padding(4.dp)
    ) {
        Text(
            text = text,
            style = MaterialTheme.typography.labelSmall,
            color = color,
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
            fontWeight = FontWeight.Medium
        )
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DeliverableDetailView(
    deliverable: Deliverable,
    onBackClick: () -> Unit,
    onDownloadFile: (DeliverableSubmission) -> Unit
) {
    val formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy à HH:mm")
    
    Column(modifier = Modifier.fillMaxSize()) {
        TopAppBar(
            title = { 
                Text(
                    text = stringResource(R.string.deliverable_details),
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
            // Deliverable information
            item {
                Card {
                    CardHeader(
                        title = deliverable.title,
                        subtitle = MockData.projects.find { it.id == deliverable.projectId }?.title ?: stringResource(R.string.unknown_project)
                    )
                    
                    CardContent {
                        Text(
                            text = deliverable.description,
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                        
                        Spacer(modifier = Modifier.height(16.dp))
                        
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            InfoItem(
                                label = stringResource(R.string.due_date),
                                value = deliverable.dueDate.format(formatter),
                                icon = Icons.Default.Schedule
                            )
                            InfoItem(
                                label = stringResource(R.string.max_size),
                                value = "${deliverable.maxFileSize / 1_000_000} MB",
                                icon = Icons.Default.CloudUpload
                            )
                        }
                        
                        Spacer(modifier = Modifier.height(8.dp))
                        
                        Text(
                            text = stringResource(R.string.allowed_extensions, deliverable.allowedExtensions.joinToString(", ")),
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }
            
            // Statistics
            item {
                Card {
                    CardHeader(
                        title = stringResource(R.string.statistics_title),
                        subtitle = stringResource(R.string.submission_status)
                    )
                    
                    CardContent {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceEvenly
                        ) {
                            StatItem(
                                value = "${deliverable.submissions.size}",
                                label = stringResource(R.string.submissions_label),
                                icon = Icons.Default.Upload
                            )
                            StatItem(
                                value = "${MockData.students.size - deliverable.submissions.size}",
                                label = stringResource(R.string.pending_label),
                                icon = Icons.Default.Pending
                            )
                            StatItem(
                                value = "${deliverable.submissions.count { it.status == SubmissionStatus.GRADED }}",
                                label = stringResource(R.string.evaluated_label),
                                icon = Icons.Default.Grade
                            )
                        }
                    }
                }
            }
            
            // Submissions list
            item {
                Card {
                    CardHeader(
                        title = stringResource(R.string.submissions_count_title, deliverable.submissions.size),
                        subtitle = stringResource(R.string.submissions_desc)
                    )
                    
                    CardContent {
                        if (deliverable.submissions.isEmpty()) {
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(32.dp),
                                horizontalAlignment = Alignment.CenterHorizontally
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Assignment,
                                    contentDescription = null,
                                    modifier = Modifier.size(48.dp),
                                    tint = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                                Spacer(modifier = Modifier.height(16.dp))
                                Text(
                                    text = stringResource(R.string.no_submissions),
                                    style = MaterialTheme.typography.bodyMedium,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                        } else {
                            Column(
                                verticalArrangement = Arrangement.spacedBy(12.dp)
                            ) {
                                deliverable.submissions.forEach { submission ->
                                    SubmissionItem(
                                        submission = submission,
                                        onDownload = { onDownloadFile(submission) }
                                    )
                                }
                            }
                        }
                    }
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

@Composable
fun StatItem(
    value: String,
    label: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector
) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Icon(
            imageVector = icon,
            contentDescription = null,
            modifier = Modifier.size(24.dp),
            tint = MaterialTheme.colorScheme.primary
        )
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = value,
            style = MaterialTheme.typography.titleLarge,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.onSurface
        )
        Text(
            text = label,
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
    }
}

@Composable
fun SubmissionItem(
    submission: DeliverableSubmission,
    onDownload: () -> Unit
) {
    val formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")
    
    Card(
        elevation = 0.dp,
        border = null
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(
                modifier = Modifier.weight(1f),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Default.InsertDriveFile,
                    contentDescription = null,
                    modifier = Modifier.size(20.dp),
                    tint = MaterialTheme.colorScheme.primary
                )
                
                Spacer(modifier = Modifier.width(12.dp))
                
                Column {
                    Text(
                        text = "${submission.student.firstName} ${submission.student.lastName}",
                        style = MaterialTheme.typography.bodyMedium,
                        fontWeight = FontWeight.Medium,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    Text(
                        text = submission.fileName,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Text(
                        text = stringResource(R.string.submitted_on, submission.submittedAt.format(formatter)),
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
            
            Row(
                verticalAlignment = Alignment.CenterVertically
            ) {
                SubmissionStatusBadge(status = submission.status)
                
                Spacer(modifier = Modifier.width(8.dp))
                
                CustomButton(
                    onClick = onDownload,
                    text = stringResource(R.string.download_button),
                    variant = ButtonVariant.OUTLINE,
                    size = ButtonSize.SMALL
                )
            }
        }
    }
}

@Composable
fun SubmissionStatusBadge(status: SubmissionStatus) {
    val (color, text) = when (status) {
        SubmissionStatus.SUBMITTED -> Color(0xFF3B82F6) to stringResource(R.string.status_submitted)
        SubmissionStatus.GRADED -> Color(0xFF22C55E) to stringResource(R.string.status_evaluated)
        SubmissionStatus.LATE -> Color(0xFFEF4444) to stringResource(R.string.status_late)
        SubmissionStatus.PENDING -> Color(0xFFF59E0B) to stringResource(R.string.status_pending)
    }
    
    Surface(
        color = color.copy(alpha = 0.1f),
        shape = RoundedCornerShape(8.dp)
    ) {
        Text(
            text = text,
            style = MaterialTheme.typography.labelSmall,
            color = color,
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
            fontWeight = FontWeight.Medium
        )
    }
}