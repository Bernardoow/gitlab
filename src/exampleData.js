export const variables = `
jobs:
  build:
    docker:
      - image: circleci/python:3.9.0-buster
        environment:
            DEBUG: True
            DEBUG1: true
            LOG_LEVEL: DEBUG
            PROJECT_DOMAIN: localhost:8000
            SECRET_KEY: 
            DATABASE_URL: postgres://ubuntu:@localhost:5432/circle_test
`;
