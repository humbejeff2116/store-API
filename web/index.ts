import configs from "./configs/index.js";
import { define__dirname } from "./lib/shared.js";
import { router as userRoutes } from "./routes/user/index.js";
import { router as productRoutes } from "./routes/product/index.js";
import { router as walletRoutes } from "./routes/wallet/index.js";
import { router as orderRoutes } from "./routes/order/index.js";
import { router as collectionRoutes } from "./routes/collection/index.js";
import { router as reviewRoutes } from "./routes/review/index.js";

export {
    configs,
    userRoutes,
    productRoutes,
    walletRoutes,
    orderRoutes,
    collectionRoutes,
    reviewRoutes,
    define__dirname
}