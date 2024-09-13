'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('LP_STORE_SSO', {
      store_id: {
        type: Sequelize.STRING(36),
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'LP_STORE',
          key: 'id',
        },
      },
      store_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      store_short_name: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      store_code: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      postal_code: {
        type: Sequelize.STRING(10),
        allowNull: true,
      },
      prefecture: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      search_index: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      phone_number: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      fax_number: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      longitude: {
        type: Sequelize.DECIMAL(24, 6),
        allowNull: true,
      },
      latitude: {
        type: Sequelize.DECIMAL(24, 20),
        allowNull: true,
      },
      transportation: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      news_from_store: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      regular_holiday: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      exist_parking: {
        type: Sequelize.DataTypes.TINYINT(1),
        allowNull: true,
      },
      parking_comment: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      can_credit_card: {
        type: Sequelize.DataTypes.TINYINT(1),
        allowNull: true,
      },
      can_use_credit_card_brands: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      can_electronic_money: {
        type: Sequelize.DataTypes.TINYINT(1),
        allowNull: true,
      },
      can_electronic_money_brands: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      can_bar_code_payment: {
        type: Sequelize.DataTypes.TINYINT(1),
        allowNull: true,
      },
      can_bar_code_payment_brands: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      monday_business_from_time: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      monday_business_end_time: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      tuesday_business_from_time: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      tuesday_business_end_time: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      wednesday_business_from_time: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      wednesday_business_end_time: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      thursday_business_from_time: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      thursday_business_end_time: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      friday_business_from_time: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      friday_business_end_time: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      saturday_business_from_time: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      saturday_business_end_time: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      sunday_business_from_time: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      sunday_business_end_time: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      national_holiday_business_from_time: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      national_holiday_business_end_time: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      business_time_display: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      is_include_display_national_holiday: {
        type: Sequelize.DataTypes.TINYINT(1),
        allowNull: true,
      },
      business_time_comment: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      tuesday_reception_from_time: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      tuesday_reception_end_time: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      monday_reception_from_time: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      monday_reception_end_time: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      wednesday_reception_from_time: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      wednesday_reception_end_time: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      thursday_reception_from_time: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      thursday_reception_end_time: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      friday_reception_from_time: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      friday_reception_end_time: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      saturday_reception_from_time: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      saturday_reception_end_time: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      sunday_reception_from_time: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      sunday_reception_end_time: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      national_holiday_reception_from_time: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      national_holiday_reception_end_time: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      can_issue_terminal_certificate: {
        type: Sequelize.DataTypes.TINYINT(1),
        allowNull: true,
      },
      use_terminal_certificate: {
        type: Sequelize.DataTypes.TINYINT(1),
        allowNull: true,
      },
      can_edit_self_info: {
        type: Sequelize.DataTypes.TINYINT(1),
        allowNull: true,
      },
      can_manage_staff: {
        type: Sequelize.DataTypes.TINYINT(1),
        allowNull: true,
      },
      is_public: {
        type: Sequelize.DataTypes.TINYINT(1),
        allowNull: true,
      },
      is_business_setting: {
        type: Sequelize.DataTypes.TINYINT(1),
        allowNull: true,
      },
      exist_logo_image: {
        type: Sequelize.DataTypes.TINYINT(1),
        allowNull: true,
      },
      exist_store_image: {
        type: Sequelize.DataTypes.TINYINT(1),
        allowNull: true,
      },
      shop_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      shop_pass: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      site_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      site_pass: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      logo_image: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal(
          'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
        ),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('LP_STORE_SSO');
  },
};
