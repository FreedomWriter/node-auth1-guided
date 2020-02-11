const db = require("../database/dbConfig.js");

function find() {
  return db("users").first("id", "username");
}

function findBy(filter) {
  return db("users")
    .select("id", "username", "password")
    .where(filter);
}

async function add(user) {
  const [id] = await db("users").insert(user);
  return findById(id);
}

function findById(id) {
  return db("users")
    .where({ id })
    .first("id", "username");
}

module.exports = {
  add,
  find,
  findBy,
  findById
};
