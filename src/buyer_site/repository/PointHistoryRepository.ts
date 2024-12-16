import { LP_POINT_HISTORY_LOGS } from '../../lib/mysql/models/LP_POINT_HISTORY_LOGS';
import { CreatePointHistoryRequest } from '../../common/model/pointHistory/createPointHistoryRequest';
import { Transaction } from 'sequelize';
import { WhereOptions } from 'sequelize/types/model';
import { UpdatePointHistoryRequest } from '../../common/model/pointHistory/updatePointHistoryRequest';

export class PointHistoryRepository {
  public createPointHistory = async (
    input: CreatePointHistoryRequest,
    t?: Transaction,
  ) => {
    await LP_POINT_HISTORY_LOGS.create(input, {
      transaction: t,
    });
  };

  public upsertPointHistory = async (
    input: CreatePointHistoryRequest,
    condition: WhereOptions,
    t?: Transaction,
  ) => {
    const existingRecord = await LP_POINT_HISTORY_LOGS.findOne({
      where: condition,
    });
    if (existingRecord) {
      return existingRecord.update(input, {
        transaction: t,
      });
    }
    await LP_POINT_HISTORY_LOGS.create(input, {
      transaction: t,
    });
  };

  public updatePointHistory = async (
    input: UpdatePointHistoryRequest,
    condition: WhereOptions,
    t?: Transaction,
  ) => {
    await LP_POINT_HISTORY_LOGS.update(input, {
      where: condition,
      transaction: t,
    });
  };

  public getPointHistory = async (condition: WhereOptions, t?: Transaction) => {
    return await LP_POINT_HISTORY_LOGS.findOne({
      where: condition,
      transaction: t,
    });
  };

  public deletePointHistory = async (
    condition: WhereOptions,
    t?: Transaction,
  ) => {
    await LP_POINT_HISTORY_LOGS.destroy({
      where: condition,
      transaction: t,
    });
  };
}
