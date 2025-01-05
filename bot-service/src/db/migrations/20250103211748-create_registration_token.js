'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RegistrationOnMeeting', {
      token: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.fn('uuid_generate_v4'),
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      meetingId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Meeting',
          key: 'meetingId',
        },
        onUpdate: 'CASCADE',
      },
      userId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'User',
          key: 'userId',
        },
        onUpdate: 'CASCADE',
      },
      userVerified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
    await queryInterface.dropTable('RegistrationOnMeeting');
  },
};
