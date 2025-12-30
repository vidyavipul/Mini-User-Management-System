import dotenv from 'dotenv';
import { connectDB } from '../src/config/db.js';
import { User } from '../src/models/User.js';
import { USER_ROLES, USER_STATUS } from '../src/config/constants.js';

// Load env vars
dotenv.config();

const getEmailFromArgs = () => {
  const argEmail = process.argv.find((arg) => arg.startsWith('--email='));
  if (!argEmail) return null;
  return argEmail.split('=')[1];
};

const run = async () => {
  const email = getEmailFromArgs();
  if (!email) {
    console.error('Usage: npm run make-admin -- --email=user@example.com');
    process.exit(1);
  }

  await connectDB();

  const user = await User.findOneAndUpdate(
    { email: email.toLowerCase() },
    { role: USER_ROLES.ADMIN, status: USER_STATUS.ACTIVE },
    { new: true }
  );

  if (!user) {
    console.error(`User not found for email: ${email}`);
    process.exit(1);
  }

  console.log(`Promoted user to admin: ${user.email}`);
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
