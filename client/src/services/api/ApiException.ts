export class ApiException extends Error {
  status?: number;

  constructor(data: { message: string; statusCode?: number }) {
    super();
    this.message = data.message;
    this.status = data.statusCode;
  }
}
