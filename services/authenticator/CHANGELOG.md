# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v4.0.5] - 2020-09-10
### Fixed
- Upgraded node-fetch from 2.6.0 to 2.6.1 in /functions/edgeAuth
- Upgraded node-fetch from 2.6.0 to 2.6.1 in /functions/apiAuth

## [v4.0.4] - 2020-09-08
### Fixed
- Upgraded elliptic from 6.5.2 to 6.5.3 in /functions/edgeAuth
- Upgraded elliptic from 6.5.2 to 6.5.3 in /functions/apiAuth
- Upgraded lodash from 4.17.15 to 4.17.19 in /functions/edgeAuth
- Upgraded lodash from 4.17.11 to 4.17.20 in /functions/apiAuth
- Upgraded yargs-parser from 18.1.1 to 18.1.3 in /functions/apiAuth
- Upgraded acorn from 6.4.0 to 6.4.1 in /functions/apiAuth
- Corrected wrong parameter name in documentation
- Updated Jenkinsfile to work with DSL dynamic containers
### Added
- Added CFN template for APIGateway Authorizer attachment to documentation

## [v4.0.3] - 2020-04-14
### Fixed
- Removed nonce from query string. It remains in cookies.

## [v4.0.2] - 2020-04-09
### Fixed
- XRay tracing removed from EdgeAuthFunction, because XRay is not supported for Lambda@Edge.

## [v4.0.1] - 2020-04-02
### Fixed
- XRay permissions added to auth function roles.

## [v4.0.0] - 2020-02-03
### Added
- Lilly Azure AD support
### Removed
- Lilly PingFederate support
### Changed
- All dependencies to latest
- README updates
- apiAuth
  - Derive all signing certs from JWKS
  - Use AWS SSM Parameter Store for JWKS caching
  - Verify audience and client ID separately, as they have distinct purposes
- edgeAuth
  - Issuer is always Lilly prod Azure AD (both non-prod and prod apps are registered here)
  - Use OIDC metadata document for runtime configuration
  - Default scope is now `oidc`
  - Renamed parameter store keys ('ping' => 'oidc')

## [v3.1.4]
### Fixed
- Switched to grants instead of canned ACLs, because multiple canned ACLs are not allowed.

## [v3.1.3]
### Fixed
- S3 Replication now works for Lambda functions and CloudFormation template.
- CodeUri split out into Key and Bucket properties to allow for intrinsic function use.

## [v3.1.2]
### Fixed
- Jenkins build job now creates a CloudFormation template that is region-specific.

## [v3.1.1]
### Changed
- Updated Node.js Lambda runtime to nodejs12.x, because nodejs8.10 is now deprecated.

## [v3.1.0]
### Changed
- Updated Jenkins pipeline to use DSL and to automatically deploy to both Sandbox and Landing Zone
 
## [v3.0.0]
### Changed
- Updated API authenticator to return 401 Unauthorized when no token is provided for authentication, where previously a 403 Forbidden was returned (breaking change)

### Added
- Updated the `principalId` property returned by the API authenticator to contain the `sub`, `subject`, or `CN` JWT payload property value when available instead of always being `user`

## [v2.0.3] - 2019-06-04
### Changed
- Removed deprecated gateway JWKS URLs.

## [v2.0.2] - 2019-05-30
### Added
- Added command to deployment to set the S3 ACL for the packaged Lambda functions

### Changed
- Updated landing zone deployment instructions in README
- Updated version numbers seen in README

## [v2.0.1] - 2019-05-03
### Changed
- Fixed GitHub pre-releases updating prod and latest yaml files

## [v2.0.0] - 2019-05-01
### Added
- Added "Contributing" section to README
- Added new charge-back and ownership parameters to be used as tags (breaking change)
- Added CloudFormation parameters onto root README

### Changed
- Changed Landing Zone upload URLs and add documentation (S3 updated manually already)

## [v1.0.0] - 2019-04-05
### Added
- API Lambda Authenticator [[CIRRAUTO-1401]](https://dot-jira.lilly.com/browse/CIRRAUTO-1401)
- Lambda@Edge CloudFront Authenticator [[CIRRAUTO-1723]](https://dot-jira.lilly.com/browse/CIRRAUTO-1723)

[v4.0.5]: https://github.com/EliLillyCo/cirr-aws-authenticators/compare/v4.0.4...v4.0.5
[v4.0.4]: https://github.com/EliLillyCo/cirr-aws-authenticators/compare/v4.0.3...v4.0.4
[v4.0.3]: https://github.com/EliLillyCo/cirr-aws-authenticators/compare/v4.0.2...v4.0.3
[v4.0.2]: https://github.com/EliLillyCo/cirr-aws-authenticators/compare/v4.0.1...v4.0.2
[v4.0.1]: https://github.com/EliLillyCo/cirr-aws-authenticators/compare/v4.0.0...v4.0.1
[v4.0.0]: https://github.com/EliLillyCo/cirr-aws-authenticators/compare/v3.1.4...v4.0.0
[v3.1.4]: https://github.com/EliLillyCo/cirr-aws-authenticators/compare/v3.1.3...v3.1.4
[v3.1.3]: https://github.com/EliLillyCo/cirr-aws-authenticators/compare/v3.1.2...v3.1.3
[v3.1.2]: https://github.com/EliLillyCo/cirr-aws-authenticators/compare/v3.1.1...v3.1.2
[v3.1.1]: https://github.com/EliLillyCo/cirr-aws-authenticators/compare/v3.1.0...v3.1.1
[v3.1.0]: https://github.com/EliLillyCo/cirr-aws-authenticators/compare/v3.0.0...v3.1.0
[v3.0.0]: https://github.com/EliLillyCo/cirr-aws-authenticators/compare/v2.0.3...v3.0.0
[v2.0.3]: https://github.com/EliLillyCo/cirr-aws-authenticators/compare/v2.0.2...v2.0.3
[v2.0.2]: https://github.com/EliLillyCo/cirr-aws-authenticators/compare/v2.0.1...v2.0.2
[v2.0.1]: https://github.com/EliLillyCo/cirr-aws-authenticators/compare/v2.0.0...v2.0.1
[v2.0.0]: https://github.com/EliLillyCo/cirr-aws-authenticators/compare/v1.0.0...v2.0.0
[v1.0.0]: https://github.com/EliLillyCo/cirr-aws-authenticators/compare/c0dee75...v1.0.0
