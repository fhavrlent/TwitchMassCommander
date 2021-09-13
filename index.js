/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const axios = require('axios');
const tmi = require('tmi.js');
const dotenv = require('dotenv');

dotenv.config();

const {
  CHANNEL: channel,
  GIST: gist,
  PASSWORD: password,
  USERNAME: username,
  WAIT_TIME: waitTime = 1500,
} = process.env;

const options = {
  options: {
    debug: true,
  },
  connection: {
    reconnect: true,
    secure: true,
  },
  identity: {
    username,
    password,
  },
  channels: [channel],
};

const client = new tmi.Client(options);

client.connect();

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const massCommand = async () => {
  const { data } = await axios.get(gist);
  const commandArray = data.split(/\n/);

  for (const cmd of commandArray) {
    client.say(channel, cmd);
    await sleep(parseInt(waitTime, 10));
  }
};

client.on('connected', () => massCommand());
