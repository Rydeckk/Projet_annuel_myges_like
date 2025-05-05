-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('STUDENT', 'TEACHER');

-- CreateEnum
CREATE TYPE "ProjectVisibility" AS ENUM ('DRAFT', 'VISIBLE');

-- CreateEnum
CREATE TYPE "ProjectGroupRule" AS ENUM ('MANUAL', 'RANDOM', 'FREE');

-- CreateEnum
CREATE TYPE "RuleType" AS ENUM ('MAX_SIZE_FILE', 'FILE_PRESENCE', 'FILE_CONTENT_MATCH');

-- CreateEnum
CREATE TYPE "MatchType" AS ENUM ('TEXT', 'REGEX');

-- CreateEnum
CREATE TYPE "RatingScope" AS ENUM ('DELIVERABLE', 'REPORT', 'DEFENSE');

-- CreateEnum
CREATE TYPE "RatingGroupScope" AS ENUM ('INDIVIDIAL', 'GROUP');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email" (
    "email" TEXT NOT NULL,
    "sso_provider" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "student" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teacher" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promotion" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_teacher_id" TEXT NOT NULL,

    CONSTRAINT "promotion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promotion_student" (
    "student_id" TEXT NOT NULL,
    "promotion_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "promotion_student_pkey" PRIMARY KEY ("student_id","promotion_id")
);

-- CreateTable
CREATE TABLE "project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "file_name" TEXT,
    "path" TEXT,
    "file_size" INTEGER,
    "project_visibility" "ProjectVisibility" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_teacher_id" TEXT NOT NULL,

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promotion_project" (
    "id" TEXT NOT NULL,
    "min_per_group" INTEGER NOT NULL,
    "max_per_group" INTEGER NOT NULL,
    "malus" INTEGER,
    "malus_per_time" TIMESTAMP(3),
    "allow_late_submission" BOOLEAN NOT NULL,
    "project_group_rume" "ProjectGroupRule" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "promotion_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,

    CONSTRAINT "promotion_project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_group" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "promotion_project_id" TEXT NOT NULL,

    CONSTRAINT "project_group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_group_student" (
    "project_group_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_group_student_pkey" PRIMARY KEY ("project_group_id","student_id")
);

-- CreateTable
CREATE TABLE "report" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "project_group_id" TEXT NOT NULL,

    CONSTRAINT "report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "defense" (
    "id" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "duration" TIMESTAMP(3) NOT NULL,
    "passage_order" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "project_group_id" TEXT NOT NULL,

    CONSTRAINT "defense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deliverable" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "descritpion" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "project_group_id" TEXT NOT NULL,
    "uploaded_by_student_id" TEXT NOT NULL,

    CONSTRAINT "deliverable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deliverable_archive" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deliverable_id" TEXT NOT NULL,

    CONSTRAINT "deliverable_archive_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deliverable_rule" (
    "id" TEXT NOT NULL,
    "rule_type" "RuleType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "deliverable_rule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promotion_project_deliverable_rule" (
    "promotion_project_id" TEXT NOT NULL,
    "deliverable_rule_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "promotion_project_deliverable_rule_pkey" PRIMARY KEY ("deliverable_rule_id","promotion_project_id")
);

