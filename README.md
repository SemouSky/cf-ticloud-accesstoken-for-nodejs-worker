# TiCloud AccessToken Tool

TiCloud AccessToken tool for Node.js and Cloudflare worker.

## Use in Node.js

### Install

npm:

```shell
npm install cf-ticloud-accesstoken-for-nodejs-worker
```

yarn:

```shell
yarn add cf-ticloud-accesstoken-for-nodejs-worker
```

### Use in your project

```js
import { AccessTokenBuilder } from `cf-ticloud-accesstoken-for-nodejs-worker/src/AccessTokenBuilder.js`


/** Builds an AccessToken with expires. Prefer to use this.*/
let accessToken = AccessTokenBuilder.buildAccessTokenWithExpires(
    `xxxxxxxx`, // The enterpriseId issued to you by TiCloud
    `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`, // The token issued to you by TiCloud
    `userid`,   // The user id custom by yourself
    3600  // expire seconds
)


/* Build AccessToken with expire timestamp */
let accessToken = AccessTokenBuilder.buildAccessToken(
    `xxxxxxxx`, // The enterpriseId issued to you by TiCloud
    `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`, // The token issued to you by TiCloud
    `userid`,   // The user id custom by yourself
    1732674693  // Represented by the number of seconds elapsed since 1/1/1970, alway equal recent time plus expire time in second, for example : Math.floor(new Date()/1000) + 3600
)


/** Build AccessToken with expire timestamp, and custom salt and ts, just for debug.  */
let accessToken = AccessTokenBuilder.buildAccessTokenWithPrivilegeTs(
    `xxxxxxxx`, // The enterpriseId issued to you by TiCloud
    `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`, // The token issued to you by TiCloud
    `userid`,   // The user id custom by yourself
    1732674693,  // Represented by the number of seconds elapsed since 1/1/1970, alway equal recent time plus expire time in second, for example : Math.floor(new Date()/1000) + 3600
    123456,     // Random int value use as salt
    1732674693  // Timestamp, not used now
)

```

## Use as Cloudflare Worker

1. clone the project

    ```shell
    git clone https://github.com/SemouSky/cf-ticloud-accesstoken-for-nodejs-worker.git
    ```

2. install dependency

    ```shell
    cd cf-ticloud-accesstoken-for-nodejs-worker
    npm install   # or `yarn add`
    ```

3. use Cloudflare wrangler to deploy worker

    ```shell
    npm run deploy  # or `yarn deploy`
    ```

4. map URL patterns to your worker

    For more information, see [set-up-a-route-in-the-dashboard](https://developers.cloudflare.com/workers/configuration/routing/routes/#set-up-a-route-in-the-dashboard)

5. access your worker

    https:// `YOUR_WORKER_ROUTE` ?enterpriseId=`YOUR_ENTERPRISE_ID`&userId=`YOUR_CUSTOM_USER_ID`&expire=3600&token=`THE_TOKEN`

    - replace `YOUR_WORKER_ROUTE` to your real worker route
    - replace `YOUR_ENTERPRISE_ID` to your enterprise id
    - replace `YOUR_CUSTOM_USER_ID` to your custom user id
    - replace `THE_TOKEN` to your real token
    - You can also change the expiration time, it must be greater than 600 seconds (10 minutes), prefer using the default value.

    The result will contain two AccessTokens on two lines. They are actually the same. The first line is the same as the `AccessTokenBuilder.buildAccessTokenWithExpires` function result, and the second line is the URL-encoded version of the first line.
