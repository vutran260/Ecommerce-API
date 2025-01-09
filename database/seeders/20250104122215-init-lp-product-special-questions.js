'use strict';

const path = require('path');
const seederName = path.basename(__filename, path.extname(__filename));
const questions = [
  {
    id: 1,
    question:
      '薬剤師による医薬品適正使用のための確認後、お客様自身による承諾手続きがされず、ご注文から7日間が経過した場合は、ご注文の全商品をキャンセルさせていただきます。',
    type: 'radio',
    answer_template: 'はい,いいえ',
  },
  {
    id: 2,
    question:
      '薬剤師が適正でないと判断した場合には、ご注文すべての商品がキャンセルとなり、他の商品は再度ご購入手続きが必要となります。',
    type: 'radio',
    answer_template: 'はい,いいえ',
  },
  {
    id: 3,
    question: 'ご使用者のお名前',
    type: 'text',
    answer_template: '',
  },
  {
    id: 4,
    question: 'ご使用者の年齢',
    type: 'text',
    answer_template: '',
  },
  {
    id: 5,
    question: 'ご使用者の性別',
    type: 'radio',
    answer_template: '男性,女性',
  },
  {
    id: 6,
    question: '妊娠中または妊娠している可能性がありますか？',
    type: 'radio',
    answer_template: 'はい,いいえ',
  },
  {
    id: 7,
    question: '授乳中ですか？',
    type: 'radio',
    answer_template: 'はい,いいえ',
  },
  {
    id: 8,
    question: 'どのような症状に使用しますか？',
    type: 'radio',
    answer_template:
      '胃痛、もたれ、胸やけ、むかつき,上記の症状に当てはまらない',
  },
  {
    id: 9,
    question: '医薬品や食品によるアレルギーや副作用歴はありますか？',
    type: 'radio',
    answer_template: 'はい,いいえ',
  },
  {
    id: 10,
    question:
      '現在医療機関受診中、または医療機関受診していないが現在かかっている病気、使用している医薬品(市販薬含む）や健康食品がありますか？',
    type: 'radio',
    answer_template: 'はい,いいえ',
  },
  {
    id: 11,
    question: 'この医薬品を使用したことがありますか？',
    type: 'radio',
    answer_template: 'はい,いいえ',
  },
  {
    id: 12,
    question: 'この医薬品について、薬剤師に質問・伝達事項などはありますか？',
    type: 'radio',
    answer_template: 'はい,いいえ',
  },
  {
    id: 13,
    question:
      '使用上の注意をお読みいただき、内容に問題ないことを確認いただけましたか?',
    type: 'radio',
    answer_template: 'はい,いいえ',
  },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // Check if the seeder has already been run
      const [seederResults] = await queryInterface.sequelize.query(
        `
        SELECT * FROM SeederMeta WHERE seederName = :seederName
      `,
        {
          replacements: { seederName },
          transaction: transaction, // トランザクション内で実行
        },
      );

      if (seederResults.length === 0) {
        // Seeder has not been run, insert the data
        await queryInterface.bulkInsert(
          'LP_PRODUCT_SPECIAL_QUESTIONS',
          questions,
          { transaction: transaction },
        );

        // Record that the seeder has been run
        await queryInterface.sequelize.query(
          `
            INSERT INTO SeederMeta (seederName, createdAt)
            VALUES (:seederName, :createdAt)
          `,
          {
            replacements: { seederName, createdAt: new Date() },
            transaction: transaction,
          },
        );
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.log(error);
      throw error; // エラーを上位に伝播
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.sequelize.query(
        `DELETE FROM LP_PRODUCT_SPECIAL_QUESTIONS`,
      );
      await queryInterface.sequelize.query(
        `DELETE FROM SeederMeta WHERE seederName = :seederName`,
        { replacements: { seederName } },
      );
    } catch (error) {
      console.error('Error during down migration:', error);
      throw error;
    }
  },
};
