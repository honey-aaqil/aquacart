// src/scripts/clear-users.ts
import 'dotenv/config';
import dbConnect from '../lib/mongodb';
import UserModel from '../models/User';

async function clearUsers() {
  console.log('Connecting to the database...');
  await dbConnect();
  console.log('Database connected.');

  try {
    console.log('Deleting all users from the collection...');
    const deleteResult = await UserModel.deleteMany({});
    console.log(`Successfully deleted ${deleteResult.deletedCount} users.`);
  } catch (error) {
    console.error('An error occurred while deleting users:', error);
  } finally {
    // Mongoose connection is managed by dbConnect, 
    // which handles caching. We don't manually close it here
    // to allow for reuse by other parts of the application if needed.
    // In a standalone script, you might call mongoose.connection.close().
    console.log('Operation finished.');
    // Force exit the script
    process.exit(0);
  }
}

clearUsers();
