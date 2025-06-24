import {
    CreateProjectGroupStudent,
    DeleteProjectGroupStudent,
    ProjectGroupStudent,
} from "@/types/ProjectGroupStudent";
import { Api } from "../api/Api";

const PROJECT_GROUP_STUDENT_PATH = "project-group-students";

export class ProjectGroupStudentService {
    private api: Api;

    constructor({ api = new Api() }: { api?: Api } = {}) {
        this.api = api;
    }

    async create(data: CreateProjectGroupStudent) {
        return this.api.request<ProjectGroupStudent>({
            path: PROJECT_GROUP_STUDENT_PATH,
            method: "POST",
            data,
        });
    }

    async delete(data: DeleteProjectGroupStudent) {
        return this.api.request<ProjectGroupStudent>({
            path: PROJECT_GROUP_STUDENT_PATH,
            method: "DELETE",
            data,
        });
    }
}
