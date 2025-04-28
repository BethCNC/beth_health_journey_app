import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

console.log('NOTION_TOKEN:', process.env.NOTION_TOKEN ? 'Found (starts with: ' + process.env.NOTION_TOKEN.substring(0, 4) + '...)' : 'Not found'); 