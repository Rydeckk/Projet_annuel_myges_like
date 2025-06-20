# MyGES Teacher - Mobile Application

[![Android](https://img.shields.io/badge/Android-3DDC84?style=for-the-badge&logo=android&logoColor=white)](https://developer.android.com/)
[![Kotlin](https://img.shields.io/badge/Kotlin-0095D5?&style=for-the-badge&logo=kotlin&logoColor=white)](https://kotlinlang.org/)
[![Jetpack Compose](https://img.shields.io/badge/Jetpack%20Compose-4285F4?style=for-the-badge&logo=jetpackcompose&logoColor=white)](https://developer.android.com/jetpack/compose)

Android mobile application developed in Kotlin with Jetpack Compose for MyGES teachers, providing streamlined access to student deliverables, reports, and grading tools.

## Features

- **Modern UI/UX**: Material 3 design with shadcn/ui inspired components
- **Deliverables Management**: View and manage student submissions with download capabilities  
- **Reports Reading**: Access and review student project reports with full-text reading interface
- **Grading System**: Complete evaluation interface with criteria-based grading
- **Authentication**: Support for institutional login and SSO integration
- **Dark Mode**: Automatic theme switching support

## Architecture

- **Language**: Kotlin with Java 17 target
- **UI Framework**: Jetpack Compose with Material 3
- **Architecture Pattern**: MVVM with Hilt dependency injection
- **Navigation**: Navigation Compose for screen transitions  
- **Networking**: Retrofit + OkHttp for API communication
- **Storage**: DataStore for preferences and JWT token storage
- **Design System**: Custom shadcn/ui inspired component library

## 📁 Project Structure

```
app/src/main/kotlin/com/myges/teacher/
├── MainActivity.kt                    # Main activity entry point
├── MyGesTeacherApplication.kt         # Application class with Hilt setup
├── navigation/                        # Navigation configuration
│   └── MyGesNavigation.kt            # Screen routing and navigation
├── ui/
│   ├── theme/                        # Material 3 theme configuration
│   │   ├── Color.kt                  # Color palette (shadcn inspired)
│   │   ├── Theme.kt                  # Theme setup and switching
│   │   └── Type.kt                   # Typography definitions
│   ├── screens/                      # Application screens
│   │   ├── auth/                     # Authentication flow
│   │   │   └── LoginScreen.kt        # Login interface
│   │   ├── dashboard/                # Main dashboard
│   │   │   └── DashboardScreen.kt    # Overview and quick actions
│   │   ├── deliverables/             # Deliverables management
│   │   │   └── DeliverablesScreen.kt # Submissions tracking
│   │   ├── reports/                  # Reports reading
│   │   │   └── ReportsScreen.kt      # Report viewer interface
│   │   └── grading/                  # Evaluation system
│   │       └── GradingScreen.kt      # Grading interface
│   └── components/                   # Reusable UI components
│       ├── Button.kt                 # Custom button variants
│       ├── Card.kt                   # Card components
│       └── Toast.kt                  # Toast notification system
├── data/                            # Data layer
│   └── model/                       # Data models and mock data
│       └── MockData.kt              # Comprehensive test data
└── di/                             # Dependency injection modules
```

## Screen Overview

### Authentication (`LoginScreen`)
- Clean login interface with email/password fields
- Institutional login support for SSO integration
- Form validation with Material 3 components
- Responsive design for various screen sizes

### Dashboard (`DashboardScreen`)  
- Quick statistics overview with visual cards
- Fast access actions in organized grid layout
- Recent activity feed with real-time updates
- Upcoming deadlines tracking
- Logout functionality with proper session management

### Deliverables (`DeliverablesScreen`)
- Comprehensive list view with submission status indicators
- Detailed view for each deliverable with metadata
- File download capabilities with progress feedback
- Statistics dashboard showing submission rates
- Status badges (Submitted, Graded, Late, Pending)

### Reports (`ReportsScreen`)
- Student reports list with reading status
- Full-text report viewer with selectable content
- Quick preview and detailed reading modes
- Status management (Draft, Submitted, Reviewed)
- Student information integration

### Grading (`GradingScreen`)
- Three-level navigation: Projects → Students → Individual Evaluation
- Criteria-based grading system with weighted scores
- Real-time grade calculation and letter grade assignment
- Comment support for detailed feedback
- Progress tracking across student evaluations

## 🛠️ Development Commands

```bash
# Build the application
./gradlew build

# Install on device/emulator  
./gradlew installDebug

# Run tests
./gradlew test

# Generate debug APK
./gradlew assembleDebug

# Generate release APK
./gradlew assembleRelease

# Clean build
./gradlew clean
```

## Configuration

### Prerequisites
- **Android SDK**: API level 24+ (Android 7.0)
- **Java**: Version 17 or higher
- **Gradle**: 8.14.2 or compatible version

### Environment Setup
1. Clone the repository
2. Configure Android SDK path in `local.properties`
3. Sync project dependencies
4. Run on emulator or physical device

### API Configuration
Configure the backend API URL in the application for full functionality:
```kotlin
// In your configuration
const val API_BASE_URL = "https://your-api-endpoint.com"
```

## Design System

The application follows a custom design system inspired by shadcn/ui:

- **Color Palette**: Carefully crafted contrast ratios for accessibility
- **Typography**: Material 3 typography scale with custom weights
- **Components**: Reusable component library with consistent styling
- **Spacing**: 8dp grid system for consistent layout
- **Elevation**: Material 3 elevation system with subtle shadows

## Testing

The application includes comprehensive mock data for testing:
- 8 sample students with realistic information
- 2 complete projects with deliverables  
- 3 deliverables with various submission states
- 2 detailed reports with full content
- Complete grading criteria and evaluation data

## Next Steps

### Immediate Priorities
1. **API Integration**: Connect screens with existing NestJS backend
2. **Authentication**: Implement JWT and SSO authentication flow
3. **Local Storage**: Add offline capabilities and data caching
4. **Notifications**: Implement push notifications for updates
