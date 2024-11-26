import {
    AccessToken,
    Privileges
} from './AccessToken.js'


class AccessTokenBuilder {
    /**
     * Builds an AccessToken.
     *
     * @param {string} enterpriseId    The enterpriseId issued to you by TiCloud
     * @param {string} token           The token issued to you by TiCloud
     * @param {string} userId          The userId.
     * @param {number} expireTimestamp represented by the number of seconds elapsed since 1/1/1970.
     * @returns {string} The built access token.
     */
    static buildAccessToken(enterpriseId, token, userId, expireTimestamp) {
        const builder = new AccessToken(enterpriseId, token, userId)
        builder.addPrivilege(Privileges.API, expireTimestamp)

        try {
            return builder.build()
        } catch (e) {
            console.error(e)
            return ""
        }
    }

    /**
     * Builds an AccessToken with expires.
     *
     * @param {string} enterpriseId The enterpriseId issued to you by TiCloud
     * @param {string} token        The token issued to you by TiCloud
     * @param {string} userId       The userId.
     * @param {number} expires      expire seconds.
     * @returns {string} The built access token.
     */
    static buildAccessTokenWithExpires(enterpriseId, token, userId, expires) {
        const currentTimeMillis = Math.floor(Date.now() / 1000)
        const expireTimestamp = currentTimeMillis + expires
        const builder = new AccessToken(enterpriseId, token, userId)
        builder.addPrivilege(Privileges.API, expireTimestamp)

        try {
            return builder.build()
        } catch (e) {
            console.error(e)
            return ""
        }
    }

    /**
     * Builds an AccessToken.
     *
     * @param {string} enterpriseId    The enterpriseId issued to you by TiCloud
     * @param {string} token           The token issued to you by TiCloud
     * @param {string} userId          The userId.
     * @param {number} expireTimestamp represented by the number of seconds elapsed since 1/1/1970.
     * @param {number} salt            privilegeSalt
     * @param {number} ts              privilegeTs
     * @returns {string} The built access token.
     */
    static buildAccessTokenWithPrivilegeTs(enterpriseId, token, userId, expireTimestamp, salt, ts) {
        const builder = new AccessToken(enterpriseId, token, userId, salt, ts)
        builder.addPrivilege(Privileges.API, expireTimestamp)

        try {
            return builder.build()
        } catch (e) {
            console.error(e)
            return ""
        }
    }
}

export {
    AccessTokenBuilder
}
