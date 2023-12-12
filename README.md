<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

<p align="center">Social networks have transformed the way we communicate, advertise and lead our lives during the past 2 decades. Many of us have one or multiple profiles on one or several networks, and we use them on a daily basis to communicate and share information.</p>
    <p align="center">
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

Demo social network application developed with [Nest](https://github.com/nestjs/nest) framework and PostgreSQL as the database.

## Features

- #### Create users
- #### Add friends & follow another user
- #### Create posts
- #### See user wall
- #### Like posts
- #### Sign-in and see basic user profile
- #### Set user creation and sign-in
- #### Restrict posts creation, like, follow
- #### Look user public user wall for signed-out users
- #### Look signed-in user wall with posts of friends and people following

## Installation

- Unzip the data.zip file, this contains the database with some predefined data

- Under the root folder execute `docker-compose up`

    - Database will be exposed at http://localhost:5432

    - Nest server exposed at http://localhost:3000

    - Swagger UI exposed at http://localhost:3000/api#/

## Running the app locally

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```
