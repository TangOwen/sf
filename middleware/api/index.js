'use strict';

/**
 * API middleware： Web API 内容处理 - JSONP格式化
 * @returns {Function}
 */
module.exports = () => {
    return async (ctx, next) => {

        //初始化body
        ctx.body = ctx.body || {};

        await next();

        /**
         * 数据结构
         * @type {{code: number, msg: string, serverTime: number, data: null, auth: null}}
         */
        let body = {
            code: 0,
            msg:'OK',
            serverTime: Date.now(),
            data: null,
            auth: null,
        }

        /**
         * 接收中间件传递的结果，重新输出到body
         * @type {null}
         */
        body.data = ctx.body.data || body.data;//数据
        body.code = ctx.body.code || body.code;
        body.msg = ctx.body.msg || body.msg;
        body.auth = ctx.body.auth || body.auth;

        ctx.body = JSON.stringify(body);

        /**
         * JSONP带有callback
         */
        const callback = ctx.request.query['callback'];
        if (!callback) { return; }
        ctx.type = 'text/javascript';
        ctx.body = callback + '(' + ctx.body + ');';

    };
}
