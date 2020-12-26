import { Api } from './api';

describe('Example class', () => {
  it('should create an instance using its constructor', async () => {
    const owner = 'nikolanikushev';
    const repo = 'git-scraper';
    const api = new Api(owner, repo, new Date());
    const reposSpy = jest
      .spyOn(api.api.repos, 'get')
      .mockImplementationOnce(() => {
        return Promise.resolve({} as any);
      });

    await api.loadRepo();
    expect(reposSpy).toHaveBeenCalledWith({ owner, repo });
  });

  it('should load the project repo', async () => {
    const owner = 'NikolaNikushev';
    const repoName = 'git-scraper';
    const api = new Api(owner, repoName, new Date());
    const reposSpy = jest.spyOn(api.api.repos, 'get');

    const repo = await api.loadRepo();

    expect(repo.owner?.login).toEqual(owner);
    expect(repo.html_url).toEqual(`https://github.com/${owner}/${repoName}`);
    expect(reposSpy).toHaveBeenCalled();
  });
});
