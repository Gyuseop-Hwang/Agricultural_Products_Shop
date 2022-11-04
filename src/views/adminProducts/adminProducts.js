import * as Api from "/api.js";

async function getAllProducts() {
  try {
    const result = await Api.get();
  } catch (err) {}
}
