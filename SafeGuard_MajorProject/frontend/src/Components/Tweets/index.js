require("dotenv").config({ path: "../../../.env" });
const { twitterClient } = require("./twitterClient.js");

const TweetMessage = "This is my Second Tweet....";

const tweet = async () => {
  try {
    // const url = `../backend/uploads/${image}`;
    const url = `../../../backend/uploads/animal.jpeg`;
    const mediaId1 = await twitterClient.v1.uploadMedia(url);
    console.log(mediaId1);
    await twitterClient.v2.tweet({
      text: TweetMessage,
      media: {
        media_ids: [mediaId1],
      },
    });
    console.log("Tweeted Successfully!");
  } catch (e) {
    console.log(e);
  }
};

// tweet();

module.exports = { tweet };
