'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('VoteTokens', {
      voteTokenId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.fn('uuid_generate_v4'),
        unique: true,
        allowNull: false,
        primaryKey: true,
      },
      token: {
        type: Sequelize.STRING(80),
        allowNull: false,
        unique: true,
      },
      timeLive: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
        allowNull: false,
      },
      userId: {
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'userId',
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
    await queryInterface.dropTable('VoteTokens');
  },
};
