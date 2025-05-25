import { Api } from "../api/Api";

const TEACHER_PATH = "teachers";

export class TeacherService {
  api: Api;

  constructor({ api = new Api() }: { api?: Api } = {}) {
    this.api = api;
  }
}
