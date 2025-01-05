import { sequelize } from '../db_connect';
import { User } from './user';
import { RegistrationOnMeeting } from './registration_on_meeting';

User.hasMany(RegistrationOnMeeting, { foreignKey: 'userId', as: 'registrations' });
RegistrationOnMeeting.belongsTo(User, { foreignKey: 'userId', as: 'User' });

export { sequelize, User, RegistrationOnMeeting };
