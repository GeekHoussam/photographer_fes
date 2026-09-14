export class AdminError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(code: string, status = 400) {
    super(code);
    this.code = code;
    this.status = status;
  }
}
