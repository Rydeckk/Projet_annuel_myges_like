package com.myges.teacher.data.model

import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

/**
 * Data models and mock data for the MyGES Teacher mobile application.
 * 
 * This file contains all the data classes representing the core entities
 * of the educational platform, along with comprehensive mock data for
 * development and testing purposes.
 */

/**
 * Represents a student in the educational platform.
 * 
 * @property id Unique identifier for the student
 * @property firstName Student's first name
 * @property lastName Student's last name  
 * @property email Student's email address
 * @property studentNumber Academic identification number
 */
data class Student(
    val id: String,
    val firstName: String,
    val lastName: String,
    val email: String,
    val studentNumber: String
)

data class Project(
    val id: String,
    val title: String,
    val description: String,
    val startDate: LocalDateTime,
    val endDate: LocalDateTime,
    val promotionId: String
)

data class Deliverable(
    val id: String,
    val projectId: String,
    val title: String,
    val description: String,
    val dueDate: LocalDateTime,
    val maxFileSize: Long,
    val allowedExtensions: List<String>,
    val submissions: List<DeliverableSubmission>
)

data class DeliverableSubmission(
    val id: String,
    val deliverableId: String,
    val studentId: String,
    val student: Student,
    val fileName: String,
    val fileSize: Long,
    val fileUrl: String,
    val submittedAt: LocalDateTime,
    val status: SubmissionStatus
)

enum class SubmissionStatus {
    SUBMITTED, GRADED, LATE, PENDING
}

data class Report(
    val id: String,
    val studentId: String,
    val student: Student,
    val projectId: String,
    val project: Project,
    val title: String,
    val content: String,
    val createdAt: LocalDateTime,
    val status: ReportStatus
)

enum class ReportStatus {
    DRAFT, SUBMITTED, REVIEWED
}

data class GradingCriteria(
    val id: String,
    val name: String,
    val description: String,
    val maxPoints: Int,
    val weight: Double
)

data class Grade(
    val id: String,
    val submissionId: String,
    val criteriaId: String,
    val points: Int,
    val comment: String,
    val gradedAt: LocalDateTime
)

data class GradingGrid(
    val id: String,
    val projectId: String,
    val criteria: List<GradingCriteria>,
    val maxTotalPoints: Int
)

data class StudentGrade(
    val student: Student,
    val submission: DeliverableSubmission?,
    val grades: List<Grade>,
    val totalPoints: Int,
    val percentage: Double,
    val letterGrade: String
)

/**
 * Mock data provider for the MyGES Teacher application.
 * 
 * This object provides realistic test data for development and demonstration
 * purposes, including students, projects, deliverables, reports, and grading data.
 */
object MockData {
    /** Date formatter for consistent date display throughout the application */
    private val formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")
    
    val students = listOf(
        Student("1", "Emily", "Johnson", "emily.johnson@example.com", "2024001"),
        Student("2", "Michael", "Smith", "michael.smith@example.com", "2024002"),
        Student("3", "Sarah", "Wilson", "sarah.wilson@example.com", "2024003"),
        Student("4", "David", "Brown", "david.brown@example.com", "2024004"),
        Student("5", "Jessica", "Davis", "jessica.davis@example.com", "2024005"),
        Student("6", "Daniel", "Miller", "daniel.miller@example.com", "2024006"),
        Student("7", "Ashley", "Taylor", "ashley.taylor@example.com", "2024007"),
        Student("8", "Christopher", "Anderson", "christopher.anderson@example.com", "2024008")
    )

    val projects = listOf(
        Project(
            "1",
            "E-commerce Web Application",
            "Development of a complete e-commerce web application with React, Node.js and MongoDB",
            LocalDateTime.now().minusDays(30),
            LocalDateTime.now().plusDays(45),
            "promo-2024"
        ),
        Project(
            "2",
            "REST API Microservices",
            "Design and development of a microservices architecture with Spring Boot and Docker",
            LocalDateTime.now().minusDays(20),
            LocalDateTime.now().plusDays(55),
            "promo-2024"
        )
    )

