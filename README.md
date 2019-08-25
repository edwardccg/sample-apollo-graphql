# seminar-apollo-graphql

This repository hold the source code for seminar-apollo-graphql

## Prerequisite - install dependencies

```bash
npm install
```

### start a redis in local (if you enable graphql-redis-subscriptions)

- Run `npm run dc:redis -- up`
- Run `redis-cli ping`, you should receive "PONG" as response
- When exiting, exit the docker by Ctrl + C, then run `npm run dc:redis -- down`

## Start the service

`npm start`
