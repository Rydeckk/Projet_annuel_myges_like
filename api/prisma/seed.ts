import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean database
  await prisma.ratingResult.deleteMany();
  await prisma.deliverableRuleResult.deleteMany();
  await prisma.projectGroupResult.deleteMany();
  await prisma.defense.deleteMany();
  await prisma.report.deleteMany();
  await prisma.reportSection.deleteMany();
  await prisma.deliverableArchive.deleteMany();
  await prisma.deliverable.deleteMany();
  await prisma.projectGroupStudent.deleteMany();
  await prisma.projectGroup.deleteMany();
  await prisma.promotionProjectRatingScale.deleteMany();
  await prisma.ratingScaleCriteria.deleteMany();
  await prisma.ratingScale.deleteMany();
  await prisma.promotionProjectDeliverableRule.deleteMany();
  await prisma.ruleFileContentMatch.deleteMany();
  await prisma.ruleFilePresence.deleteMany();
  await prisma.ruleMaxSizeFile.deleteMany();
  await prisma.deliverableRule.deleteMany();
  await prisma.promotionProject.deleteMany();
  await prisma.project.deleteMany();
  await prisma.promotionStudent.deleteMany();
  await prisma.promotion.deleteMany();
  await prisma.authProvider.deleteMany();
  await prisma.student.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Database cleaned');

  // Create teachers
  const teacher1 = await prisma.user.create({
    data: {
      firstName: 'Marie',
      lastName: 'Dupont',
      email: 'marie.dupont@school.com',
      password: await bcrypt.hash('password123', 10),
      role: 'TEACHER',
      teacher: {
        create: {}
      }
    },
    include: { teacher: true }
  });

  const teacher2 = await prisma.user.create({
    data: {
      firstName: 'Jean',
      lastName: 'Martin',
      email: 'jean.martin@school.com',
      password: await bcrypt.hash('password123', 10),
      role: 'TEACHER',
      teacher: {
        create: {}
      }
    },
    include: { teacher: true }
  });

  console.log('✅ Created 2 teachers');

  // Create students
  const students = await Promise.all([
    prisma.user.create({
      data: {
        firstName: 'Alice',
        lastName: 'Dubois',
        email: 'alice.dubois@student.com',
        password: await bcrypt.hash('password123', 10),
        role: 'STUDENT',
        student: {
          create: {}
        }
      },
      include: { student: true }
    }),
    prisma.user.create({
      data: {
        firstName: 'Bob',
        lastName: 'Moreau',
        email: 'bob.moreau@student.com',
        password: await bcrypt.hash('password123', 10),
        role: 'STUDENT',
        student: {
          create: {}
        }
      },
      include: { student: true }
    }),
    prisma.user.create({
      data: {
        firstName: 'Claire',
        lastName: 'Leroy',
        email: 'claire.leroy@student.com',
        password: await bcrypt.hash('password123', 10),
        role: 'STUDENT',
        student: {
          create: {}
        }
      },
      include: { student: true }
    }),
    prisma.user.create({
      data: {
        firstName: 'David',
        lastName: 'Roux',
        email: 'david.roux@student.com',
        password: await bcrypt.hash('password123', 10),
        role: 'STUDENT',
        student: {
          create: {}
        }
      },
      include: { student: true }
    }),
    prisma.user.create({
      data: {
        firstName: 'Emma',
        lastName: 'Bernard',
        email: 'emma.bernard@student.com',
        password: await bcrypt.hash('password123', 10),
        role: 'STUDENT',
        student: {
          create: {}
        }
      },
      include: { student: true }
    }),
    prisma.user.create({
      data: {
        firstName: 'François',
        lastName: 'Petit',
        email: 'francois.petit@student.com',
        password: await bcrypt.hash('password123', 10),
        role: 'STUDENT',
        student: {
          create: {}
        }
      },
      include: { student: true }
    })
  ]);

  console.log('✅ Created 6 students');

  // Create promotions
  const promo2024 = await prisma.promotion.create({
    data: {
      name: 'Bachelor 3 - 2024',
      startDate: new Date('2023-09-01'),
      endDate: new Date('2024-06-30'),
      createdByTeacherId: teacher1.teacher!.id,
      promotionStudents: {
        create: students.slice(0, 4).map(s => ({
          studentId: s.student!.id
        }))
      }
    }
  });

  const promo2025 = await prisma.promotion.create({
    data: {
      name: 'Bachelor 3 - 2025',
      startDate: new Date('2024-09-01'),
      endDate: new Date('2025-06-30'),
      createdByTeacherId: teacher2.teacher!.id,
      promotionStudents: {
        create: students.map(s => ({
          studentId: s.student!.id
        }))
      }
    }
  });

  console.log('✅ Created 2 promotions with students');

  // Create projects
  const projectWeb = await prisma.project.create({
    data: {
      name: 'Développement Web Full Stack',
      description: 'Créer une application web complète avec React et Node.js',
      projectVisibility: 'VISIBLE',
      createdByTeacherId: teacher1.teacher!.id
    }
  });

  const projectMobile = await prisma.project.create({
    data: {
      name: 'Application Mobile',
      description: 'Développer une application mobile cross-platform',
      projectVisibility: 'VISIBLE',
      createdByTeacherId: teacher2.teacher!.id
    }
  });

  const projectIA = await prisma.project.create({
    data: {
      name: 'Intelligence Artificielle',
      description: 'Implémenter un système de recommandation avec ML',
      projectVisibility: 'DRAFT',
      createdByTeacherId: teacher1.teacher!.id
    }
  });

  console.log('✅ Created 3 projects');

  // Create promotion projects
  const promoProjectWeb = await prisma.promotionProject.create({
    data: {
      promotionId: promo2025.id,
      projectId: projectWeb.id,
      description: 'Projet de fin d\'année - Application web complète',
      minPerGroup: 2,
      maxPerGroup: 4,
      projectGroupRule: 'FREE',
      allowLateSubmission: true,
      isReportRequired: true,
      malus: 5,
      malusTimeType: 'DAY',
      startDate: new Date('2025-01-15'),
      endDate: new Date('2025-05-30')
    }
  });

  const promoProjectMobile = await prisma.promotionProject.create({
    data: {
      promotionId: promo2025.id,
      projectId: projectMobile.id,
      description: 'Développement d\'une app mobile innovante',
      minPerGroup: 3,
      maxPerGroup: 5,
      projectGroupRule: 'RANDOM',
      allowLateSubmission: false,
      isReportRequired: true,
      startDate: new Date('2025-02-01'),
      endDate: new Date('2025-04-15')
    }
  });

  console.log('✅ Created promotion projects');

  // Create deliverable rules
  const maxSizeRule = await prisma.deliverableRule.create({
    data: {
      ruleType: 'MAX_SIZE_FILE',
      ruleMaxSizeFile: {
        create: {
          maxSize: 50 * 1024 * 1024 // 50MB
        }
      }
    }
  });

  const readmeRule = await prisma.deliverableRule.create({
    data: {
      ruleType: 'FILE_PRESENCE',
      ruleFilePresence: {
        create: {
          fileName: 'README.md'
        }
      }
    }
  });

  const dockerRule = await prisma.deliverableRule.create({
    data: {
      ruleType: 'FILE_PRESENCE',
      ruleFilePresence: {
        create: {
          fileName: 'docker-compose.yml'
        }
      }
    }
  });

  // Associate rules with promotion projects
  await prisma.promotionProjectDeliverableRule.createMany({
    data: [
      {
        promotionProjectId: promoProjectWeb.id,
        deliverableRuleId: maxSizeRule.id
      },
      {
        promotionProjectId: promoProjectWeb.id,
        deliverableRuleId: readmeRule.id
      },
      {
        promotionProjectId: promoProjectWeb.id,
        deliverableRuleId: dockerRule.id
      },
      {
        promotionProjectId: promoProjectMobile.id,
        deliverableRuleId: maxSizeRule.id
      },
      {
        promotionProjectId: promoProjectMobile.id,
        deliverableRuleId: readmeRule.id
      }
    ]
  });

  console.log('✅ Created deliverable rules');

  // Create rating scales
  const deliverableScale = await prisma.ratingScale.create({
    data: {
      name: 'Évaluation du livrable',
      description: 'Grille d\'évaluation pour les livrables de projet',
      ratingScope: 'DELIVERABLE',
      ratingGroupScope: 'GROUP',
      ratingScaleCriteria: {
        create: [
          {
            name: 'Qualité du code',
            description: 'Propreté, organisation et bonnes pratiques',
            weight: 30
          },
          {
            name: 'Fonctionnalités',
            description: 'Complétude et fonctionnement des features',
            weight: 40
          },
          {
            name: 'Documentation',
            description: 'Qualité de la documentation technique',
            weight: 30
          }
        ]
      }
    }
  });

  const reportScale = await prisma.ratingScale.create({
    data: {
      name: 'Évaluation du rapport',
      description: 'Grille d\'évaluation pour les rapports de projet',
      ratingScope: 'REPORT',
      ratingGroupScope: 'GROUP',
      ratingScaleCriteria: {
        create: [
          {
            name: 'Structure',
            description: 'Organisation et clarté du rapport',
            weight: 25
          },
          {
            name: 'Contenu technique',
            description: 'Précision et pertinence des informations techniques',
            weight: 50
          },
          {
            name: 'Présentation',
            description: 'Mise en forme et lisibilité',
            weight: 25
          }
        ]
      }
    }
  });

  const defenseScale = await prisma.ratingScale.create({
    data: {
      name: 'Évaluation de la soutenance',
      description: 'Grille d\'évaluation pour les soutenances',
      ratingScope: 'DEFENSE',
      ratingGroupScope: 'INDIVIDIAL',
      ratingScaleCriteria: {
        create: [
          {
            name: 'Expression orale',
            description: 'Clarté et fluidité de l\'expression',
            weight: 30
          },
          {
            name: 'Maîtrise technique',
            description: 'Compréhension et explication du projet',
            weight: 40
          },
          {
            name: 'Réponses aux questions',
            description: 'Pertinence des réponses aux questions du jury',
            weight: 30
          }
        ]
      }
    }
  });

  // Associate rating scales with promotion projects
  await prisma.promotionProjectRatingScale.createMany({
    data: [
      {
        promotionProjectId: promoProjectWeb.id,
        ratingScaleId: deliverableScale.id
      },
      {
        promotionProjectId: promoProjectWeb.id,
        ratingScaleId: reportScale.id
      },
      {
        promotionProjectId: promoProjectWeb.id,
        ratingScaleId: defenseScale.id
      },
      {
        promotionProjectId: promoProjectMobile.id,
        ratingScaleId: deliverableScale.id
      },
      {
        promotionProjectId: promoProjectMobile.id,
        ratingScaleId: defenseScale.id
      }
    ]
  });

  console.log('✅ Created rating scales');

  // Create report sections
  await prisma.reportSection.createMany({
    data: [
      {
        title: 'Introduction',
        description: 'Présentation du projet et des objectifs',
        order: 1,
        promotionProjectId: promoProjectWeb.id,
        teacherId: teacher1.teacher!.id
      },
      {
        title: 'Architecture technique',
        description: 'Description de l\'architecture et des choix techniques',
        order: 2,
        promotionProjectId: promoProjectWeb.id,
        teacherId: teacher1.teacher!.id
      },
      {
        title: 'Fonctionnalités implémentées',
        description: 'Liste et description des fonctionnalités développées',
        order: 3,
        promotionProjectId: promoProjectWeb.id,
        teacherId: teacher1.teacher!.id
      },
      {
        title: 'Difficultés rencontrées',
        description: 'Problèmes rencontrés et solutions apportées',
        order: 4,
        promotionProjectId: promoProjectWeb.id,
        teacherId: teacher1.teacher!.id
      },
      {
        title: 'Conclusion',
        description: 'Bilan du projet et perspectives',
        order: 5,
        promotionProjectId: promoProjectWeb.id,
        teacherId: teacher1.teacher!.id
      }
    ]
  });

  console.log('✅ Created report sections');

  // Create project groups
  const group1 = await prisma.projectGroup.create({
    data: {
      name: 'Groupe Alpha',
      promotionProjectId: promoProjectWeb.id,
      projectGroupStudents: {
        create: [
          { studentId: students[0].student!.id },
          { studentId: students[1].student!.id },
          { studentId: students[2].student!.id }
        ]
      }
    }
  });

  const group2 = await prisma.projectGroup.create({
    data: {
      name: 'Groupe Beta',
      promotionProjectId: promoProjectWeb.id,
      projectGroupStudents: {
        create: [
          { studentId: students[3].student!.id },
          { studentId: students[4].student!.id },
          { studentId: students[5].student!.id }
        ]
      }
    }
  });

  console.log('✅ Created 2 project groups');

  // Create a deliverable for group1
  const deliverable = await prisma.deliverable.create({
    data: {
      name: 'Livrable final - v1.0',
      description: 'Version finale de notre application web',
      type: 'ARCHIVE',
      deadline: new Date('2025-08-15T23:59:59.000Z'),
      projectGroupId: group1.id,
      uploadedByStudentId: students[0].student!.id,
      deliverableArchive: {
        create: {
            name: "projet-web-alpha-v1.0.zip",
                    path: "/uploads/2025/projet-web-alpha-v1.0.zip",
          fileSize: 25 * 1024 * 1024 // 25MB
        }
      }
    }
  });

  console.log('✅ Created sample deliverable');

  // Create project group results
  await prisma.projectGroupResult.create({
    data: {
      projectGroupId: group1.id,
      isSubmittedInTime: true,
      similarityRate: 15,
      deliverableRuleResults: {
        create: [
          {
            deliverableRuleId: maxSizeRule.id,
            isRuleRespected: true
          },
          {
            deliverableRuleId: readmeRule.id,
            isRuleRespected: true
          },
          {
            deliverableRuleId: dockerRule.id,
            isRuleRespected: false
          }
        ]
      }
    }
  });

  console.log('✅ Created project results');

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📋 Summary:');
  console.log('- 2 teachers');
  console.log('- 6 students');
  console.log('- 2 promotions');
  console.log('- 3 projects');
  console.log('- 2 project groups');
  console.log('- Multiple rating scales and deliverable rules');
  console.log('\n🔐 Login credentials:');
  console.log('Teachers: marie.dupont@school.com, jean.martin@school.com');
  console.log('Students: alice.dubois@student.com, bob.moreau@student.com, etc.');
  console.log('Password for all: password123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });