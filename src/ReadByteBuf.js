import { Buffer } from 'buffer'

class ReadByteBuf {
    buffer
    position

    constructor(bytes) {
        this.buffer = bytes
        this.position = 0
    }

    getUint16() {
        let ret = this.buffer.readUInt16LE(this.position)
        this.position += 2
        return ret
    }

    getUint32() {
        let ret = this.buffer.readUInt32LE(this.position)
        this.position += 4
        return ret
    }

    getString() {
        let len = this.getUint16()

        let out = Buffer.alloc(len)
        this.buffer.copy(out, 0, this.position, this.position + len)
        this.position += len
        return out
    }

    getTreeMapUInt32() {
        let map = {}
        let len = this.getUint16()
        for (let i = 0; i < len; i++) {
            let key = this.getUint16()
            let value = this.getUint32()
            map[key] = value
        }
        return map
    }
}

export {
    ReadByteBuf
}