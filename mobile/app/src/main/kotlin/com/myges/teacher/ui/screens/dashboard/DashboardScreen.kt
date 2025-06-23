package com.myges.teacher.ui.screens.dashboard

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.res.stringResource
import com.myges.teacher.ui.components.Card
import com.myges.teacher.ui.components.CardHeader
import com.myges.teacher.ui.components.CardContent
import com.myges.teacher.data.model.MockData
import com.myges.teacher.R

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DashboardScreen(
    onNavigateToDeliverables: () -> Unit,
    onNavigateToReports: () -> Unit,
    onNavigateToGrading: () -> Unit,
    onLogout: () -> Unit
) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(24.dp)
    ) {
        item {
            Column {
                Text(
                    text = stringResource(R.string.dashboard_title),
                    style = MaterialTheme.typography.headlineLarge,
                    fontWeight = FontWeight.Black,
                    color = MaterialTheme.colorScheme.onBackground
                )
                
                Spacer(modifier = Modifier.height(4.dp))
                
                Text(
                    text = stringResource(R.string.dashboard_welcome),
                    style = MaterialTheme.typography.bodyLarge,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
        
        // Quick statistics
        item {
            QuickStatsSection()
        }
        
        // Quick actions
        item {
            QuickActionsSection(
                onNavigateToDeliverables = onNavigateToDeliverables,
                onNavigateToReports = onNavigateToReports,
                onNavigateToGrading = onNavigateToGrading,
                onLogout = onLogout
            )
        }
        
        // Recent activity
        item {
            RecentActivitySection()
        }
        
        // Upcoming deliverables
        item {
            UpcomingDeliverablesSection()
        }
    }
}

@Composable
fun QuickStatsSection() {
    Card {
        CardHeader(
            title = stringResource(R.string.overview_title),
            subtitle = stringResource(R.string.overview_subtitle)
        )
        
        CardContent {
            LazyVerticalGrid(
                columns = GridCells.Fixed(2),
                horizontalArrangement = Arrangement.spacedBy(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp),
                modifier = Modifier.height(120.dp)
            ) {
                items(getQuickStats()) { stat ->
                    StatCard(
                        value = stat.value,
                        label = stat.label,
                        icon = stat.icon
                    )
                }
            }
        }
    }
}

@Composable
fun StatCard(
    value: String,
    label: String,
    icon: ImageVector
) {
    Card(
        elevation = 0.dp,
        border = null
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.padding(12.dp)
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
}

@Composable
fun QuickActionsSection(
    onNavigateToDeliverables: () -> Unit,
    onNavigateToReports: () -> Unit,
    onNavigateToGrading: () -> Unit,
    onLogout: () -> Unit
) {
    Card {
        CardHeader(
            title = stringResource(R.string.quick_actions_title),
            subtitle = stringResource(R.string.quick_actions_subtitle)
        )
        
        CardContent {
            Column(
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                // First row
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    QuickActionCard(
                        title = stringResource(R.string.deliverables_action),
                        description = stringResource(R.string.deliverables_description),
                        icon = Icons.Default.Assignment,
                        onClick = onNavigateToDeliverables,
                        modifier = Modifier.weight(1f)
                    )
                    QuickActionCard(
                        title = stringResource(R.string.reports_action),
                        description = stringResource(R.string.reports_description),
                        icon = Icons.Default.Description,
                        onClick = onNavigateToReports,
                        modifier = Modifier.weight(1f)
                    )
                }
                
                // Second row
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    QuickActionCard(
                        title = stringResource(R.string.grading_action),
                        description = stringResource(R.string.grading_description),
                        icon = Icons.Default.Grade,
                        onClick = onNavigateToGrading,
                        modifier = Modifier.weight(1f)
                    )
                    QuickActionCard(
                        title = stringResource(R.string.logout_action),
                        description = stringResource(R.string.logout_description),
                        icon = Icons.Default.Logout,
                        onClick = onLogout,
                        modifier = Modifier.weight(1f)
                    )
                }
            }
        }
    }
}

@Composable
fun QuickActionCard(
    title: String,
    description: String,
    icon: ImageVector,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier
            .fillMaxWidth()
            .clickable { onClick() }
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalAlignment = Alignment.Start
        ) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                modifier = Modifier.size(32.dp),
                tint = MaterialTheme.colorScheme.primary
            )
            
            Spacer(modifier = Modifier.height(12.dp))
            
            Text(
                text = title,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.SemiBold,
                color = MaterialTheme.colorScheme.onSurface
            )
            
            Text(
                text = description,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}

@Composable
fun RecentActivitySection() {
    Card {
        CardHeader(
            title = stringResource(R.string.recent_activity_title),
            subtitle = stringResource(R.string.recent_activity_subtitle)
        )
        
        CardContent {
            Column(
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                getRecentActivities().forEach { activity ->
                    ActivityItem(
                        title = activity.title,
                        description = activity.description,
                        time = activity.time,
                        icon = activity.icon
                    )
                }
            }
        }
    }
}

