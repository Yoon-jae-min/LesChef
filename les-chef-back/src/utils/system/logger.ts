import { createLogger, format, transports } from 'winston';

const isDev = process.env.NODE_ENV !== 'production';

const logger = createLogger({
    level: isDev ? 'debug' : 'info',
    format: format.combine(
        format.timestamp(),
        isDev ? format.colorize() : format.uncolorize(),
        format.printf(({ timestamp, level, message, ...meta }) => {
            const metaString = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
            return `${timestamp} [${level}]: ${message}${metaString}`;
        })
    ),
    transports: [new transports.Console()],
});

export default logger;
