'use strict';

const log4js = require('log4js');

log4js.configure({
    appenders: {
        errorLogs: {
            type: 'dateFile',
            filename: 'logs/error/error.log',
            pattern: '-yyyy-MM-dd.log',
            category: 'error',
        },
        warnLogs: {
            type: 'dateFile',
            filename: 'logs/warn/warn.log',
            pattern: '-yyyy-MM-dd.log',
            category: 'warn',
        },
        accessLogs: {
            type: 'dateFile',
            filename: 'logs/access/access.log',
            pattern: '-yyyy-MM-dd.log',
            category: 'access',
        },
        commonLogs:{
            type: 'dateFile',
            filename: 'logs/common/common.log',
            pattern: '-yyyy-MM-dd.log',
            category: 'common',
        },
        console: { type: 'console' }
    },
    categories: {
        default: { appenders: ['console'], level: 'info' },
        access: { appenders: ['accessLogs'], level: 'info' },
        error: { appenders: ['errorLogs'], level: 'error' },
        debug: { appenders: ['console'], level: 'trace' },
        warn: { appenders: ['warnLogs'], level: 'warn' },
        common: { appenders: ['commonLogs'], level: 'trace' },

    }
});

//开发环境
const env = process.env.NODE_ENV === 'development';
//访问日志
const accessLogger = env ? log4js.getLogger('debug') : log4js.getLogger('access');
//警告日志：用于记录抛出的警告
const warnLogger = env ? log4js.getLogger('debug') : log4js.getLogger('warn');
//错误日志：系统错误
const errorLogger = env ? log4js.getLogger('debug') : log4js.getLogger('error');
//自定义日志
const commonLogger = env ? log4js.getLogger('debug') : log4js.getLogger('common');

/**
 * 输出日志对象
 * @type {{commonLogger: Logger, accessLogger: Logger, warnLogger: Logger, errorLogger: Logger}}
 */
module.exports = {
    commonLogger,
    accessLogger,
    warnLogger,
    errorLogger
}

