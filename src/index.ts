import { Logger } from 'sitka';
import dotEnv from 'dotenv';
dotEnv.config();

if (!process.env.GITHUB_TOKEN || !process.env.PRIVATE_REPO_TOKEN) {
  throw new Error(
    'Please specify the GITHUB_TOKEN environemtn variable in .env'
  );
}

export class Example {
  /* Private Instance Fields */

  private readonly _logger: Logger;

  /* Constructor */

  constructor() {
    this._logger = Logger.getLogger({ name: this.constructor.name });
  }

  get logger(): Logger {
    return this._logger;
  }

  /* Public Instance Methods */

  public exampleMethod(param: string): string {
    this._logger.debug('Received: ' + param);
    return param;
  }
}
