import { LP_PREFECTURES } from '../..//lib/mysql/models/LP_PREFECTURES';
import { NotFoundError } from '../../lib/http/custom_error/ApiError';

export class PrefectureRepository {
  public getPrefectures = async () => {
    const prefectures = await LP_PREFECTURES.findAll();
    if (prefectures) {
      return prefectures;
    } else {
      throw new NotFoundError();
    }
  };

  public getPrefectureById = async (id: number) => {
    const prefecture = await LP_PREFECTURES.findByPk(id);
    if (prefecture) {
      return prefecture;
    } else {
      throw new NotFoundError();
    }
  };
}
