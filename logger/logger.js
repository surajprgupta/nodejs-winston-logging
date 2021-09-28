const winston = require('winston');
require('winston-daily-rotate-file');
const {createLogger, format, transports} = winston;
const {combine, timestamp, printf, colorize} = format;
const path = require('path');

const replaceErrors = (key, value) => {
    if (value instanceof Error) {
        let error = {};
        Object.getOwnPropertyNames(value).forEach((newKey) => {
            error[newKey] = value[newKey];
        });
        return error;
    }
    return value;
};

const formatter = printf((info) => {
    let object = {
        message: info.message,
    };
    if(info.label) {
        return `${info.timestamp} ${info.level} ${info.label} ${JSON.stringify(object, replaceErrors)}`;
    } else {
        return `${info.timestamp} ${info.level} ${JSON.stringify(object, replaceErrors)}`;
    }
});

const generalLogger = createLogger({
    format: combine(
        colorize(),
        timestamp(),
        formatter,
    ),
    transports: [
        new transports.Console(),
        new transports.DailyRotateFile({
            filename: 'application-%DATE%.log',
            dirname: 'logs',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxFiles: '90d'
        })
    ],
});

generalLogger.stream = {
    write: (info) => {
        generalLogger.info(info);
    },
};

let log_data = (message, label) => {
    generalLogger.log({
        level: 'verbose',
        label,
        message: message,
    });
};

let log_debug = (message, label) => {
    generalLogger.log({
        level: 'debug',
        label,
        message: message,
    });
};

let log_info = (message, label) => {
    generalLogger.log({
        level: 'info',
        label,
        message: message,
    });
};

let log_warn = (message, label) => {
    generalLogger.log({
        level: 'warn',
        label,
        message: message,
    });
};

let log_error = (message, label) => {
    generalLogger.log({
        level: 'error',
        label,
        message: message,
    });
};

module.exports = {
    log_data,
    log_debug,
    log_info,
    log_warn,
    log_error,
};
