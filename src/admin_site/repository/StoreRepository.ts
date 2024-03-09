import { BuildQuery, Filter,  GetOffset, Paging } from '../../lib/paging/Request';
import { LP_STORE, LP_STORECreationAttributes } from '../../lib/mysql/models/LP_STORE';
import { BuildOrderQuery, LpOrder } from '../../lib/paging/Order';
import { InternalError } from '../../lib/http/custom_error/ApiError';
import { StoreStatus } from '../../lib/constant/Store';

export class StoreRepository {

  public CreateStore = async (input: LP_STORECreationAttributes) => {
    const rs = await LP_STORE.create(input)
    return rs.dataValues
  };

  public getStoreList = async (filter: Filter[],order: LpOrder[], paging: Paging) => {
    const count = await LP_STORE.count({
      where: BuildQuery(filter)
    })

    paging.total = count;
    console.log("=========",paging)
    
    const rs = await LP_STORE.findAll({
      where: BuildQuery(filter),
      order: BuildOrderQuery(order),
      limit: paging.limit,
      offset: GetOffset(paging)
    })

    return rs
  };

  public getStoreById = async (id: string) => {
    const rs = await LP_STORE.findByPk(id)
    return rs?.dataValues;
  }

  public updateStoreStatus = async (
    storeId: string,
    status: StoreStatus,
    remark = '',
  ) => {
    const rs = await LP_STORE.update(
      {
        status: status,
        remark: remark
      },
      {where: {id: storeId}}
    )
    if (rs[0] === 0)  {
      return new InternalError()
    }
  };


}


