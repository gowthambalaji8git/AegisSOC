require("dotenv").config();

const { Client } = require("pg");

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

async function updateIncident() {
  try {
    await client.connect();

    const result = await client.query(
      "UPDATE incidents SET mitre_technique = $1 WHERE id = $2 RETURNING id, title, mitre_technique",
      ["T1110", 7]
    );

    console.log(result.rows);
  } catch (error) {
    console.error(error);
  } finally {
    await client.end();
  }
}

updateIncident();
