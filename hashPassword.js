const bcrypt = require("bcrypt");

const hashPassword = async () => {
  const hashed = await bcrypt.hash("123456", 10);
  console.log("Hashed Password:", hashed);
};

hashPassword();