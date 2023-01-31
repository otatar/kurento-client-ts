export class HubPort {
  constructor(private objId: string, private hubId: string) {}

  public getObjectId() {
    return this.objId;
  }

  public getHubId() {
    return this.hubId;
  }
}
