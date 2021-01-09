import { Logger } from 'sitka';
import { UserApi } from '../api/UserApi';

export class ContributorLoader {
  protected api: UserApi;
  protected logger: Logger;

  constructor(protected contributor: string) {
    this.logger = Logger.getLogger({ name: this.constructor.name });
    this.api = new UserApi(contributor);
  }

  public getRecentlyUpdatedRepos() {
    this.logger.debug('Loading repos for user', { user: this.contributor });
    return this.api.loadUserReposFirstPage();
  }
}
