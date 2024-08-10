'use strict';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
const seederName = path.basename(__filename, path.extname(__filename));
const prefectures = [
  '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
  '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
  '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
  '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
  '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
  '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
  '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
];

module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if the seeder has already been run
    const [seederResults] = await queryInterface.sequelize.query(`
      SELECT * FROM SeederMeta WHERE seederName = :seederName
    `, {
      replacements: { seederName }
    });

    if (seederResults.length === 0) {
      for (const prefecture of prefectures) {
        // Check if the prefecture record already exists
        const [prefectureResults] = await queryInterface.sequelize.query(`
          SELECT 1 FROM LP_PREFECTURES WHERE prefecture_name = :prefecture_name
        `, {
          replacements: { prefecture_name: prefecture }
        });

        if (prefectureResults.length === 0) {
          // Insert the prefecture record if it does not exist
          await queryInterface.sequelize.query(`
            INSERT INTO LP_PREFECTURES (prefecture_name)
            VALUES (:prefecture_name)
          `, {
            replacements: { prefecture_name: prefecture }
          });
        }
      }

      // Record that the seeder has been run
      await queryInterface.sequelize.query(`
        INSERT INTO SeederMeta (seederName, createdAt)
        VALUES (:seederName, :createdAt)
      `, {
        replacements: { seederName, createdAt: new Date() }
      });
    }
  },

  async down(queryInterface, Sequelize) {
    for (const prefecture of prefectures) {
      await queryInterface.bulkDelete('LP_PREFECTURES', { prefecture_name: prefecture });
    }

    await queryInterface.bulkDelete('SeederMeta', {
      seederName
    });
  }
};
