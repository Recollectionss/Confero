'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async function (queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      discordId: {
        type: Sequelize.BIGINT,
        unique: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      roleId: {
        type: Sequelize.UUID,
        references: {
          model: 'Role',
          key: 'roleId',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  },
};
