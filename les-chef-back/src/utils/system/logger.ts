import { createLogger, format, transports } from 'winston';

const isDev = process.env.NODE_ENV !== 'production';

/** Serialize `Error` values in meta (plain JSON.stringify yields `{}`). */
function stringifyMeta(meta: Record<string, unknown>): string {
    return JSON.stringify(meta, (_key, value) => {
        if (value instanceof Error) {
            return { name: value.name, message: value.message, stack: value.stack };
        }
        return value;
    });
}

const logger = createLogger({
    level: isDev ? 'debug' : 'info',
    format: format.combine(
        format.timestamp(),
        isDev ? format.colorize() : format.uncolorize(),
        format.printf(({ timestamp, level, message, ...meta }) => {
            const metaString = Object.keys(meta).length ? ` ${stringifyMeta(meta as Record<string, unknown>)}` : '';
            return `${timestamp} [${level}]: ${message}${metaString}`;
        })
    ),
    transports: [new transports.Console()],
});

export default logger;
