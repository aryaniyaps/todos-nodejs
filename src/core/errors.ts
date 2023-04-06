class ResourceNotFound extends Error {
  constructor(options: { message: string }) {
    super(options.message);
    this.name = "ResourceNotFoundError";
  }
}

export { ResourceNotFound };
