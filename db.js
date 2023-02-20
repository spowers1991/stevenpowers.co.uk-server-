const { MongoClient } = require('mongodb');
require('dotenv').config();

const url = process.env.DB_CONNECTION_STRING;
const dbName = 'blog';

const client = new MongoClient(url, { useUnifiedTopology: true });

async function connect() {
  await client.connect();
  console.log(`Connected to ${dbName} database`);
}

function getDb() {
  return client.db(dbName);
}

module.exports = {
  connect,
  getDb,
};
