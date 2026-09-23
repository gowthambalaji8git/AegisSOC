require("dotenv").config();

const { Client } = require("pg");

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

async function checkEnum() {
  try {
    await client.connect();

    const result = await client.query(
      "SELECT unnest(enum_range(NULL::incident_severity));"
    );

    console.log(result.rows);
  } catch (error) {
    console.error(error);
  } finally {
    await client.end();
  }
}

checkEnum();