-- CreateTable
CREATE TABLE "rule_max_size_file" (
    "id" TEXT NOT NULL,
    "max_size" INTEGER NOT NULL,
    "deliverable_rule_id" TEXT NOT NULL,

    CONSTRAINT "rule_max_size_file_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rule_rile_presence" (
    "id" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "deliverable_rule_id" TEXT NOT NULL,

    CONSTRAINT "rule_rile_presence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rule_file_content_match" (
    "id" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "match" TEXT NOT NULL,
    "match_type" "MatchType" NOT NULL,
    "deliverable_rule_id" TEXT NOT NULL,

    CONSTRAINT "rule_file_content_match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_group_result" (
    "id" TEXT NOT NULL,
    "is_submitted_in_time" BOOLEAN NOT NULL,
    "similarity_rate" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "project_group_id" TEXT NOT NULL,

    CONSTRAINT "project_group_result_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deliverable_rule_result" (
    "id" TEXT NOT NULL,
    "is_rule_respected" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "project_group_result_id" TEXT NOT NULL,
    "deliverable_rule_id" TEXT NOT NULL,

    CONSTRAINT "deliverable_rule_result_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rating_result" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rating_scale_criteria_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,

    CONSTRAINT "rating_result_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rating_scale" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "rating_scope" "RatingScope" NOT NULL,
    "rating_group_scope" "RatingGroupScope" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rating_scale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rating_scale_criteria" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "weight" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rating_scale_id" TEXT NOT NULL,

    CONSTRAINT "rating_scale_criteria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promotion_project_rating_scale" (
    "promotion_project_id" TEXT NOT NULL,
    "rating_scale_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "promotion_project_rating_scale_pkey" PRIMARY KEY ("promotion_project_id","rating_scale_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "email_email_key" ON "email"("email");

-- CreateIndex
CREATE UNIQUE INDEX "student_user_id_key" ON "student"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "teacher_user_id_key" ON "teacher"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "promotion_project_promotion_id_project_id_key" ON "promotion_project"("promotion_id", "project_id");

-- CreateIndex
CREATE UNIQUE INDEX "report_project_group_id_key" ON "report"("project_group_id");

-- CreateIndex
CREATE UNIQUE INDEX "defense_project_group_id_key" ON "defense"("project_group_id");

-- CreateIndex
CREATE UNIQUE INDEX "deliverable_archive_deliverable_id_key" ON "deliverable_archive"("deliverable_id");

-- CreateIndex
CREATE UNIQUE INDEX "rule_max_size_file_deliverable_rule_id_key" ON "rule_max_size_file"("deliverable_rule_id");

-- CreateIndex
CREATE UNIQUE INDEX "rule_rile_presence_deliverable_rule_id_key" ON "rule_rile_presence"("deliverable_rule_id");

-- CreateIndex
CREATE UNIQUE INDEX "rule_file_content_match_deliverable_rule_id_key" ON "rule_file_content_match"("deliverable_rule_id");

-- CreateIndex
CREATE UNIQUE INDEX "project_group_result_project_group_id_key" ON "project_group_result"("project_group_id");

-- CreateIndex
CREATE UNIQUE INDEX "deliverable_rule_result_project_group_result_id_deliverable_key" ON "deliverable_rule_result"("project_group_result_id", "deliverable_rule_id");

-- AddForeignKey
ALTER TABLE "email" ADD CONSTRAINT "email_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher" ADD CONSTRAINT "teacher_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion" ADD CONSTRAINT "promotion_created_by_teacher_id_fkey" FOREIGN KEY ("created_by_teacher_id") REFERENCES "teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_student" ADD CONSTRAINT "promotion_student_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_student" ADD CONSTRAINT "promotion_student_promotion_id_fkey" FOREIGN KEY ("promotion_id") REFERENCES "promotion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_created_by_teacher_id_fkey" FOREIGN KEY ("created_by_teacher_id") REFERENCES "teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_project" ADD CONSTRAINT "promotion_project_promotion_id_fkey" FOREIGN KEY ("promotion_id") REFERENCES "promotion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_project" ADD CONSTRAINT "promotion_project_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_group" ADD CONSTRAINT "project_group_promotion_project_id_fkey" FOREIGN KEY ("promotion_project_id") REFERENCES "promotion_project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_group_student" ADD CONSTRAINT "project_group_student_project_group_id_fkey" FOREIGN KEY ("project_group_id") REFERENCES "project_group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_group_student" ADD CONSTRAINT "project_group_student_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report" ADD CONSTRAINT "report_project_group_id_fkey" FOREIGN KEY ("project_group_id") REFERENCES "project_group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "defense" ADD CONSTRAINT "defense_project_group_id_fkey" FOREIGN KEY ("project_group_id") REFERENCES "project_group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deliverable" ADD CONSTRAINT "deliverable_project_group_id_fkey" FOREIGN KEY ("project_group_id") REFERENCES "project_group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deliverable" ADD CONSTRAINT "deliverable_uploaded_by_student_id_fkey" FOREIGN KEY ("uploaded_by_student_id") REFERENCES "student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deliverable_archive" ADD CONSTRAINT "deliverable_archive_deliverable_id_fkey" FOREIGN KEY ("deliverable_id") REFERENCES "deliverable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_project_deliverable_rule" ADD CONSTRAINT "promotion_project_deliverable_rule_promotion_project_id_fkey" FOREIGN KEY ("promotion_project_id") REFERENCES "promotion_project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_project_deliverable_rule" ADD CONSTRAINT "promotion_project_deliverable_rule_deliverable_rule_id_fkey" FOREIGN KEY ("deliverable_rule_id") REFERENCES "deliverable_rule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rule_max_size_file" ADD CONSTRAINT "rule_max_size_file_deliverable_rule_id_fkey" FOREIGN KEY ("deliverable_rule_id") REFERENCES "deliverable_rule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rule_rile_presence" ADD CONSTRAINT "rule_rile_presence_deliverable_rule_id_fkey" FOREIGN KEY ("deliverable_rule_id") REFERENCES "deliverable_rule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rule_file_content_match" ADD CONSTRAINT "rule_file_content_match_deliverable_rule_id_fkey" FOREIGN KEY ("deliverable_rule_id") REFERENCES "deliverable_rule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_group_result" ADD CONSTRAINT "project_group_result_project_group_id_fkey" FOREIGN KEY ("project_group_id") REFERENCES "project_group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deliverable_rule_result" ADD CONSTRAINT "deliverable_rule_result_project_group_result_id_fkey" FOREIGN KEY ("project_group_result_id") REFERENCES "project_group_result"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deliverable_rule_result" ADD CONSTRAINT "deliverable_rule_result_deliverable_rule_id_fkey" FOREIGN KEY ("deliverable_rule_id") REFERENCES "deliverable_rule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rating_result" ADD CONSTRAINT "rating_result_rating_scale_criteria_id_fkey" FOREIGN KEY ("rating_scale_criteria_id") REFERENCES "rating_scale_criteria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rating_result" ADD CONSTRAINT "rating_result_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rating_scale_criteria" ADD CONSTRAINT "rating_scale_criteria_rating_scale_id_fkey" FOREIGN KEY ("rating_scale_id") REFERENCES "rating_scale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_project_rating_scale" ADD CONSTRAINT "promotion_project_rating_scale_promotion_project_id_fkey" FOREIGN KEY ("promotion_project_id") REFERENCES "promotion_project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_project_rating_scale" ADD CONSTRAINT "promotion_project_rating_scale_rating_scale_id_fkey" FOREIGN KEY ("rating_scale_id") REFERENCES "rating_scale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
