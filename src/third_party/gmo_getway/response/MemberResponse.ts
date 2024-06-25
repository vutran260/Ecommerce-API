export class MemberResponse{
  memberId :string;
  memberName:string;
  deleteFlag: string;
  constructor(response: string) {
    const params = new URLSearchParams(response);

    const memberId = params.get('memberId') || '';
    const memberName = params.get('memberName') || '';
    const deleteFlag = params.get('deleteFlag') || '';

    this.memberId = memberId;
    this.memberName = memberName;
    this.deleteFlag = deleteFlag;
  }
}