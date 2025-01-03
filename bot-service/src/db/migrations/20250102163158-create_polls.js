'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Poll', {
      pollId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.fn('uuid_generate_v4'),
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      question: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      meetingId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Meeting',
          key: 'meetingId',
        },
      },
    });
    await queryInterface.createTable('Voted', {
      votedId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.fn('uuid_generate_v4'),
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      votedFor: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      pollId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Poll',
          key: 'pollId',
        },
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Voted');
    await queryInterface.dropTable('Poll');
  },
};
