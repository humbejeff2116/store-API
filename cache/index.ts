
import usersCacheInterface from "./interface/user/index.js";
import walletsCacheInterface from "./interface/wallet/index.js";
import redisInterface from "./lib/redis.js";
import RedisStore from 'connect-redis'; 

const sessionStorePrefix = "userSession:";
const redisStore = new RedisStore({
    client: redisInterface.getClient(),
    prefix: sessionStorePrefix,
});

redisInterface.connect();

export {
    usersCacheInterface,
    walletsCacheInterface,
    redisStore,
    sessionStorePrefix,
}