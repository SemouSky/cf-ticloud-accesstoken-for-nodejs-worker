import { createHmac } from "crypto"
import CRC32 from "crc-32"
const str = CRC32.str
import { UINT32 } from "cuint"
import { ByteBuf } from "./ByteBuf.js"
import { ReadByteBuf } from "./ReadByteBuf.js"



const Version = "001"
const VERSION_LENGTH = 3
const ENTERPRISE_ID_LENGTH = 7
const Privileges = {
    API: 1
}

const DefaultExpirationTimeInSeconds = () => Math.floor(new Date() / 1000) + 24 * 3600

class AccessToken {
    originVersion = Version

    enterpriseId
    token
    userId
    messages
    salt
    ts

    /**
     * 
     * @param {string} enterpriseId 
     * @param {string} token 
     * @param {string} userId 
     * @param {number} salt 
     * @param {number} ts 
     */
    constructor(enterpriseId, token, userId, salt, ts) {
        this.enterpriseId = `${enterpriseId}`
        this.token = `${token}`
        if (userId === 0) {
            this.userId = ""
        } else {
            this.userId = `${userId}`
        }
        this.messages = {}
        this.salt = salt || Math.floor(Math.random() * 0xffffffff)
        this.ts = ts || DefaultExpirationTimeInSeconds()
    }

    build() {
        let m = Message({
            salt: this.salt,
            ts: this.ts,
            messages: this.messages
        }).pack()

        let toSign = Buffer.concat([Buffer.from(this.enterpriseId, "utf8"), Buffer.from(this.userId, "utf8"), m])

        let signature = encodeHMac(this.token, toSign)
        let crcUserId = UINT32(str(this.userId)).and(UINT32(0xffffffff)).toNumber()
        let content = AccessTokenContent({
            signature: signature,
            crcUserId: crcUserId,
            m: m
        }).pack()
        return Version + this.enterpriseId + content.toString("base64")
    }

    addPrivilege(priviledge, expireTimestamp) {
        if (!expireTimestamp || isNaN(expireTimestamp) || expireTimestamp <= 0) {
            expireTimestamp = DefaultExpirationTimeInSeconds
        }
        this.messages[priviledge] = expireTimestamp
    }

    fromString(originToken) {
        try {
            this.originVersion = originToken.substr(0, VERSION_LENGTH)
            if (this.originVersion != Version) {
                return false
            }

            this.enterpriseId = originToken.substr(VERSION_LENGTH, ENTERPRISE_ID_LENGTH)

            let originContent = originToken.substr(VERSION_LENGTH + ENTERPRISE_ID_LENGTH)
            let originContentDecodedBuf = Buffer.from(originContent, "base64")

            let content = unPackContent(originContentDecodedBuf)
            this.signature = content.signature
            this.crcUserId = content.crcUserId
            this.m = content.m

            let msgs = unPackMessages(this.m)
            this.salt = msgs.salt
            this.ts = msgs.ts
            this.messages = msgs.messages
        } catch (err) {
            console.log(err)
            return false
        }

        return true
    }
}


const encodeHMac = function (key, message) {
    return createHmac("sha256", key).update(message).digest()
}



const AccessTokenContent = function (options) {
    options.pack = function () {
        let out = new ByteBuf()
        return out.putString(options.signature).putUint32(options.crcUserId).putString(options.m).pack()
    }

    return options
}

const Message = function (options) {
    options.pack = function () {
        let out = new ByteBuf()
        let val = out.putUint32(options.salt).putUint32(options.ts).putTreeMapUInt32(options.messages).pack()
        return val
    }

    return options
}

const unPackContent = function (bytes) {
    let readbuf = new ReadByteBuf(bytes)
    return AccessTokenContent({
        signature: readbuf.getString(),
        crcUserId: readbuf.getUint32(),
        m: readbuf.getString()
    })
}

const unPackMessages = function (bytes) {
    let readbuf = new ReadByteBuf(bytes)
    return Message({
        salt: readbuf.getUint32(),
        ts: readbuf.getUint32(),
        messages: readbuf.getTreeMapUInt32()
    })
}



export {
    AccessToken,
    Privileges
}