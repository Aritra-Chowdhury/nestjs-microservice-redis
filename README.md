# nestjs-microservice-redis
A banking-management-application ,used for creating and maintain customer account. It also allows the customer to apply for a loan.

## Author
- [Aritra Chowdhury](https://www.linkedin.com/in/aritra-chowdhury)

## Contents

1. [Overview](#overview)
2. [Architecture Diagram](#diagram)
3. [Technology](#technology)
4. [Getting started](#getting-started)
5. [Resources](#resources) 

## Overview

### What's the problem?

An independent "Banking management system" , which would automate the process of managing activities of a bank. Like customer registration , account creation, cusomer details gathering and maintaining . Allowing customers to apply for loan.

### How can technology help ?

An automated system, which allows highly scable application ,to collect and maintain customer information & allows customer to apply for loan. The project intends to provide more user-friendly approach to maintain highly available application.

It divides a large application into micro services which can be scaled and maintained individually , as when required. It provides a server resiliency with opossum, with a message drive microservice architecture using redis.

## Diagram

![Banking API Architecture diagram](/readme_images/Banking-api-architecture-diagram.png)

## Technology

- [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.
- [NodeJs](https://nodejs.org/en/docs)
- [Redis](https://www.npmjs.com/package/redis) framework for message broker.
- [Opossum](https://nodeshift.dev/opossum/) Circuit Breaker.
- [MongoDB](https://www.mongodb.com/) for storing data.
- [JWT](https://jwt.io/) for Authentication.
- [Jest](https://jestjs.io/docs/en/getting-started) Testing framework for Junit and integration testing.

## Getting started

The application is divided into four different node application as follows:

1. [API-GATEWAY](/nest-api-gateway)
2. [CUSTOMER-SERVICE](/nest-customer)
3. [ACCOUNT-SERVICE](/nest-account)
4. [LOAN-SERVICE](/nest-loan)

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
	
### Postman collections

The post collections will help in understanding the API Endpoints , request and reponse structure.

1. [CUSTOMER-SERVICE](/postman_collections/Customer.postman_collection.json)
2. [ACCOUNT-SERVICE](/postman_collections/Account.postman_collection.json)
3. [LOAN-SERVICE](/postman_collections/Loan.postman_collection.json)
4. [OFFER-SERVICE](/postman_collections/Offer.postman_collection.json)

### SWAGGER FILES

1. [SWAGGER-FILES](/nest-api-gateway/swagger-files/my-banking-swager.yml)
2. [OPENAPI](/nest-api-gateway/swagger-files/opeAPI-swagger.yml)

## Resources

- [Nest](https://docs.nestjs.com/)
- [NodeJs](https://nodejs.org/en/docs)
- [Redis](https://www.npmjs.com/package/redis) framework for message broker.
- [Opossum](https://nodeshift.dev/opossum/) Circuit Breaker.
- [MongoDB](https://www.npmjs.com/package/mongoose) for storing data.
- [JWT](https://www.npmjs.com/package/passport-jwt)
- [Jest](https://jestjs.io/docs/en/getting-started) Testing framework for Junit and integration testing.

## License

  Nest is [MIT licensed](LICENSE).
