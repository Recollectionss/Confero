'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Meeting', {
      meetingId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.fn('uuid_generate_v4'),
        unique: true,
        allowNull: false,
        primaryKey: true,
      },
      date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
    });
    await queryInterface.createTable('MeetingUsers', {
      meetingId: {
        type: Sequelize.UUID,
        references: {
          model: 'Meeting',
          key: 'meetingId',
        },
        onUpdate: 'CASCADE',
      },
      userId: {
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'userId',
        },
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
    await queryInterface.dropTable('MeetingUsers');
    await queryInterface.dropTable('Meeting');
  },
};