    val deliverables = listOf(
        Deliverable(
            "1",
            "1",
            "Requirements Specification",
            "Document detailing the functional and technical specifications of the project",
            LocalDateTime.now().plusDays(7),
            5_000_000, // 5MB
            listOf("pdf", "doc", "docx"),
            listOf(
                DeliverableSubmission(
                    "1", "1", "1", students[0],
                    "requirements_specification_ecommerce.pdf", 2_500_000,
                    "https://example.com/files/requirements_specification_ecommerce.pdf",
                    LocalDateTime.now().minusDays(2), SubmissionStatus.SUBMITTED
                ),
                DeliverableSubmission(
                    "2", "1", "2", students[1],
                    "project_specifications.pdf", 3_200_000,
                    "https://example.com/files/project_specifications.pdf",
                    LocalDateTime.now().minusDays(1), SubmissionStatus.SUBMITTED
                ),
                DeliverableSubmission(
                    "3", "1", "3", students[2],
                    "requirements_specification_v2.pdf", 1_800_000,
                    "https://example.com/files/requirements_specification_v2.pdf",
                    LocalDateTime.now().minusHours(5), SubmissionStatus.SUBMITTED
                )
            )
        ),
        Deliverable(
            "2",
            "1",
            "UI/UX Mockups",
            "High-fidelity user interface mockups with interactive prototypes",
            LocalDateTime.now().plusDays(14),
            10_000_000, // 10MB
            listOf("pdf", "fig", "xd", "sketch"),
            listOf(
                DeliverableSubmission(
                    "4", "2", "4", students[3],
                    "ecommerce_mockups.pdf", 8_500_000,
                    "https://example.com/files/ecommerce_mockups.pdf",
                    LocalDateTime.now().minusHours(3), SubmissionStatus.SUBMITTED
                )
            )
        ),
        Deliverable(
            "3",
            "2",
            "API Documentation",
            "Complete REST API documentation with usage examples",
            LocalDateTime.now().plusDays(21),
            3_000_000, // 3MB
            listOf("pdf", "md", "html"),
            emptyList()
        )
    )

