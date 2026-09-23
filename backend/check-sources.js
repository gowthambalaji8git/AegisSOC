require("dotenv").config();

const { Client } = require("pg");

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

async function checkSources() {
  try {
    await client.connect();

    const result = await client.query(
      "SELECT * FROM siem_sources;"
    );

    console.log(result.rows);
  } catch (error) {
    console.error(error);
  } finally {
    await client.end();
  }
}

checkSources();