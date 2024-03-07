import Logger from '../../lib/core/Logger';
import { LP_USER } from '../../lib/mysql/models/LP_USER';
export class UserRepository {

  public createUser = async (input: any) => {
    try {
      await LP_USER.create(input)
    } catch (e: any) {
      Logger.error(e.message);
      throw e
    }
  };

}
