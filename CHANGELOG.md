# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [1.0.0] - 2016-12-06
### Added
- Initial Release

## [1.1.0] - 2017-1-05
### Added
- Scaling capabilities added into API
- Updated minimum version of Typescript to 2.1.4
- Started using Partial data type to describe parameters for creating new resources

### Removed
- tsd.json, haven't used since TS 2.0.0

## [1.1.1] - 2017-2-13
### Added
- Fix bug where query params were never passed into an account request

## [1.2.0] - 2017-2-20
### Updated
- Credits.expired was changed to Credits.expires on API. Matched field in client.
Breaking change for anyone using credits API