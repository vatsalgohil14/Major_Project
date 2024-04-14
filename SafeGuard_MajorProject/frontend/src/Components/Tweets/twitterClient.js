const { TwitterApi } = require("twitter-api-v2");
require("dotenv").config({ path: "../../../.env" });

console.log(process.env.REACT_APP_API_KEY);

const client = new TwitterApi({
  appKey: process.env.REACT_APP_API_KEY,
  appSecret: process.env.REACT_APP_API_SECRET,
  accessToken: process.env.REACT_APP_ACCESS_TOKEN,
  accessSecret: process.env.REACT_APP_ACCESS_SECRET,
});

const bearer = new TwitterApi(process.env.REACT_APP_BEARER_TOKEN);

const twitterClient = client.readWrite;
const twitterBearer = bearer.readOnly;

module.exports = { twitterClient, twitterBearer };
