import { Octokit } from '@octokit/rest';

import { retry } from '@octokit/plugin-retry';
import { throttling } from '@octokit/plugin-throttling';
import { envVariables } from './loadEnv';

const CustomOctokit = Octokit.plugin(retry, throttling);

export const customOctokit = new CustomOctokit({
  auth: envVariables.GITHUB_TOKEN,
  userAgent: 'git-scraper',
  throttle: {
    onRateLimit: (
      retryAfter: number,
      options: { method: string; url: string; request: { retryCount: number } }
    ) => {
      customOctokit.log.warn(
        `Request quota exhausted for request ${options.method} ${options.url}`
      );

      if (options.request.retryCount === 0) {
        // only retries once
        customOctokit.log.info(`Retrying after ${retryAfter} seconds!`);
        return true;
      }
      return false;
    },
    onAbuseLimit: (
      retryAfter: number,
      options: { method: string; url: string }
    ) => {
      // does not retry, only logs a warning
      customOctokit.log.warn(
        `Abuse detected for request ${options.method} ${options.url}`
      );
    },
  },
  retry: {
    doNotRetry: ['429'],
  },
});
