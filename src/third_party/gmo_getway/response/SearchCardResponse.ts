export class SearchCardResponse {
      cardSeq: string;
      cardNo: string;
      expire: string;

       constructor(response: string) {
            const params = new URLSearchParams(response);

            const cardSeq = params.get('CardSeq') || '';
            const cardNo = params.get('CardNo') || '';
            const expire = params.get('Expire') || '';

             this.cardSeq = cardSeq;
             this.cardNo = cardNo;
             this.expire = expire;
      }
}