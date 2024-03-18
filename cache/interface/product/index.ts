import { Product } from "../../../database/models/product/index.js";
import { cacheInterfaceHelpers } from "../../lib/index.js";

const PRODUCTS = "products";
const productsCacheInterface = {
    async getProducts() {
        return await cacheInterfaceHelpers.get(PRODUCTS, null);
    },
    async setProducts(products, expireAfter?: number) {
        return await cacheInterfaceHelpers.put(PRODUCTS, null, products, expireAfter);
    },
    async removeProducts() {
        return await cacheInterfaceHelpers.remove(PRODUCTS, null);
    },
    async getProduct(key) {
        return await cacheInterfaceHelpers.get(PRODUCTS, key);
    },
    async setProduct(product: Product, expireAfter?: number) {
        const { _id } = product;
        const id = String(_id);
        return await cacheInterfaceHelpers.put(PRODUCTS, id, product, expireAfter);
    },
    async removeProduct(key) {
        return await cacheInterfaceHelpers.remove(PRODUCTS, key);
    }
}

export default productsCacheInterface;