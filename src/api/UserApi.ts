import { Api } from './Api';

export class UserApi extends Api {
  constructor(private user: string) {
    super();
  }

  /**
   * Returns the repos sorted by last updated activity and the user is a member of or is the owner.
   */
  public loadUserReposFirstPage() {
    return this.api.repos.listForUser({
      type: 'all',
      username: this.user,
      direction: 'desc',
      sort: 'updated',
      per_page: 10,
    });
  }
}
