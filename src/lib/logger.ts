import { Logger } from 'tslog';

interface ILogOptions {
  name?: string;
  type?: 'pretty' | 'json' | 'hidden';
  minLevel?: number;
}

export class Log {
  private static logger: Logger<ILogOptions>;

  private constructor() {}

  static getLogInstance(opts?: ILogOptions) {
    if (!Log.logger) {
      Log.logger = new Logger({
        name: opts?.name ?? 'kurentoClientLogger',
        type: opts?.type ?? 'pretty',
        minLevel: opts?.minLevel ?? 1,
        prettyLogTemplate:
          '{{yyyy}}-{{mm}}-{{dd}} {{hh}}:{{MM}}:{{ss}}:{{ms}}\t{{logLevelName}}\t[{{name}}]\t',
      });
    }
    return Log.logger;
  }
}

export type LogType = ReturnType<typeof Log.getLogInstance>;
