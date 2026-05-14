// removed dotenv
const Contentstack = require('contentstack');

const stack = Contentstack.Stack({
  api_key: process.env.CONTENTSTACK_API_KEY,
  delivery_token: process.env.CONTENTSTACK_DELIVERY_TOKEN,
  environment: process.env.CONTENTSTACK_ENVIRONMENT,
  region: Contentstack.Region.EU
});

async function test() {
  try {
    const result = await stack.ContentType("product").Query().toJSON().find();
    console.log("Success! Found", result[0].length, "products.");
  } catch (error) {
    console.error("Error connecting to Contentstack:", error);
  }
}

test();
