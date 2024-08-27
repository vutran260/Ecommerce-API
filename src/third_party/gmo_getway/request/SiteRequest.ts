export class SiteRequest {
  siteID: string;
  sitePass: string;
  memberID: string;

  constructor(siteID: string, sitePass: string, memberID: string) {
    this.siteID = siteID;
    this.sitePass = sitePass;
    this.memberID = memberID;
  }
}