@Composable
fun ActivityItem(
    title: String,
    description: String,
    time: String,
    icon: ImageVector
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            imageVector = icon,
            contentDescription = null,
            modifier = Modifier.size(20.dp),
            tint = MaterialTheme.colorScheme.onSurfaceVariant
        )
        
        Spacer(modifier = Modifier.width(12.dp))
        
        Column(
            modifier = Modifier.weight(1f)
        ) {
            Text(
                text = title,
                style = MaterialTheme.typography.bodyMedium,
                fontWeight = FontWeight.Medium,
                color = MaterialTheme.colorScheme.onSurface
            )
            Text(
                text = description,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
        
        Text(
            text = time,
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
    }
}

@Composable
fun UpcomingDeliverablesSection() {
    Card {
        CardHeader(
            title = stringResource(R.string.upcoming_deadlines_title),
            subtitle = stringResource(R.string.upcoming_deadlines_subtitle)
        )
        
        CardContent {
            Column(
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                MockData.deliverables.take(3).forEach { deliverable ->
                    DeliverableItem(
                        title = deliverable.title,
                        project = MockData.projects.find { it.id == deliverable.projectId }?.title ?: stringResource(R.string.unknown_project),
                        dueDate = deliverable.dueDate.dayOfMonth.toString() + "/" + deliverable.dueDate.monthValue + "/" + deliverable.dueDate.year,
                        submissions = deliverable.submissions.size
                    )
                }
            }
        }
    }
}

@Composable
fun DeliverableItem(
    title: String,
    project: String,
    dueDate: String,
    submissions: Int
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            imageVector = Icons.Default.Assignment,
            contentDescription = null,
            modifier = Modifier.size(20.dp),
            tint = MaterialTheme.colorScheme.primary
        )
        
        Spacer(modifier = Modifier.width(12.dp))
        
        Column(
            modifier = Modifier.weight(1f)
        ) {
            Text(
                text = title,
                style = MaterialTheme.typography.bodyMedium,
                fontWeight = FontWeight.Medium,
                color = MaterialTheme.colorScheme.onSurface
            )
            Text(
                text = project,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
        
        Column(
            horizontalAlignment = Alignment.End
        ) {
            Text(
                text = dueDate,
                style = MaterialTheme.typography.bodySmall,
                fontWeight = FontWeight.Medium,
                color = MaterialTheme.colorScheme.onSurface
            )
            Text(
                text = stringResource(R.string.submissions_count, submissions),
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}

data class QuickStat(
    val value: String,
    val label: String,
    val icon: ImageVector
)

data class QuickAction(
    val title: String,
    val description: String,
    val icon: ImageVector,
    val onClick: () -> Unit
)

data class RecentActivity(
    val title: String,
    val description: String,
    val time: String,
    val icon: ImageVector
)

fun getQuickStats(): List<QuickStat> {
    return listOf(
        QuickStat(
            value = "${MockData.students.size}",
            label = "Étudiants",
            icon = Icons.Default.People
        ),
        QuickStat(
            value = "${MockData.deliverables.size}",
            label = "Livrables",
            icon = Icons.Default.Assignment
        ),
        QuickStat(
            value = "${MockData.deliverables.sumOf { it.submissions.size }}",
            label = "Remises",
            icon = Icons.Default.CloudUpload
        ),
        QuickStat(
            value = "${MockData.reports.size}",
            label = "Rapports",
            icon = Icons.Default.Description
        )
    )
}

fun getQuickActions(
    onNavigateToDeliverables: () -> Unit,
    onNavigateToReports: () -> Unit,
    onNavigateToGrading: () -> Unit
): List<QuickAction> {
    return listOf(
        QuickAction(
            title = "Deliverables",
            description = "Manage submissions",
            icon = Icons.Default.Assignment,
            onClick = onNavigateToDeliverables
        ),
        QuickAction(
            title = "Reports",
            description = "Read reports",
            icon = Icons.Default.Description,
            onClick = onNavigateToReports
        ),
        QuickAction(
            title = "Grading",
            description = "Evaluate work",
            icon = Icons.Default.Grade,
            onClick = onNavigateToGrading
        ),
        QuickAction(
            title = "Statistics",
            description = "View performance",
            icon = Icons.Default.Analytics,
            onClick = { /* TODO */ }
        )
    )
}

fun getRecentActivities(): List<RecentActivity> {
    return listOf(
        RecentActivity(
            title = "Nouvelle remise",
            description = "Marie Dupont a remis ses spécifications",
            time = "il y a 2h",
            icon = Icons.Default.CloudUpload
        ),
        RecentActivity(
            title = "Rapport évalué",
            description = "Rapport de Jean Martin marqué comme lu",
            time = "il y a 5h",
            icon = Icons.Default.CheckCircle
        ),
        RecentActivity(
            title = "Nouvelle note",
            description = "Sophie Durand a reçu sa note de projet",
            time = "Hier",
            icon = Icons.Default.Grade
        )
    )
}