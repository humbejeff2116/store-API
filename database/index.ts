import userDbInterface from "./interface/user/index.js";
import productDbInterface from "./interface/product/index.js";
import fundsDbInterface from "./interface/funds/index.js";
import connectToDatabase, { dbTypes } from "./lib/database_connection.js";
import orderDbInterface from "./interface/order/index.js";
import collectionDbInterface from "./interface/collection/index.js";
import notificationDbInterface from "./interface/notification/index.js";
import reviewDbInterface from "./interface/review/index.js";
import transactionDbInterface from "./interface/transaction/index.js";
connectToDatabase(dbTypes.mongoDB);

export {
    userDbInterface,
    productDbInterface,
    fundsDbInterface,
    orderDbInterface,
    collectionDbInterface,
    notificationDbInterface,
    reviewDbInterface,
    transactionDbInterface
}
