
import { SiteRquest } from "./SiteRequest";


export class SaveMemberRequest extends SiteRquest {
    userId: string;

    constructor(
        userId: string,
        siteId: string,
        sitePassword: string
    ) {
        super();
        this.userId = userId,
            this.siteId = siteId,
            this.sitePassword = sitePassword;
    }
}
