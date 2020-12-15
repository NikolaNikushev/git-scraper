import { Api } from './api';

describe('Example class', () => {
  it('should create an instance using its constructor', async () => {
    const api = new Api();
    const reposSpy = jest
      .spyOn(api.api.repos, 'get')
      .mockImplementationOnce(() => {
        return Promise.resolve({} as any);
      });

    const owner = 'nikolanikushev';
    const repo = 'git-scraper';
    await api.loadRepo(owner, repo);
    expect(reposSpy).toHaveBeenCalledWith({ owner, repo });
  });

  it('should load the project repo', async () => {
    const api = new Api();
    const owner = 'NikolaNikushev';
    const repoName = 'git-scraper';
    const reposSpy = jest.spyOn(api.api.repos, 'get');

    const repo = await api.loadRepo(owner, repoName);

    expect(repo.owner?.login).toEqual(owner);
    expect(repo.html_url).toEqual(`https://github.com/${owner}/${repoName}`);
    expect(reposSpy).toHaveBeenCalled();
  });
});
