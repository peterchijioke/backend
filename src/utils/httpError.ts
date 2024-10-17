export class HttpError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message); // Pass the message to the base Error class
    this.status = status;
    this.name = this.constructor.name; // Set the error name to the class name
  }
}