    val reports = listOf(
        Report(
            "1", "1", students[0], "1", projects[0],
            "Design Report - E-commerce Application",
            """
            # Rapport de Conception - Application E-commerce
            
            ## 1. Introduction
            
            Ce rapport présente la conception détaillée de l'application e-commerce développée dans le cadre du projet de fin d'études. L'application vise à offrir une expérience utilisateur moderne et intuitive pour l'achat en ligne.
            
            ## 2. Architecture Technique
            
            ### 2.1 Stack Technologique
            - **Frontend**: React 18 avec TypeScript
            - **Backend**: Node.js avec Express.js
            - **Base de données**: MongoDB
            - **Authentification**: JWT avec refresh tokens
            - **Paiement**: Intégration Stripe
            
            ### 2.2 Architecture Microservices
            L'application est structurée en plusieurs services indépendants :
            - Service d'authentification
            - Service de gestion des produits
            - Service de commandes
            - Service de paiement
            - Service de notifications
            
            ## 3. Fonctionnalités Principales
            
            ### 3.1 Gestion des Utilisateurs
            - Inscription et connexion
            - Profil utilisateur
            - Historique des commandes
            - Liste de souhaits
            
            ### 3.2 Catalogue Produits
            - Affichage des produits avec filtres
            - Recherche avancée
            - Système de catégories
            - Recommandations personnalisées
            
            ### 3.3 Processus de Commande
            - Panier d'achat persistant
            - Calcul automatique des frais de port
            - Multiples options de paiement
            - Suivi de commande en temps réel
            
            ## 4. Sécurité
            
            ### 4.1 Authentification
            - Tokens JWT avec expiration
            - Refresh tokens sécurisés
            - Validation côté serveur
            
            ### 4.2 Protection des Données
            - Chiffrement des mots de passe avec bcrypt
            - Validation des entrées utilisateur
            - Protection CSRF
            - Rate limiting
            
            ## 5. Tests et Qualité
            
            ### 5.1 Tests Unitaires
            - Couverture de code > 80%
            - Tests Jest pour le frontend
            - Tests Mocha/Chai pour le backend
            
            ### 5.2 Tests d'Intégration
            - Tests end-to-end avec Cypress
            - Tests d'API avec Postman
            
            ## 6. Déploiement
            
            ### 6.1 Containerisation
            - Docker pour tous les services
            - Docker Compose pour le développement
            - Kubernetes pour la production
            
            ### 6.2 CI/CD
            - Pipeline GitHub Actions
            - Tests automatisés
            - Déploiement automatique
            
            ## 7. Performances
            
            ### 7.1 Optimisations Frontend
            - Lazy loading des composants
            - Mise en cache des images
            - Compression des assets
            
            ### 7.2 Optimisations Backend
            - Mise en cache Redis
            - Indexation MongoDB
            - Optimisation des requêtes
            
            ## 8. Conclusion
            
            L'application e-commerce développée répond aux exigences modernes en termes de performance, sécurité et expérience utilisateur. L'architecture microservices permet une scalabilité et une maintenance facilitées.
            
            Les prochaines étapes incluent l'ajout de fonctionnalités avancées comme l'intelligence artificielle pour les recommandations et l'intégration de nouveaux moyens de paiement.
            """.trimIndent(),
            LocalDateTime.now().minusDays(3),
            ReportStatus.SUBMITTED
        ),
        Report(
            "2", "2", students[1], "2", projects[1],
            "Rapport Technique - Architecture Microservices",
            """
            # Architecture Microservices - Rapport Technique
            
            ## Résumé Exécutif
            
            Ce rapport détaille l'implémentation d'une architecture microservices robuste utilisant Spring Boot et Docker. L'objectif est de créer un système distribué, scalable et maintenable.
            
            ## 1. Vue d'Ensemble de l'Architecture
            
            ### 1.1 Principes de Conception
            - Découplage des services
            - Responsabilité unique par service
            - Communication asynchrone
            - Tolérance aux pannes
            
            ### 1.2 Technologies Utilisées
            - **Framework**: Spring Boot 3.x
            - **Base de données**: PostgreSQL, MongoDB
            - **Messaging**: Apache Kafka
            - **Containerisation**: Docker & Kubernetes
            - **Monitoring**: Prometheus, Grafana
            - **Tracing**: Zipkin
            
            ## 2. Services Développés
            
            ### 2.1 Service d'Authentification
            - Gestion des utilisateurs et des rôles
            - Génération et validation des tokens JWT
            - Intégration OAuth2
            - Rate limiting pour prévenir les attaques
            
            ### 2.2 Service de Gestion des Produits
            - CRUD complet des produits
            - Gestion des catégories
            - Système de recherche élastique
            - Cache distribué avec Redis
            
            ### 2.3 Service de Commandes
            - Processus de commande complet
            - Gestion des états de commande
            - Intégration avec le service de paiement
            - Saga pattern pour la cohérence des données
            
            ### 2.4 Service de Notification
            - Notifications email et push
            - Templates personnalisables
            - File d'attente pour les envois en masse
            - Métriques de délivrabilité
            
            ## 3. Communication Inter-Services
            
            ### 3.1 API REST
            - Design RESTful cohérent
            - Versioning des APIs
            - Documentation OpenAPI/Swagger
            - Validation des contrats
            
            ### 3.2 Messaging Asynchrone
            - Événements métier avec Kafka
            - Patterns Pub/Sub
            - Garantie de livraison
            - Gestion des erreurs et retry
            
            ## 4. Gestion des Données
            
            ### 4.1 Base de Données par Service
            - Isolation des données
            - Choix technologique adapté
            - Migrations automatisées
            - Stratégies de sauvegarde
            
            ### 4.2 Cohérence des Données
            - Saga pattern
            - Event sourcing
            - CQRS pour les lectures optimisées
            - Eventual consistency
            
            ## 5. Sécurité
            
            ### 5.1 Authentification et Autorisation
            - JWT avec refresh tokens
            - Gestion des rôles et permissions
            - API Gateway pour la centralisation
            - Chiffrement des communications
            
            ### 5.2 Sécurité des Données
            - Chiffrement at-rest et in-transit
            - Audit trail complet
            - Anonymisation des données sensibles
            - Conformité RGPD
            
            ## 6. Monitoring et Observabilité
            
            ### 6.1 Métriques
            - Métriques applicatives (Micrometer)
            - Métriques infrastructure (Prometheus)
            - Dashboards Grafana
            - Alerting automatisé
            
            ### 6.2 Logging et Tracing
            - Logs structurés (JSON)
            - Correlation IDs
            - Distributed tracing (Zipkin)
            - Centralisation des logs (ELK Stack)
            
            ## 7. Déploiement et DevOps
            
            ### 7.1 Containerisation
            - Images Docker optimisées
            - Multi-stage builds
            - Registre Docker privé
            - Scan de sécurité des images
            
            ### 7.2 Orchestration
            - Kubernetes pour la production
            - Helm charts pour le déploiement
            - Auto-scaling horizontal
            - Rolling updates
            
            ### 7.3 CI/CD
            - Pipeline GitLab CI
            - Tests automatisés à tous les niveaux
            - Déploiement bleu-vert
            - Rollback automatique
            
            ## 8. Tests
            
            ### 8.1 Stratégie de Tests
            - Tests unitaires (JUnit 5)
            - Tests d'intégration (TestContainers)
            - Tests de contrat (Pact)
            - Tests de performance (JMeter)
            
            ### 8.2 Qualité du Code
            - Analyse statique (SonarQube)
            - Couverture de code > 85%
            - Reviews de code obligatoires
            - Standards de codage automatisés
            
            ## 9. Performances et Scalabilité
            
            ### 9.1 Optimisations
            - Cache distribué (Redis)
            - Connection pooling
            - Async processing
            - Database indexing
            
            ### 9.2 Scalabilité
            - Horizontal scaling
            - Load balancing
            - Circuit breaker pattern
            - Bulkhead pattern
            
            ## 10. Défis Rencontrés
            
            ### 10.1 Complexité Opérationnelle
            - Multiplication des services à maintenir
            - Debugging distribué complexe
            - Gestion des versions des APIs
            
            ### 10.2 Solutions Apportées
            - Automation maximale
            - Tooling de debugging avancé
            - Stratégies de versioning strictes
            
            ## 11. Conclusion
            
            L'architecture microservices implémentée offre une flexibilité et une scalabilité exceptionnelles. Les patterns et technologies choisis permettent de gérer efficacement la complexité inhérente aux systèmes distribués.
            
            ## 12. Perspectives d'Évolution
            
            - Intégration de l'intelligence artificielle
            - Passage au serverless pour certains services
            - Amélioration continue des performances
            - Extension de la couverture de tests
            """.trimIndent(),
            LocalDateTime.now().minusDays(5),
            ReportStatus.REVIEWED
        )
    )

