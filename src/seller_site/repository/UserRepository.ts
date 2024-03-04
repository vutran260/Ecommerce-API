import Logger from '../../lib/core/Logger';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Seller, User } from '../../lib/mysql/schema';
import * as schema from '../../lib/mysql/schema';
import { eq } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { LP_USER } from '../../lib/mysql/models/LP_USER';
import { NotFoundError } from '../../lib/http/custom_error/ApiError';

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
