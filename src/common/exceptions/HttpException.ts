class HttpException extends Error {
  public status: number;
  public message: any;
  constructor(message, status) {
    super(message);
    this.status = status;
    this.message = message;
  }
}

export default HttpException;
