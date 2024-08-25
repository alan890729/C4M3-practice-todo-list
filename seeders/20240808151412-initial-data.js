'use strict';
const bcrypt = require('bcryptjs')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let transaction

    try {

      transaction = await queryInterface.sequelize.transaction()
      const hash = await bcrypt.hash('user0', 10)

      await queryInterface.bulkInsert(
        'Users',
        [
          {
            id: 1,
            name: 'user0',
            email: 'user0@test.com',
            password: hash,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ],
        { transaction }
      )

      await queryInterface.bulkInsert(
        'Todos',
        Array.from({ length: 10 }).map((value, i) => {
          return {
            name: `todo-${i}`,
            userId: 1,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        }),
        { transaction }
      )

      await transaction.commit()

    } catch (err) {
      if (transaction) {
        await transaction.rollback()
      }
    }

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null)
  }
};