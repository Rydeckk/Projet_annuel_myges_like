package com.myges.teacher.ui.screens.grading

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.res.stringResource
import com.myges.teacher.ui.components.*
import com.myges.teacher.data.model.MockData
import com.myges.teacher.data.model.StudentGrade
import com.myges.teacher.data.model.GradingCriteria
import com.myges.teacher.data.model.Grade
import com.myges.teacher.R
import kotlinx.coroutines.launch

enum class GradingView {
    LIST, GRID, STUDENT_GRADING
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun GradingScreen(
    onNavigateBack: () -> Unit
) {
    var currentView by remember { mutableStateOf(GradingView.LIST) }
    var selectedStudent by remember { mutableStateOf<StudentGrade?>(null) }
    val toastState = rememberToastState()
    val scope = rememberCoroutineScope()

    Box(modifier = Modifier.fillMaxSize()) {
        Column(modifier = Modifier.fillMaxSize()) {
            TopAppBar(
                title = { 
                    Text(
                        text = when (currentView) {
                            GradingView.LIST -> stringResource(R.string.grading_title)
                            GradingView.GRID -> stringResource(R.string.grading_grid)
                            GradingView.STUDENT_GRADING -> stringResource(R.string.student_evaluation)
                        },
                        fontWeight = FontWeight.Bold
                    ) 
                },
                navigationIcon = {
                    IconButton(onClick = {
                        when (currentView) {
                            GradingView.LIST -> onNavigateBack()
                            GradingView.GRID -> currentView = GradingView.LIST
                            GradingView.STUDENT_GRADING -> currentView = GradingView.GRID
                        }
                    }) {
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
            
            when (currentView) {
                GradingView.LIST -> {
                    GradingProjectsView(
                        onViewGrid = { currentView = GradingView.GRID }
                    )
                }
                GradingView.GRID -> {
                    GradingGridView(
                        students = MockData.getStudentGrades(),
                        criteria = MockData.gradingCriteria,
                        onGradeStudent = { student ->
                            selectedStudent = student
                            currentView = GradingView.STUDENT_GRADING
                        }
                    )
                }
                GradingView.STUDENT_GRADING -> {
                    selectedStudent?.let { student ->
                        StudentGradingView(
                            student = student,
                            criteria = MockData.gradingCriteria,
                            onSaveGrades = { grades ->
                                scope.launch {
                                    toastState.showSuccess("Notes sauvegardées pour ${student.student.firstName} ${student.student.lastName}")
                                    currentView = GradingView.GRID
                                }
                            }
                        )
                    }
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
fun GradingProjectsView(
    onViewGrid: () -> Unit
) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Text(
                text = stringResource(R.string.grade_management),
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onBackground
            )
            Text(
                text = stringResource(R.string.grade_management_desc),
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
        
        items(MockData.projects) { project ->
            ProjectGradingCard(
                project = project,
                onViewGrid = onViewGrid
            )
        }
    }
}

@Composable
fun ProjectGradingCard(
    project: com.myges.teacher.data.model.Project,
    onViewGrid: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onViewGrid() }
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
                        text = project.title,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.SemiBold,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    
                    Text(
                        text = project.description,
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        maxLines = 2
                    )
                }
                
                ProjectStatusBadge(
                    gradedCount = MockData.getStudentGrades().count { it.grades.isNotEmpty() },
                    totalCount = MockData.students.size
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
                    Icon(
                        imageVector = Icons.Default.People,
                        contentDescription = null,
                        modifier = Modifier.size(16.dp),
                        tint = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = stringResource(R.string.students_count_project, MockData.students.size),
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                
                Row(
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = Icons.Default.Assignment,
                        contentDescription = null,
                        modifier = Modifier.size(16.dp),
                        tint = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = stringResource(R.string.criteria_count, MockData.gradingCriteria.size),
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
fun ProjectStatusBadge(gradedCount: Int, totalCount: Int) {
    val percentage = if (totalCount > 0) (gradedCount * 100) / totalCount else 0
    val (color, text) = when {
        percentage == 100 -> Color(0xFF22C55E) to stringResource(R.string.status_completed)
        percentage >= 50 -> Color(0xFFF59E0B) to stringResource(R.string.status_in_progress)
        percentage > 0 -> Color(0xFF3B82F6) to stringResource(R.string.status_started)
        else -> MaterialTheme.colorScheme.outline to stringResource(R.string.status_todo)
    }
    
    Surface(
        color = color.copy(alpha = 0.1f),
        shape = RoundedCornerShape(12.dp),
        modifier = Modifier.padding(4.dp)
    ) {
        Text(
            text = "$text ($gradedCount/$totalCount)",
            style = MaterialTheme.typography.labelSmall,
            color = color,
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
            fontWeight = FontWeight.Medium
        )
    }
}

@Composable
fun GradingGridView(
    students: List<StudentGrade>,
    criteria: List<GradingCriteria>,
    onGradeStudent: (StudentGrade) -> Unit
) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Text(
                text = stringResource(R.string.grading_grid),
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onBackground
            )
            Text(
                text = stringResource(R.string.project_label, MockData.projects.first().title),
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
        
        // Grading criteria
        item {
            Card {
                CardHeader(
                    title = stringResource(R.string.evaluation_criteria),
                    subtitle = stringResource(R.string.scale_points, MockData.gradingGrid.maxTotalPoints)
                )
                
                CardContent {
                    Column(
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        criteria.forEach { criterion ->
                            CriterionCard(criterion = criterion)
                        }
                    }
                }
            }
        }
        
        // Students list
        item {
            Card {
                CardHeader(
                    title = stringResource(R.string.students_count_grid, students.size),
                    subtitle = stringResource(R.string.students_grid_desc)
                )
                
                CardContent {
                    Column(
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        students.forEach { studentGrade ->
                            StudentGradeRow(
                                studentGrade = studentGrade,
                                onClick = { onGradeStudent(studentGrade) }
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun CriterionCard(criterion: GradingCriteria) {
    Card(
        elevation = 0.dp,
        border = null
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = criterion.name,
                    style = MaterialTheme.typography.bodyMedium,
                    fontWeight = FontWeight.Medium,
                    color = MaterialTheme.colorScheme.onSurface
                )
                Text(
                    text = criterion.description,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
            
            Surface(
                color = MaterialTheme.colorScheme.primary.copy(alpha = 0.1f),
                shape = RoundedCornerShape(8.dp)
            ) {
                Text(
                    text = stringResource(R.string.points_label, criterion.maxPoints),
                    style = MaterialTheme.typography.labelMedium,
                    color = MaterialTheme.colorScheme.primary,
                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                    fontWeight = FontWeight.Bold
                )
            }
        }
    }
}

@Composable
fun StudentGradeRow(
    studentGrade: StudentGrade,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() },
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
                    imageVector = Icons.Default.Person,
                    contentDescription = null,
                    modifier = Modifier.size(20.dp),
                    tint = MaterialTheme.colorScheme.primary
                )
                
                Spacer(modifier = Modifier.width(12.dp))
                
                Column {
                    Text(
                        text = "${studentGrade.student.firstName} ${studentGrade.student.lastName}",
                        style = MaterialTheme.typography.bodyMedium,
                        fontWeight = FontWeight.Medium,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    Text(
                        text = studentGrade.student.email,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
            
            Row(
                verticalAlignment = Alignment.CenterVertically
            ) {
                if (studentGrade.grades.isNotEmpty()) {
                    Surface(
                        color = Color(0xFF22C55E).copy(alpha = 0.1f),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Text(
                            text = "${studentGrade.totalPoints}/${MockData.gradingGrid.maxTotalPoints}",
                            style = MaterialTheme.typography.labelMedium,
                            color = Color(0xFF22C55E),
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                            fontWeight = FontWeight.Bold
                        )
                    }
                    
                    Spacer(modifier = Modifier.width(8.dp))
                    
                    Text(
                        text = studentGrade.letterGrade,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                } else {
                    Surface(
                        color = MaterialTheme.colorScheme.outline.copy(alpha = 0.1f),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Text(
                            text = stringResource(R.string.not_graded),
                            style = MaterialTheme.typography.labelMedium,
                            color = MaterialTheme.colorScheme.outline,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                        )
                    }
                }
                
                Spacer(modifier = Modifier.width(8.dp))
                
                Icon(
                    imageVector = Icons.Default.ChevronRight,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun StudentGradingView(
    student: StudentGrade,
    criteria: List<GradingCriteria>,
    onSaveGrades: (List<Grade>) -> Unit
) {
    var grades by remember { 
        mutableStateOf(
            criteria.map { criterion ->
                student.grades.find { it.criteriaId == criterion.id }?.points?.toString() ?: ""
            }
        )
    }
    var comments by remember {
        mutableStateOf(
            criteria.map { criterion ->
                student.grades.find { it.criteriaId == criterion.id }?.comment ?: ""
            }
        )
    }
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Student header
        Card {
            CardHeader(
                title = "${student.student.firstName} ${student.student.lastName}",
                subtitle = "N° ${student.student.studentNumber} • ${student.student.email}"
            )
            
            CardContent {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = stringResource(R.string.project_label, MockData.projects.first().title),
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    
                    if (student.grades.isNotEmpty()) {
                        Text(
                            text = stringResource(R.string.current_grade, student.letterGrade),
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.primary
                        )
                    }
                }
            }
        }
        
        // Evaluation criteria
        criteria.forEachIndexed { index, criterion ->
            Card {
                CardHeader(
                    title = criterion.name,
                    subtitle = "${criterion.description} \u2022 ${criterion.maxPoints} points max"
                )
                
                CardContent {
                    Column(
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        OutlinedTextField(
                            value = grades[index],
                            onValueChange = { newValue ->
                                if (newValue.isEmpty() || (newValue.toIntOrNull()?.let { it >= 0 && it <= criterion.maxPoints } == true)) {
                                    grades = grades.toMutableList().apply { this[index] = newValue }
                                }
                            },
                            label = { Text(stringResource(R.string.grade_out_of, criterion.maxPoints)) },
                            placeholder = { Text("0") },
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                            modifier = Modifier.fillMaxWidth(),
                            singleLine = true,
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = MaterialTheme.colorScheme.primary,
                                unfocusedBorderColor = MaterialTheme.colorScheme.outline
                            )
                        )
                        
                        OutlinedTextField(
                            value = comments[index],
                            onValueChange = { newValue ->
                                comments = comments.toMutableList().apply { this[index] = newValue }
                            },
                            label = { Text(stringResource(R.string.comment_optional)) },
                            placeholder = { Text(stringResource(R.string.add_remarks)) },
                            modifier = Modifier.fillMaxWidth(),
                            minLines = 2,
                            maxLines = 4,
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = MaterialTheme.colorScheme.primary,
                                unfocusedBorderColor = MaterialTheme.colorScheme.outline
                            )
                        )
                    }
                }
            }
        }
        
        // Summary and actions
        Card {
            CardHeader(
                title = stringResource(R.string.evaluation_summary),
                subtitle = stringResource(R.string.check_grades_before_save)
            )
            
            CardContent {
                val totalPoints = grades.mapIndexedNotNull { index, grade ->
                    grade.toIntOrNull()
                }.sum()
                val maxPoints = criteria.sumOf { it.maxPoints }
                val percentage = if (maxPoints > 0) (totalPoints * 100) / maxPoints else 0
                
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = stringResource(R.string.total_points, totalPoints, maxPoints),
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                        Text(
                            text = stringResource(R.string.percentage_label, percentage),
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                    
                    Surface(
                        color = when {
                            percentage >= 90 -> Color(0xFF22C55E)
                            percentage >= 70 -> Color(0xFFF59E0B)
                            percentage >= 50 -> Color(0xFF3B82F6)
                            else -> Color(0xFFEF4444)
                        }.copy(alpha = 0.1f),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Text(
                            text = when {
                                percentage >= 90 -> "A"
                                percentage >= 80 -> "B"
                                percentage >= 70 -> "C"
                                percentage >= 60 -> "D"
                                percentage >= 50 -> "E"
                                else -> "F"
                            },
                            style = MaterialTheme.typography.titleLarge,
                            color = when {
                                percentage >= 90 -> Color(0xFF22C55E)
                                percentage >= 70 -> Color(0xFFF59E0B)
                                percentage >= 50 -> Color(0xFF3B82F6)
                                else -> Color(0xFFEF4444)
                            },
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
                        )
                    }
                }
                
                Spacer(modifier = Modifier.height(16.dp))
                
                CustomButton(
                    onClick = {
                        val gradesList = grades.mapIndexedNotNull { index, gradeStr ->
                            gradeStr.toIntOrNull()?.let { points ->
                                Grade(
                                    id = "grade_${student.student.id}_${criteria[index].id}",
                                    submissionId = student.submission?.id ?: "",
                                    criteriaId = criteria[index].id,
                                    points = points,
                                    comment = comments[index],
                                    gradedAt = java.time.LocalDateTime.now()
                                )
                            }
                        }
                        onSaveGrades(gradesList)
                    },
                    text = stringResource(R.string.save_grades),
                    variant = ButtonVariant.PRIMARY,
                    size = ButtonSize.LARGE,
                    modifier = Modifier.fillMaxWidth(),
                    enabled = grades.any { it.isNotEmpty() && it.toIntOrNull() != null }
                )
            }
        }
    }
}