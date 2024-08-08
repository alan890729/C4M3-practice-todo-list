'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Todos',
      Array.from({ length: 10 }).map((value, i) => {
        return {
          name: `todo-${i}`,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Todos', null)
  }
};
