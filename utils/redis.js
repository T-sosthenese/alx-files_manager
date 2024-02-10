import { createClient } from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = createClient();
    this.client.wasConnected = true;

    this.client.on('error', (err) => {
      this.client.wasConnected = false;
      console.log('Error ', err);
    });

    this.client.on('connect', () => {
      this.client.wasConnected = true;
    });
  }

  isAlive() {
    return this.client.wasConnected;
  }

  async get(key) {
    const getAsync = promisify(this.client.get).bind(this.client);
    return getAsync(key);
  }

  async set(key, value, time) {
    const setAsync = promisify(this.client.set).bind(this.client);
    return setAsync(key, value, 'EX', time);
  }

  async del(key) {
    const delAsync = promisify(this.client.del).bind(this.client);
    return delAsync(key);
  }
}

const redisClient = new RedisClient();
module.exports = redisClient;
