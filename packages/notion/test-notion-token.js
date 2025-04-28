require('dotenv').config();
const { Client } = require('@notionhq/client');

// Initialize Notion client
const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.THERAPIST_DB_ID;

async function testNotionAccess() {
  console.log('Testing Notion API access...');
  console.log('Using token:', process.env.NOTION_TOKEN ? `${process.env.NOTION_TOKEN.substring(0, 5)}...` : 'undefined');
  console.log('Using database ID:', databaseId);
  
  try {
    // First try to retrieve the database to confirm access
    const database = await notion.databases.retrieve({
      database_id: databaseId
    });
    
    console.log('✅ Successfully connected to database:', database.title[0]?.plain_text || database.id);
    
    // Then try to query some items
    const response = await notion.databases.query({
      database_id: databaseId,
      page_size: 3
    });
    
    console.log(`✅ Successfully queried database. Found ${response.results.length} items.`);
    
    if (response.results.length > 0) {
      console.log('\nSample items:');
      response.results.forEach((page) => {
        const name = page.properties.Name?.title[0]?.plain_text || 'Unknown';
        const office = page.properties['Office/Group']?.multi_select.map(sel => sel.name).join(', ') || 'None';
        console.log(`- ${name} (${office})`);
      });
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error accessing Notion:', error.message);
    if (error.code === 'unauthorized') {
      console.error('\nPossible causes:');
      console.error('1. The token is invalid or expired');
      console.error('2. The token does not have permission to access this database');
      console.error('3. The integration is not connected to this database in Notion settings');
    } else if (error.code === 'object_not_found') {
      console.error('\nPossible causes:');
      console.error('1. The database ID is incorrect');
      console.error('2. The database was deleted or moved');
      console.error('3. The integration does not have access to this database');
    }
    return false;
  }
}

testNotionAccess().then(success => {
  if (!success) {
    process.exit(1);
  }
}); 