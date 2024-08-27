import { SiteRequest } from './SiteRequest';

export class SaveCardRequest extends SiteRequest {
  token: string;

  constructor(
    siteID: string,
    sitePass: string,
    memberID: string,
    token: string,
  ) {
    super(siteID, sitePass, memberID);
    this.token = token;
  }
}
