import { Buffer } from 'buffer'

class ByteBuf {

    buffer = Buffer.alloc(1024)
    position = 0

    constructor() {
        this.buffer.fill(0)
    }


    pack() {
        let out = Buffer.alloc(this.position)
        this.buffer.copy(out, 0, 0, out.length)
        return out
    }

    putUint16(v) {
        this.buffer.writeUInt16LE(v, this.position)
        this.position += 2
        return this
    }

    putUint32(v) {
        this.buffer.writeUInt32LE(v, this.position)
        this.position += 4
        return this
    }

    putBytes(bytes) {
        this.putUint16(bytes.length)
        bytes.copy(this.buffer, this.position)
        this.position += bytes.length
        return this
    }

    putString(str) {
        return this.putBytes(Buffer.from(str))
    }

    putTreeMap(map) {
        if (!map) {
            this.putUint16(0)
            return this
        }

        this.putUint16(Object.keys(map).length)
        for (var key in map) {
            this.putUint16(key)
            this.putString(map[key])
        }

        return this
    }

    putTreeMapUInt32(map) {
        if (!map) {
            this.putUint16(0)
            return this
        }

        this.putUint16(Object.keys(map).length)
        for (var key in map) {
            this.putUint16(key)
            this.putUint32(map[key])
        }

        return this
    }
}

export {
    ByteBuf
}