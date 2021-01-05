### [1.5.1](https://github.com/nikolanikushev/git-scraper/compare/v1.5.0...v1.5.1) (2021-01-05)


### Bug Fixes

* Corrected race condition for loading multiple projects ([c89516d](https://github.com/nikolanikushev/git-scraper/commit/c89516d879c6e98944d68715cea50fe04e76cafb))

## [1.5.0](https://github.com/nikolanikushev/git-scraper/compare/v1.4.0...v1.5.0) (2021-01-05)


### Features

* Added option to append output to a single CSV file ([2887ea2](https://github.com/nikolanikushev/git-scraper/commit/2887ea2f97c4075af5d73ee33b5da9cc1bbb92c2))

## [1.4.0](https://github.com/nikolanikushev/git-scraper/compare/v1.3.2...v1.4.0) (2020-12-28)


### Features

* Added CSV for repos ([947b16c](https://github.com/nikolanikushev/git-scraper/commit/947b16c33fc422e059c1257597e336ac3e22a19b))
* Added issueNumber for comment data ([a2887f9](https://github.com/nikolanikushev/git-scraper/commit/a2887f90ac59f3f90b6dc2fa3806695c9ee930f5))
* Added loading of weeks ([ec0fea4](https://github.com/nikolanikushev/git-scraper/commit/ec0fea4d88173945c7314b6d836e51c79ba74027))
* Added pull request number for review ([5c1d6ec](https://github.com/nikolanikushev/git-scraper/commit/5c1d6ec7a21ac59fe72c6967ed9277480c9a538b))
* Skip no commits stats ([d5a7f6a](https://github.com/nikolanikushev/git-scraper/commit/d5a7f6a7fbf2a5f5803ef59713d4a9f567304936))


### Bug Fixes

* Only return contributors that are users ([102d8bd](https://github.com/nikolanikushev/git-scraper/commit/102d8bdcd66829186c9d732f7b57a6c947e0e981))


### Internal

* Updated CSV data to include issue links ([44718fb](https://github.com/nikolanikushev/git-scraper/commit/44718fbc9c28c67ec48badd12e6e94dd1b6c0243))

### [1.3.2](https://github.com/nikolanikushev/git-scraper/compare/v1.3.1...v1.3.2) (2020-12-27)


### Bug Fixes

* Added more time fields and pull request state ([84c13e6](https://github.com/nikolanikushev/git-scraper/commit/84c13e6eb0cb40b791e29695ddafc79e526ecb39))

### [1.3.1](https://github.com/nikolanikushev/git-scraper/compare/v1.3.0...v1.3.1) (2020-12-27)


### Bug Fixes

* Corrected CSV data getting wiped out ([ae478e5](https://github.com/nikolanikushev/git-scraper/commit/ae478e5e2903d3bc97f4cd25a5e1a79940d8a23d))


### Internal

* Updated CSV values ([7cdeec9](https://github.com/nikolanikushev/git-scraper/commit/7cdeec945ff058fe0b9b6b03689bb3b5c8b57670))

## [1.3.0](https://github.com/nikolanikushev/git-scraper/compare/v1.2.0...v1.3.0) (2020-12-27)


### Features

* check if user is not a bot ([eec571f](https://github.com/nikolanikushev/git-scraper/commit/eec571fa21c3a09445af33823b901dbc22fe98e1))
* OUTPUT_FOLDER loaded from .env file ([7f66a8b](https://github.com/nikolanikushev/git-scraper/commit/7f66a8bc484c00f0bb090dc8d03bf60551016200))


### Internal

* Using all issues data instead of single issue data for CSV ([558ee24](https://github.com/nikolanikushev/git-scraper/commit/558ee24177eed345d87c2e8964295fb739260de0))


### Docs

* Updated readme with relevant information ([ca88203](https://github.com/nikolanikushev/git-scraper/commit/ca88203e512ccb961f2564564db7e57eed7631d7))

## [1.2.0](https://github.com/nikolanikushev/git-scraper/compare/v1.1.0...v1.2.0) (2020-12-26)


### Features

* Added loading of reviews and moved issue loading ([054c2f8](https://github.com/nikolanikushev/git-scraper/commit/054c2f82fc542087d0baea115ce1832310ed0a89))
* Added loading of weekly commits to CSV ([2f6bc89](https://github.com/nikolanikushev/git-scraper/commit/2f6bc893a9f26bc52c0c2e02068327d7c4dd671b))
* Added write to csv functionality ([9e9fd17](https://github.com/nikolanikushev/git-scraper/commit/9e9fd17ffcb5c22c27824eacd2f5c1c3b045a07d))
* Print issue data to CSV ([69e4a50](https://github.com/nikolanikushev/git-scraper/commit/69e4a50127ec3ae5d2b0d481c5b8c4884a027515))
* Print issue data to CSV ([cbb5615](https://github.com/nikolanikushev/git-scraper/commit/cbb561547d44ebafb127127f3c1a712141c941c2))


### Internal

* added await for write to csv ([84032a3](https://github.com/nikolanikushev/git-scraper/commit/84032a3577daac3e6bec0a6eac4cef22c6a7b843))
* Moved logic for CSV parsing to the issue loading ([faea9a7](https://github.com/nikolanikushev/git-scraper/commit/faea9a7b61815978e2a26eb5660062daf155c3f0))

## [1.1.0](https://github.com/nikolanikushev/git-scraper/compare/v1.0.0...v1.1.0) (2020-12-26)


### Features

* Added loading of single repo and user activity information ([3f65fd9](https://github.com/nikolanikushev/git-scraper/commit/3f65fd99d70a9d2b166f448a764cb6aee7c7c95d))


### Internal

* **outputs:** Added example output ([ad991af](https://github.com/nikolanikushev/git-scraper/commit/ad991af9e5521fec9a3726430a47e29801fb9e16))
* Added initial load of repo ([c42a0f5](https://github.com/nikolanikushev/git-scraper/commit/c42a0f59b11d7e9b1382d0e98200947e3cd4cb22))
* corrected changelog ([f0c711d](https://github.com/nikolanikushev/git-scraper/commit/f0c711d62a5ff9ea0de01fea5f316b0b5839bd70))
* moved badges ([bf4ed72](https://github.com/nikolanikushev/git-scraper/commit/bf4ed729d6e4675173c0d4c16fe1208a5b70e8dc))
* Moved env loading to loadEnv.ts ([c3baed1](https://github.com/nikolanikushev/git-scraper/commit/c3baed1bda6e79736cf6edc0ed239d9104355671))
* removed 'feature' as commit type ([4b870fa](https://github.com/nikolanikushev/git-scraper/commit/4b870fadc04df440fbc9cc5397852bf0b5e915e4))

## 1.0.0 (2020-12-15)


### Features

* Initial commit ([c4161a6](https://github.com/nikolanikushev/git-scraper/commit/c4161a6d51373216c37858bfac224905493f420a))


### Internal

* corrected order for stage ([b8c626f](https://github.com/nikolanikushev/git-scraper/commit/b8c626f6d9bebb9f2aa93829ed13d63c595c1c8b))
* corrected ts format ([6f1a419](https://github.com/nikolanikushev/git-scraper/commit/6f1a419d882b4c1ebffd1d439c17fc3960871b05))
* corrected ts rule ([167344e](https://github.com/nikolanikushev/git-scraper/commit/167344e6b3060cd67f04b5456cfcc4e3b630e52c))
* eslint ([6861655](https://github.com/nikolanikushev/git-scraper/commit/6861655ed8009517a0433ab47dd473d86d0da7ac))
* moved workflows folder for git ([93bfdbe](https://github.com/nikolanikushev/git-scraper/commit/93bfdbe1eba2dc9d1f75fcce2f8ca5e740fe6672))
* remove eslint ([c8fb674](https://github.com/nikolanikushev/git-scraper/commit/c8fb674f719d8bf160c0338a392eae0652c4fe8a))
