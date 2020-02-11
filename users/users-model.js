const bcrypt = require("bcryptjs");

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
  user.password = await bcrypt.hash(user.password, 14);
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
