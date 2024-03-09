import { LP_USER, LP_USERCreationAttributes } from '../../lib/mysql/models/LP_USER';

export class UserRepository {
  public getUserById = async (id: string) => {
    const user = await LP_USER.findOne({
      where: {
        id: id,
      },
    });
    return user?.dataValues;
  };

  public getUserByContactId = async (contactId: string) => {
    const user = await LP_USER.findOne({
      where: {
        contactId: contactId,
      },
    });
    return user?.dataValues;
  };

  public createUser = async (input: LP_USERCreationAttributes) => {
    await LP_USER.create(input);
    const rs = await this.getUserByContactId(input.contactId);
    return rs;
  };
}
