# Kunji NodeJS Library

Setup Authentication and Authorization in your React application in seconds without any verification! Suitable for MVP, side projects or hackathon apps.

## Introduction

`kunji-node` is a Node.js library designed to verify tokens issued by the Kunji authorization server. It comes with an `AuthMiddleware` that can be easily integrated into your Node.js applications to secure routes and endpoints.

You can use the kunji service to integrate login within minutes.

> Also check the frontend react library for client: [kunji-react](https://www.npmjs.com/package/kunji-react)

## Installation

To install `kunji-node`, use npm:

```bash
npm install kunji-node
```
or use yarn:

```bash
yarn add kunji-node
```

## How to register App

This section will be updated after official production release.

## Usage

There are two ways to use the authentication middleware in your application:

1. Using the `Kunji` export to initialize:

```javascript
import { Kunji } from 'kunji-node';

const { AuthMiddleware } = Kunji(appId, publicKey);

// Your express other routes

app.use(AuthMiddleware); // Use the authentication middleware for all routes

// Rest of the code
```

2. Directly importing `AuthMiddleware` with environment variables:

```javascript
import { AuthMiddleware } from 'kunji-node';

// Your express other routes

app.use(AuthMiddleware); // Use the authentication middleware for all routes

// Rest of the code
```

**Note**: The second method requires the environment variables `KUNJI_APP_ID` and `KUNJI_PUBLIC_KEY` to be properly configured. If not configured 500 Response will be given whenever the middleware will be used.

Integrate this middleware into Express before routes requiring authentication. Afterward, you can access the user object using `req.user` in your controller, with the user's unique ID defined as `req.user.uid`.

[![Open in CodeSandbox](https://img.shields.io/badge/Open%20in-CodeSandbox-blue?style=flat-square&logo=codesandbox)](https://codesandbox.io/p/devbox/xjpn87?embed=1)


## Configuration

Make sure to set the following environment variables for configuration:

- `KUNJI_APP_ID`: Your Kunji application ID
- `KUNJI_PUBLIC_KEY`: Your Kunji public key

## Access Token Result (`req.user`)

After the middleware verifies the request, you can access the token result using `req.user`. The interface for the access token result is as follows:

| Field       | Type    | Description                                          |
|-------------|---------|------------------------------------------------------|
| `uid`       | string  | User ID associated with the access token             |
| `role`      | string  | Role assigned to the user                            |
| `iss`       | string  | Issuer of the access token (e.g., Kunji)             |
| `aud`       | string  | Audience for which the access token is intended      |
| `iat`       | number  | Issued at timestamp (UNIX timestamp in seconds)     |
| `exp`       | number  | Expiration timestamp (UNIX timestamp in seconds)    |


## Typescript

When using typescript, use the `AuthRequest` type from the package to be able to access `req.user`. 

Example:

```typescript
import { Response, NextFunction, RequestHandler } from 'express';
import { AuthRequest } from "kunji-node"; 
// Important: when importing middleware directly, Kunji env vars should be configured else it will throw error 500 for every authenticated request

const middleware : RequestHandler = (req: AuthRequest, response: Response, nextFunction : NextFunction) => {
    console.log(req.user.uid)
    // your middleware logic
}
```

## Debugging

1. Pass `debug:true` in `config` object while initialization. 
Example : 
```
const { AuthMiddleware } = Kunji(appId, publicKey, {debug: true});
```

OR

2. Set `KUNJI_ENABLE_DEBUG=true` as an environment variable (.env)

## Contributions

Contributions are welcome! If you find any issues or have suggestions for improvements, feel free to create an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).