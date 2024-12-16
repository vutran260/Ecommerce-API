import { QueryTypes, Sequelize } from 'sequelize';
import { lpSequelize } from '../../lib/mysql/Connection';
import {
  LP_BUYER,
  LP_BUYERCreationAttributes,
} from '../../lib/mysql/models/LP_BUYER';
import { LP_CATEGORY } from '../../lib/mysql/models/LP_CATEGORY';
import { LP_ADDRESS_BUYER_SSO } from '../../lib/mysql/models/LP_ADDRESS_BUYER_SSO';
import { LP_BUYER_PERSONAL_INFORMATION } from '../../lib/mysql/models/LP_BUYER_PERSONAL_INFORMATION';

export class BuyerRepository {
  public createBuyer = async (input: LP_BUYERCreationAttributes) => {
    const buyer = await LP_BUYER.create(input);
    return await this.getBuyerById(buyer.id);
  };

  public getBuyerInfo = async (buyerId: string, storeId?: string) => {
    try {
      const buyerInfo = await LP_BUYER.findOne({
        where: { id: buyerId },
        include: [
          {
            association: LP_BUYER.associations.lpAddressBuyerSso,
          },
          {
            association: LP_BUYER.associations.lpBuyerPersonalInformation,
          },
          {
            association: LP_BUYER.associations.lpPointHistoryLogs,
            where: storeId ? { storeId, requestStatus: 'APPROVED' } : undefined,
            required: false,
            attributes: [],
          },
        ],
        attributes: {
          include: [
            [
              Sequelize.fn(
                'SUM',
                Sequelize.col('lpPointHistoryLogs.point_count'),
              ),
              'totalPoints',
            ],
          ],
        },
        group: ['LP_BUYER.id'],
      });

      return buyerInfo;
    } catch (error) {
      console.error('Error fetching buyer info:', error);
      throw error;
    }
  };

  public addMockAddressInfo = async (buyerId: string) => {
    await LP_ADDRESS_BUYER_SSO.create({
      buyerId: buyerId,
      email: `user${Math.floor(Math.random() * 10)}@example.com`,
      telephoneNumber: `+1${Math.floor(Math.random() * 9 + 10)}`,
      contactTelephoneNumber: `${Math.floor(Math.random() * 9 + 10)}`,
      postCode: `${Math.floor(Math.random() * 9 + 10)}`,
      prefectureCode: ['CA', 'TX', 'NY', 'FL'][Math.floor(Math.random() * 4)],
      cityTown: ['CityA', 'CityB', 'CityC', 'CityD'][
        Math.floor(Math.random() * 4)
      ],
      buildingName: `Building ${Math.floor(Math.random() * 10)}`,
    });
  };

  public addMockPersonalInfo = async (buyerId: string) => {
    await LP_BUYER_PERSONAL_INFORMATION.create({
      buyerId: buyerId,
      nickname: `Nickname${Math.floor(Math.random() * 10)}`,
      firstName: `FirstName${Math.floor(Math.random() * 10)}`,
      lastName: `LastName${Math.floor(Math.random() * 10)}`,
      firstNameKana: `ファーストネーム${Math.floor(Math.random() * 10)}`,
      lastNameKana: `ラストネーム${Math.floor(Math.random() * 10)}`,
      prefectureCode: ['CA', 'TX', 'NY', 'FL'][Math.floor(Math.random() * 4)],
      gender: Math.floor(Math.random() * 2),
      birthday: new Date().toString(),
      age: Math.floor(Math.random() * 10).toString(),
    });
  };

  public getBuyerById = async (id: string) => {
    const result = await LP_BUYER.findOne({ where: { id: id } });
    return result?.dataValues;
  };

  public getCategoriesWithHierarchy = async (storeId: string, id = '') => {
    const query =
      'WITH RECURSIVE cte AS ' +
      '(SELECT a.*, CAST(a.id AS CHAR(200)) AS path, 0 as depth, ' +
      `(SELECT count(*) from LP_CATEGORY where store_id = '${storeId}' ` +
      (!id
        ? 'AND parent_id IS NULL) as brotherCount '
        : `AND parent_id = (SELECT parent_id FROM LP_CATEGORY where id = '${id}')) as brotherCount `) +
      `FROM LP_CATEGORY as a WHERE store_id = '${storeId}' AND ` +
      (!id ? 'parent_id IS NULL ' : `id = '${id}' `) +
      'UNION ALL ' +
      "SELECT c.*, CONCAT(cte.path, ',', c.id), cte.depth + 1, " +
      '(SELECT count(*) from LP_CATEGORY where parent_id = ( SELECT parent_id FROM LP_CATEGORY where id = c.id)) as brotherCount ' +
      'FROM LP_CATEGORY c ' +
      'JOIN cte ON cte.id = c.parent_id ) ' +
      'SELECT * FROM cte ORDER BY depth ASC, order_level ASC;';

    const record = await lpSequelize.query(query, {
      raw: true,
      type: QueryTypes.SELECT,
      mapToModel: true,
      model: CategoryHierarchie,
    });
    const out: CategoryHierarchie[] = [];
    const mapCte = new Map<string, CategoryHierarchie>();
    for (const category of record) {
      mapCte.set(category.id, category);
      if (
        category.parentId === null ||
        (category.parentId && !mapCte.has(category.parentId))
      ) {
        delete category.children;
        out.push(category);
        continue;
      }

      const parentCate = mapCte.get(category.parentId!);
      // parent exist
      if (!!parentCate && !parentCate?.children) {
        parentCate.children = [];
      }
      parentCate?.children?.push(category);
      if (parentCate?.children?.length == 0) {
        delete parentCate.children;
      }
    }

    return out;
  };
}

class CategoryHierarchie extends LP_CATEGORY {
  brotherCount: number;
  path: string;
  depth: number;
  children?: CategoryHierarchie[];
}
