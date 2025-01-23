'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Voted', {
      votedId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      votedFor: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      result: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      pollId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Poll',
          key: 'pollId',
        },
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

    await queryInterface.createTable('UserVoice', {
      voiceId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      voice: {
        type: Sequelize.ENUM('За', 'Проти', 'Утримався', 'Не голосував/ла'),
        allowNull: false,
      },
      votedId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Voted',
          key: 'votedId',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      userId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'User',
          key: 'userId',
        },
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
    await queryInterface.dropTable('UserVoice');
    await queryInterface.dropTable('Voted');
  },
};
