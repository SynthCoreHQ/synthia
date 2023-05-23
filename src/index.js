import 'dotenv/config';
import config from './config.js';
import { Client } from './helpers/Client.js';

const client = new Client(config, { paths: {} });

client.initialize({ token: process.env['BOT_TOKEN'] });
