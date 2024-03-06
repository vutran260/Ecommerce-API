import { LP_USER } from '../../lib/mysql/models/LP_USER';

export class UserRepository {
  public getUserById = async (id: string) => {
    const user = await LP_USER.findOne({
      where:{
        id: id
      }
    }) 
    return user?.dataValues;
  };

  public createUser =  async (input: any) => {
    const rs = await LP_USER.create({id: input.id,
      username: input.userName,
    password: input.password,
    });
    return rs.dataValues
  }

}
