
## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Query urls
```
http://localhost:3000/urls
http://localhost:3000/urls?priority=3
```
### Swagger docs
```
http://localhost:3000/api
```

## Test

```bash
# unit tests
$ npm run test
```

## Enable cache
In order to improve performance, we can use memory cache to cache the online status of online urls. When enable, online urls will be cached in 5 minutes.
To enable, set the following environment variable (disabled by default)

```bash
$ export USECACHE=true
```