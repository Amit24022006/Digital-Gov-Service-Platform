import 'dotenv/config';
import { connectAndSeedMongo } from '../db/mongoInit.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/govdesk';

connectAndSeedMongo(MONGO_URI)
  .then(async () => {
    console.log('✅ Seed complete.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  });
