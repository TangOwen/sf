'use strict';
const logger = require('../../lib/log/index'); //引入日志
//const chalk = require('chalk');

/**
 * Logger middleware： 中间件日志集成
 * @returns {Function}
 */
module.exports = () => {

    /**
     * 日志模块
     */
    return async (ctx, next) => {

        // ctx 绑定日志
        ctx.logger = logger.commonLogger;
        ctx.errorLogger = logger.errorLogger;
        ctx.warnLogger = logger.warnLogger;

        const start = new Date;
        ctx.state.startTime = start;

        await next();

        // 访问日志
        const ms = new Date - start;
        logger.accessLogger.info(`${ctx.request.method} "${ctx.url}" ${ms}ms ${ctx.status} ${ctx.response.length}b --> ${ctx.request.ip} "${ctx.request.header['user-agent']}"`);

        //accessLogger.info(chalk.gray('<--') +
        //    ' ' + chalk.bold('%s') +
        //    ' ' + chalk.gray('%s') +
        //    ' ' + chalk.gray('%s'), ctx.method, ctx.url, ms
        //)
    }
}
