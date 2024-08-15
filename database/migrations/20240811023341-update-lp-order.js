'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.removeConstraint(
      'LP_ORDER_ITEM',
      'LP_ORDER_ITEM_ibfk_1',
    );

    await queryInterface.removeConstraint(
      'LP_ORDER_PAYMENT',
      'LP_ORDER_PAYMENT_ibfk_1',
    );

    await queryInterface.removeConstraint('LP_SHIPMENT', 'LP_SHIPMENT_ibfk_1');

    await queryInterface.removeConstraint(
      'LP_SHIPMENT_HISTORY',
      'LP_SHIPMENT_HISTORY_order_id_fkey',
    );

    await queryInterface.removeConstraint(
      'LP_ORDER_ADDRESS_BUYER',
      'LP_ORDER_ADDRESS_BUYER_ibfk_1',
    );

    await queryInterface.changeColumn('LP_ORDER', 'id', {
      type: Sequelize.BIGINT,
      allowNull: false,
    });

    await queryInterface.changeColumn('LP_ORDER_ITEM', 'order_id', {
      type: Sequelize.BIGINT,
      allowNull: true,
    });

    await queryInterface.changeColumn('LP_ORDER_ADDRESS_BUYER', 'order_id', {
      type: Sequelize.BIGINT,
      allowNull: false,
    });

    await queryInterface.changeColumn('LP_ORDER_PAYMENT', 'order_id', {
      type: Sequelize.BIGINT,
      allowNull: false,
    });

    await queryInterface.changeColumn('LP_SHIPMENT', 'order_id', {
      type: Sequelize.BIGINT,
      allowNull: false,
    });

    await queryInterface.changeColumn('LP_SHIPMENT_HISTORY', 'order_id', {
      type: Sequelize.BIGINT,
      allowNull: false,
    });

    await queryInterface.addConstraint('LP_ORDER_ITEM', {
      fields: ['order_id'],
      type: 'foreign key',
      name: 'LP_ORDER_ITEM_ibfk_1',
      references: {
        table: 'LP_ORDER',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });

    await queryInterface.addConstraint('LP_ORDER_PAYMENT', {
      fields: ['order_id'],
      type: 'foreign key',
      name: 'LP_ORDER_PAYMENT_ibfk_1',
      references: {
        table: 'LP_ORDER',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });

    await queryInterface.addConstraint('LP_SHIPMENT', {
      fields: ['order_id'],
      type: 'foreign key',
      name: 'LP_SHIPMENT_ibfk_1',
      references: {
        table: 'LP_ORDER',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });

    await queryInterface.addConstraint('LP_SHIPMENT_HISTORY', {
      fields: ['order_id'],
      type: 'foreign key',
      name: 'LP_SHIPMENT_HISTORY_ibfk_1',
      references: {
        table: 'LP_ORDER',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });

    await queryInterface.addConstraint('LP_ORDER_ADDRESS_BUYER', {
      fields: ['order_id'],
      type: 'foreign key',
      name: 'LP_ORDER_ADDRESS_BUYER_ibfk_1',
      references: {
        table: 'LP_ORDER',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.changeColumn('LP_ORDER', 'id', {
      type: Sequelize.STRING(36),
      allowNull: false,
      defaultValue: Sequelize.literal('(UUID())'),
    });
  },
};
