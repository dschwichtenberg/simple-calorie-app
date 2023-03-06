const fs = require("fs");

const loadUsers = () => {
  try {
    const data = fs.readFileSync("./db/users.json");
    return JSON.parse(data);
  } catch (err) {
    console.log(err);
    return [];
  }
};

module.exports = { loadUsers };
