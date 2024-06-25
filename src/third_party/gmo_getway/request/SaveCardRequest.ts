import { SiteRquest } from './SiteRequest';

export class SaveCardRequest extends  SiteRquest{

  memberId: string;
  token : string;

  constructor(
    userId: string,
    siteId: string,
    sitePassword: string,
    token: string,
  ) {
    super();
    this.memberId = userId,
      this.token = token,
      this.siteId = siteId,
      this.sitePassword = sitePassword;
  }
}