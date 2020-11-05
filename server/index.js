// dotenv is used to keep environment variables private
require("dotenv").config();
const { workflow, fetchSet } = require("./usernames");

/**
 * TWITTER API
 */

const Twitter = require("twitter");

const secrets = {
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_SECRET,
};

const client = Twitter(secrets);

const getNewIDs = async () => {
  var params = { id: "1323205815533260811", count: "100" };
  try {
    const results = await client.get("statuses/retweets/", params);
    let rtIDs = [];
    for (let i = 0; i < results.length; i++) {
      rtIDs.push(results[i].user.screen_name);
    }
    workflow(rtIDs);
  } catch (error) {
    console.error(error);
  }
};

setImmediate(getNewIDs, 30000)
setImmediate(fetchSet, 30000)
