# Exercise Result

![Build](https://github.com/fjrn-xendit/backend-coding-test/actions/workflows/build.yml/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/fjrn-xendit/backend-coding-test/badge.svg?branch=master)](https://coveralls.io/github/fjrn-xendit/backend-coding-test?branch=master)

## Result

Link to repo: https://github.com/fjrn-xendit/backend-coding-test

Below are the exercise results achieved

### Documentation Result

1. Utilized swagger to generate documentation, see documentation [here](http://localhost:8010/api-docs/)

### Implement tooling Result

Implemented these tools:

- `ESLint` for linting
  - integrated to `npm test`
- `nyc` for code coverage
  - build and test coverage integrated with github actions and coveralls.io
- `husky` for pre commit hook
  - run `npm test` before committing
- `winston` for logging

### Refactoring Result

- Convert callback style code to use `async/await`
- Four layer of structure
  - `router` as the router for endpoints
  - `middleware`, example of usage as a request validator
  - `service` for business logic, being called by `router`
  - `accessor` for accessing external logic such as database or external service
    - with this, it will be easier in the future if we want to change from SQLite to other RDBMS since all external logic is separated from business logic

![diagram](https://user-images.githubusercontent.com/110280018/182161074-c4caf5a3-8ac0-4d3a-b67c-9380325a4f7c.png)

### Security result

- Validate all input on all API
- Use query placeholder instead of string formatting for SQL query
- Test SQL injection input with unit test and ensure we return bad request error
- Add validation that only whitelisted IPs can access rides API
- Test reject non whitelisted IP

### Load test result

- Use `artillery` and `forever` for load testing
- run `npm run test:load` to run load test
- run `npm run test:load:report` to run load test with report
- load test report can be seen in `load-test-report.html`

# Xendit Coding Exercise

The goal of these exercises are to assess your proficiency in software engineering that is related to the daily work that we do at Xendit. Please follow the instructions below to complete the assessment.

## Setup

1. Fork this repository to your own github profile
2. Ensure `node (>=12)` and `npm` are installed
3. Run `npm install`
4. Run `npm test`
5. Run `npm start`
6. Hit the server to test health `curl localhost:8010/health` and expect a `200` response

## Tasks

Below will be your set of tasks to accomplish. Please work on each of these tasks in order. Success criteria will be defined clearly for each task

1. [Documentation](#documentation)
2. [Implement Tooling](#implement-tooling)
3. [Implement Pagination](#implement-pagination)
4. [Refactoring](#refactoring)
5. [Security](#security)
6. [Load Testing](#load-testing)

### Documentation

Please deliver documentation of the server that clearly explains the goals of this project and clarifies the API request and response that is expected.
Feel free to use any open source documentation tools such as OpenAPI / Swagger.

#### Success Criteria

1. [x] A pull request against `master` of your fork with a clear description of the change and purpose and merge it
2. [x] **[BONUS]** Create an easy way to deploy and view the documentation in a web format and include instructions to do so

### Implement Tooling

Please implement the following tooling:

1. `eslint` - for linting
2. `nyc` - for code coverage
3. `pre-push` - for git pre push hook running tests
4. `winston` - for logging

#### Success Criteria

1. [x] Create a pull request against `master` of your fork with the new tooling and merge it
   1. [x] `eslint` should have an opinionated format
   2. [x] `nyc` should aim for test coverage of `80%` across lines, statements, and branches
   3. [x] `pre-push` should run the tests before allowing pushing using `git`
   4. [x] `winston` should be used to replace console logs and all errors should be logged as well. Logs should go to disk.
2. [x] Ensure that tooling is connected to `npm test`
3. [x] Ensure that tests covers possible positive and negative scenarios
4. [x] Create a separate pull request against `master` of your fork with the linter fixes and merge it
5. [x] Create a separate pull request against `master` of your fork to increase code coverage to acceptable thresholds and merge it
6. [x] **[BONUS]** Add integration to CI such as Travis or Circle
7. [ ] **[BONUS]** Add Typescript support

### Implement Pagination

Please implement pagination to retrieve pages of the resource `rides`.

1. Create a pull request against `master` with your changes to the `GET /rides` endpoint to support pagination including:
   1. Code changes
   2. Tests
   3. Documentation
2. Merge the pull request

### Refactoring

Please implement the following refactors of the code:

1. [x] Convert callback style code to use `async/await`
2. [x] Reduce complexity at top level control flow logic and move logic down and test independently
3. [x] **[BONUS]** Split between functional and imperative function and test independently

#### Success Criteria

1. A pull request against `master` of your fork for each of the refactors above with:
   1. Code changes
   2. Tests covering positive and negative scenarios

### Security

Please implement the following security controls for your system:

1. [x] Ensure the system is not vulnerable to [SQL injection](https://www.owasp.org/index.php/SQL_Injection)
2. [x] **[BONUS]** Implement an additional security improvement of your choice

#### Success Criteria

1. A pull request against `master` of your fork with:
   1. Changes to the code
   2. Tests ensuring the vulnerability is addressed

### Load Testing

Please implement load testing to ensure your service can handle a high amount of traffic

#### Success Criteria

1. [x] Implement load testing using `artillery`
   1. [x] Create a PR against `master` of your fork including artillery
   2. [x] Ensure that load testing is able to be run using `npm test:load`. You can consider using a tool like `forever` to spin up a daemon and kill it after the load test has completed.
   3. [x] Test all endpoints under at least `100 rps` for `30s` and ensure that `p99` is under `50ms`
