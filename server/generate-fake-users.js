// sitas failas sukurtas tam, kad butu galima susigeneruoti
// testavimui fake naudotojus. Ji bet kada galima istrinti
// ********************
// NUM_USERS = nurodote, kiek norite susigeneruoti naudotoju

const axios = require('axios');
const { faker } = require('@faker-js/faker');

const API_URL = 'http://localhost:3003/api/v1/users/registration';
const NUM_USERS = 100;

async function registerUser(firstName, email, password) {
  try {
    const response = await axios.post(API_URL, {
      first_name: firstName,
      email: email,
      password: password,
    });
    console.log(`Užregistruotas naudotojas: ${email}`);
    return response.data;
  } catch (error) {
    console.error(
      `Registracijos klaida ${email}:`,
      error.response ? error.response.data : error.message
    );
  }
}

async function registerUsers() {
  const userPromises = [];
  for (let i = 0; i < NUM_USERS; i++) {
    const firstName = faker.person.firstName();
    const email = faker.internet.email().toLowerCase();
    // visiems vienodas slaptažodis - jei norėtusi prisijungti ir patikrinti
    const password = 'naudotojas123';
    userPromises.push(registerUser(firstName, email, password));
  }

  await Promise.all(userPromises);
  console.log('---------------------------\nVisi naudotojai užsiregistravo :)');
}

registerUsers();
