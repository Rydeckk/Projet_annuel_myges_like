import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreatePromotionDto, UpdatePromotionDto } from "./dto/promotion.dto";
import { Prisma, UserRole } from "@prisma/client";
import { CreatePromotionStudentDto } from "./dto/promotion-student.dto";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { HashService } from "src/services/hash.service";
import { EmailService } from "src/services/email.service";
import { ConfigService } from "@nestjs/config";
import {
    BREVO_TEMPLATE,
    StudentAccountCreationParams,
} from "src/constants/brevo.constant";

@Injectable()
export class PromotionsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly hashService: HashService,
        private readonly emailService: EmailService,
        private readonly configService: ConfigService,
    ) {}

    async create(teacherId: string, data: CreatePromotionDto) {
        return this.prisma.promotion.create({
            data: {
                ...data,
                createdByTeacherId: teacherId,
            },
        });
    }

    async createStudentToPromotion(
        promotionStudents: CreatePromotionStudentDto[],
    ) {
        const studentToCreate: Prisma.Prisma__StudentClient<
            {
                id: string;
                userId: string;
            },
            never,
            DefaultArgs,
            Prisma.PrismaClientOptions
        >[] = [];

        for (const { email, promotionId, ...userData } of promotionStudents) {
            const DEFAULT_PASSWORD = await this.hashService.hashPassword(email);
            // COMMENT for the moment we send mail only for mygeslike@gmail.com user
            if (email === "mygeslike@gmail.com") {
                await this.emailService.sendMail<StudentAccountCreationParams>({
                    name: `${userData.firstName} ${userData.lastName}`,
                    email,
                    params: {
                        NAME: `${userData.firstName} ${userData.lastName}`,
                        EMAIL: email,
                        LOGIN_URL: this.configService.get<string>("apiUrl")!,
                    },
                    templateId: BREVO_TEMPLATE.STUDENT_ACCOUNT_CREATION,
                });
            }

            studentToCreate.push(
                this.prisma.student.create({
                    data: {
                        user: {
                            create: {
                                ...userData,
                                email,
                                password: DEFAULT_PASSWORD,
                                role: UserRole.STUDENT,
                            },
                        },
                        promotionStudents: {
                            createMany: {
                                data: [{ promotionId }],
                            },
                        },
                    },
                }),
            );
        }

        return Promise.all(studentToCreate);
    }

    async findFirst(where: Prisma.PromotionWhereInput) {
        return this.prisma.promotion.findFirst({
            where,
            include: {
                promotionStudents: {
                    include: {
                        student: {
                            include: {
                                user: true,
                            },
                        },
                    },
                },
                promotionProjects: {
                    include: {
                        project: true,
                    },
                },
            },
        });
    }

    async findAll() {
        return this.prisma.promotion.findMany();
    }

    async update({
        promotionId,
        data,
    }: {
        promotionId: string;
        data: UpdatePromotionDto;
    }) {
        return this.prisma.promotion.update({
            where: {
                id: promotionId,
            },
            data,
        });
    }

    async delete(promotionId: string) {
        return this.prisma.promotion.delete({
            where: {
                id: promotionId,
            },
        });
    }
}
