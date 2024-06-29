export class MemberResponse{
  memberID :string;
  memberName:string;
  deleteFlag: string;

  constructor(memberID: string, memberName: string, deleteFlag: string) {
    this.memberID = memberID;
    this.memberName = memberName;
    this.deleteFlag = deleteFlag;
  }

}