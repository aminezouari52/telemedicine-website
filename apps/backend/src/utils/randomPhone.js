const { faker } = require("@faker-js/faker");

const randomPhone = () => {
  return Array.from(
    { length: Math.floor(Math.random() * (15 - 8 + 1)) + 8 },
    () => faker.number.int({ min: 0, max: 9 })
  ).join("");
};

module.exports = randomPhone;
