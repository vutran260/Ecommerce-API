import { PrefectureRepository } from '../repository/PrefectureRepository';

export class PrefectureUsecase {
  private prefectureRepo: PrefectureRepository;

  constructor(prefectureRepo: PrefectureRepository) {
    this.prefectureRepo = prefectureRepo;
  }

  public getPrefectures = async () => {
    return this.prefectureRepo.getPrefectures();
  };
}
