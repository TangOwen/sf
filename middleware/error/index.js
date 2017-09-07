'use strict';

/**
 * 错误处理
 * @returns {Function}
 */
module.exports = () => {

    return async (ctx, next) => {

        try{
            await next();
        }
        catch (err){
            let status = err.code || err.statusCode || err.status || 500;
            let message = err.message || '服务器错误';
            const ms = new Date - ctx.state.startTime;

            // 如果是自定义错误
            if (status < 0) {
                ctx.body.code = status;
                ctx.body.msg = message;
                ctx.warnLogger.warn(`${ctx.request.method} "${ctx.url}" ${ms}ms ${status} "${message}" --> ${ctx.request.ip} "${ctx.request.header['user-agent']}"`);
                return;
            }

            if (status > 0) {
                ctx.status = status;
                //ctx.app.on('error', err => logger.error(`server error ${err}`, err));
                ctx.errorLogger.error(`${ctx.request.method} "${ctx.url}" ${ms}ms ${status} --> ${ctx.request.ip} "${err.stack}"`);
                // 触发 koa 统一错误事件，可以打印出详细的错误堆栈 log
                //ctx.app.emit('error', err, ctx);
            }
        }
    }


}
