import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import {
    CreateProjectGroupDto,
    UpdateProjectGroupDto,
} from "./dto/project-group.dto";

@Injectable()
export class ProjectGroupsService {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: CreateProjectGroupDto) {
        return this.prisma.projectGroup.create({
            data,
        });
    }

    async update(projectGroupId: string, data: UpdateProjectGroupDto) {
        return this.prisma.projectGroup.update({
            where: {
                id: projectGroupId,
            },
            data,
        });
    }

    async delete(projectGroupId: string) {
        return this.prisma.projectGroup.delete({
            where: {
                id: projectGroupId,
            },
        });
    }
}
