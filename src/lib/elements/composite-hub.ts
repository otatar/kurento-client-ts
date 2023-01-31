import BaseHub from './base-hub';

export class HubComposite extends BaseHub {
  constructor(objId: string, sessionID?: string) {
    super(objId, sessionID);
  }
}
