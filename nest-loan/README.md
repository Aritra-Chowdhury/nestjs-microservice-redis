# Loan microservice
Allows admin to create and update an offer . It also allows to verify the details of a loan.
Allows customer to apply and update and fetch loan details and offer for different loan type.

## Author
- [Aritra Chowdhury](https://www.linkedin.com/in/aritra-chowdhury)

## Contents

1. [Overview](#overview)
2. [Architecture Diagram](#diagram)
3. [Getting started](#getting-started)

## Overview

### What's the problem?

An independent "Banking management system" , which would automate the process of managing activities of a bank. Like customer registration , account creation, cusomer details gathering and maintaining . Allowing customers to apply for loan.

### How can technology help ?

An automated system, which allows highly scable application ,to collect and maintain customer information & allows customer to apply for loan. The project intends to provide more user-friendly approach to maintain highly available application.

It divides a large application into micro services which can be scaled and maintained individually , as when required. It provides a server resiliency with opossum, with a message drive microservice architecture using redis.

## Diagram

![Banking API Architecture diagram](/readme_images/Architecture-diagram-loan.png)

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Getting started

### Prerequisites

1. Requires a mongoDB running locally or remotely.
2. Redis server running locally or using docker or remotely.
3. NodeJs greater than version 10 installed locally.
4. Create sample .env as below in each of the service and initialize the configuration.

	AUTH_PRIVATE_KEY=
	PORT=
	REDIS_URL=
	DATABASE_NAME=
	DATABASE_USERNAME=
	DATABASE_PASSWORD=

### Installation

```bash
$ npm install
```

### Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## License

  Nest is [MIT licensed](LICENSE).

  
