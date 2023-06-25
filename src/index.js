import { Client } from './helpers/client/Client.js';
import * as config from './settings/config.js';

const client = new Client(config.client_options, config);

client.initialize({ token: config.token });