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
}
