const redis = require('redis');
const { promisify } = require('util');

let client;

const connectredis = () => {
    client = redis.createClient({
        password: 'uN3DQCgJOPN9NccmGSZydm9GIC9J5xcj',
        socket: {
            host: 'redis-19167.c330.asia-south1-1.gce.redns.redis-cloud.com',
            port: 19167
        }
    });
    

    client.on('connect', () => {
        console.log('Connected to Redis');
    });

    client.on('error', (err) => {
        console.error('Redis error:', err);
    });

    // Promisify Redis client methods for easier use with async/await
    client.getAsync = promisify(client.get).bind(client);
    client.setAsync = promisify(client.set).bind(client);
    client.expireAsync = promisify(client.expire).bind(client);
};

const getAsync = () => client.getAsync;
const setAsync = () => client.setAsync;
const expireAsync = () => client.expireAsync;

module.exports = {
    connectredis,
    getAsync,
    setAsync,
    expireAsync,
    client
};
