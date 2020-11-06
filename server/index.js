// dotenv is used to keep environment variables private
require("dotenv").config();
const { workflow, fetchSet } = require("./usernames");
const express = require("express");

var app = express();
var cors = require("cors");
app.use(cors());

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
const TWITTER_ID = "1324718084591095808";

const getNewIDs = async () => {
  console.log(`fetching rts from Twitter`)
  var params = { id: TWITTER_ID, count: "100" };
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

const getQuoteTweets = async () => {
  console.log(`fetching quote tweets from Twitter`)
  var params = { q: TWITTER_ID, count: "100" };
  try {
    const results = await client.get("search/tweets/", params);

    let rtIDs = [];
    for (let i = 0; i < results.statuses.length; i++) {
      rtIDs.push(results.statuses[i].user.screen_name);
    }
    workflow(rtIDs);
  } catch (error) {
    console.error(error);
  }
};
let favs;

const getFavorites = async () => {
  console.log(`fetching favorite count from Twitter`)
  var params = { id: TWITTER_ID };
  try {
    const result = await client.get("statuses/show/", params);
    let favCount = result.favorite_count;
    favs = favCount;
    return favCount;
  } catch (error) {
    console.error(error);
  }
};

const TIMEOUT = 30000;

getFavorites().then((res) => favs = res)
getNewIDs();
getQuoteTweets();

setInterval(getNewIDs, TIMEOUT);
setInterval(getQuoteTweets, TIMEOUT);
setInterval(async () => {
  favs = await getFavorites();
  console.log(`favs ${favs}`)
}, TIMEOUT);

app.get("/ids", (req, res) => {
  try {
    const ids = fetchSet();
    res.json({ ids: ids });
  } catch (error) {
    res.json({ ids: null });
  }
});

app.get("/likes", async (req, res) => {
  try {
    console.log(`# of favs: ${favs}`)
    res.json({ likes: favs });
  } catch (error) {
    res.json({ likes: null });
  }
});

console.log("Listening on 8080");
app.listen(8080);
