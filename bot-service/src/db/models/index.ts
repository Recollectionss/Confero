import { sequelize } from '../db_connect';
import { User } from './user';
import { RegistrationOnMeeting } from './registration_on_meeting';
import { UserVoice } from './user_voice';

User.hasMany(RegistrationOnMeeting, { foreignKey: 'userId', as: 'RegistrationOnMeeting' });
RegistrationOnMeeting.belongsTo(User, { foreignKey: 'userId', as: 'User' });

User.hasOne(UserVoice, { foreignKey: 'userId', as: 'UserVoice' });
UserVoice.belongsTo(User, { foreignKey: 'userId', as: 'User' });

export { sequelize, User, RegistrationOnMeeting, UserVoice };
