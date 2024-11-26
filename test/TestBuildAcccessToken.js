import { AccessTokenBuilder } from "../src/AccessTokenBuilder.js"
import { AccessToken } from "../src/AccessToken.js"


let token = AccessTokenBuilder.buildAccessTokenWithExpires(
    "",         // enterpriseId
    "",         // token
    "",         // userId
    3600,       // expire seconds
)

console.log(token)
