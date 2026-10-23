import { LOGS_NAMES } from "../types/logs.types";
import { getStrTimestamp } from "../utils/time_utils";


export class Logger {
    private constructor() {}

    public static info(message: string): void {
        console.log(`[${getStrTimestamp()}] [${LOGS_NAMES.INFO}]: ${message}`);
    }

    public static success(message: string): void {
        console.log(`[${getStrTimestamp()}] [${LOGS_NAMES.SUCCESS}]: ${message}`);
    }

    public static error(message: string): void {
        console.error(`[${getStrTimestamp()}] [${LOGS_NAMES.ERROR}]: ${message}`);
    }

    public static warn(message: string): void {
        console.warn(`[${getStrTimestamp()}] [${LOGS_NAMES.WARN}]: ${message}`);
    }
}