    val gradingCriteria = listOf(
        GradingCriteria("1", "Code Quality", "Following best practices, readability, structure", 20, 0.25),
        GradingCriteria("2", "Functionality", "Complete implementation of required features", 25, 0.30),
        GradingCriteria("3", "Documentation", "Quality of technical and user documentation", 15, 0.20),
        GradingCriteria("4", "Testing", "Coverage and quality of unit and integration tests", 15, 0.15),
        GradingCriteria("5", "Innovation", "Creativity and innovative technical solutions", 10, 0.10)
    )

    val gradingGrid = GradingGrid(
        "1", "1", gradingCriteria, 85
    )

    val grades = listOf(
        Grade("1", "1", "1", 18, "Well-structured code following best practices", LocalDateTime.now().minusDays(1)),
        Grade("2", "1", "2", 22, "All functionalities are correctly implemented", LocalDateTime.now().minusDays(1)),
        Grade("3", "1", "3", 13, "Complete documentation but could be more detailed", LocalDateTime.now().minusDays(1)),
        Grade("4", "1", "4", 12, "Good test coverage, some edge cases missing", LocalDateTime.now().minusDays(1)),
        Grade("5", "1", "5", 8, "Creative approach for the recommendation system", LocalDateTime.now().minusDays(1))
    )

    fun getStudentGrades(): List<StudentGrade> {
        return listOf(
            StudentGrade(
                students[0],
                deliverables[0].submissions[0],
                grades,
                73,
                85.9,
                "A"
            ),
            StudentGrade(
                students[1],
                deliverables[0].submissions[1],
                emptyList(),
                0,
                0.0,
                "Not graded"
            ),
            StudentGrade(
                students[2],
                deliverables[0].submissions[2],
                emptyList(),
                0,
                0.0,
                "Not graded"
            ),
            StudentGrade(
                students[3],
                null,
                emptyList(),
                0,
                0.0,
                "Not submitted"
            )
        )
    }
}