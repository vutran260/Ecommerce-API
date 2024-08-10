'use strict';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
const seederName = path.basename(__filename, path.extname(__filename));

module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if the seeder has already been run
    const [results] = await queryInterface.sequelize.query(`
      SELECT * FROM SeederMeta WHERE seederName = :seederName
    `, {
      replacements: { seederName }
    });

    if (results.length === 0) {
      const admin = {
        email: 'email',
        phone: 'phone',
        password: 'password',
        username: 'username',
        fullname: 'fullname',
        created_at: new Date(),
        updated_at: new Date()
      };

      // Check if the admin record already exists
      const [adminResults] = await queryInterface.sequelize.query(`
        SELECT 1 FROM LP_ADMIN WHERE email = :email AND phone = :phone AND username = :username
      `, {
        replacements: { email: admin.email, phone: admin.phone, username: admin.username }
      });

      if (adminResults.length === 0) {
        // Insert the admin record if it does not exist
        await queryInterface.sequelize.query(`
          INSERT INTO LP_ADMIN (id, email, phone, password, username, fullname, created_at, updated_at)
          VALUES (UUID(), :email, :phone, :password, :username, :fullname, :created_at, :updated_at)
        `, {
          replacements: admin
        });
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
    await queryInterface.bulkDelete('LP_ADMIN', {
      email: 'email',
      phone: 'phone',
      username: 'username'
    });

    await queryInterface.bulkDelete('SeederMeta', {
      seederName
    });
  }
};
