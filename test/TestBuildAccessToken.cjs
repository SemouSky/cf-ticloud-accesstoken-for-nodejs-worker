(async () => {
    const { AccessTokenBuilder } = await import("../src/AccessTokenBuilder.js")
    const { AccessToken } = await import("../src/AccessToken.js")

    let token = AccessTokenBuilder.buildAccessTokenWithExpires(
        "",         // enterpriseId
        "",         // token
        "",         // userId
        3600,       // expire seconds
    )

    console.log(token)
})()