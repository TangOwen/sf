'use strict';
/**
 * Module dependencies.
 */

const compressible = require('compressible')
const isJSON = require('koa-is-json')
const status = require('statuses')
const Stream = require('stream')
const bytes = require('bytes')
const zlib = require('zlib')

/**
 * Encoding methods supported.
 */

const encodingMethods = {
    gzip: zlib.createGzip,
    deflate: zlib.createDeflate
}

/**
 * API middleware： gzip 压缩
 * @param {Object} [options]
 * @return {Function}
 */

module.exports = function (options) {
    options = options || {}

    const filter = options.filter || compressible

    const threshold = !options.threshold ? 1024
        : typeof options.threshold === 'number' ? options.threshold
        : typeof options.threshold === 'string' ? bytes(options.threshold)
        : 1024

    return async function compress(ctx, next) {
        ctx.vary('Accept-Encoding')

        await next()

        const body = ctx.body
        if (!body) return
        if (ctx.compress === false) return
        if (ctx.request.method === 'HEAD') return
        if (status.empty[ctx.response.status]) return
        if (ctx.response.get('Content-Encoding')) return

        // forced compression or implied
        if (!(ctx.compress === true || filter(ctx.response.type))) return

        // identity
        var encoding = ctx.acceptsEncodings('gzip', 'deflate', 'identity')
        if (!encoding) ctx.throw(406, 'supported encodings: gzip, deflate, identity')
        if (encoding === 'identity') return

        // json
        if (isJSON(body)) body = ctx.body = JSON.stringify(body)

        // threshold
        if (threshold && ctx.response.length < threshold) return

        ctx.set('Content-Encoding', encoding)
        ctx.res.removeHeader('Content-Length')

        const stream =
            ctx.body = encodingMethods[encoding](options)

        if (body instanceof Stream) {
            body.pipe(stream)
        } else {
            stream.end(body)
        }
    }
}
