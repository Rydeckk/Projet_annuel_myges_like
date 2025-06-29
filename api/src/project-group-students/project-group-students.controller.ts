import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Post,
    SerializeOptions,
} from "@nestjs/common";
import { ProjectGroupStudentsService } from "./project-group-students.service";
import {
    CreateProjectGroupStudentDto,
    DeleteProjectGroupStudentDto,
} from "./dto/project-group-student.dto";
import { ProjectGroupStudentEntity } from "./entities/project-group-student.entity";

@Controller("project-group-students")
export class ProjectGroupStudentsController {
    constructor(
        private readonly projectGroupStudentsService: ProjectGroupStudentsService,
    ) {}

    @Post()
    @SerializeOptions({ type: ProjectGroupStudentEntity })
    async create(
        @Body()
        {
            studentId,
            projectGroupId,
            promotionProjectId,
        }: CreateProjectGroupStudentDto,
    ) {
        const foundStudentGroup =
            await this.projectGroupStudentsService.findFirst({
                where: {
                    studentId,
                    projectGroup: {
                        promotionProjectId,
                    },
                },
                include: {
                    student: {
                        include: {
                            user: true,
                        },
                    },
                },
            });

        if (foundStudentGroup) {
            const { student } = foundStudentGroup;
            throw new BadRequestException(
                `Student ${student.user.firstName} ${student.user.lastName} already have a group`,
            );
        }

        return this.projectGroupStudentsService.create({
            studentId,
            projectGroupId,
        });
    }

    @Delete()
    @SerializeOptions({ type: ProjectGroupStudentEntity })
    async delete(
        @Body() deleteProjectGroupStudentDto: DeleteProjectGroupStudentDto,
    ) {
        return this.projectGroupStudentsService.delete(
            deleteProjectGroupStudentDto,
        );
    }
}
