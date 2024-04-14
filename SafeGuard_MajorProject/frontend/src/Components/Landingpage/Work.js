import React from "react";
import HateDetect from "../../Assets/hate-detect.jpg";
import NSFWImage from "../../Assets/nsfw-image.jpg";
import Post from "../../Assets/post.jpg";

const Work = () => {
  const workInfoData = [
    {
      image: HateDetect,
      title: "Detects Hateful Tweets",
      text:
        "Classifies tweets into Toxicity, Severe Toxicity, Obscenity, Insult, Threat, Identity Hate",
    },
    {
      image: NSFWImage,
      title: "Detects NSFW Image",
      text:
        "Classifies images into Drawing, Neutral, Hentai, Porn, Sexy whether it is NSFW or not",
    },
    {
      image: Post,
      title: "Posts in Twitter",
      text:
        "Makes use of Twitter API to post the tweet or image in the user's twitter account. Note: User has to create API using Developer Account",
    },
  ];
  return (
    <div className="work-section-wrapper">
      <div className="work-section-top">
        <p className="primary-subheading">Work</p>
        <h1 className="primary-heading">How It Works</h1>
        <p className="primary-text">
          User can post a tweet or Image in the application and the model will
          detect
        </p>
      </div>
      <div className="work-section-bottom">
        {workInfoData.map((data) => (
          <div className="work-section-info" key={data.title}>
            <div className="info-boxes-img-container">
              <img src={data.image} alt="" />
            </div>
            <h2>{data.title}</h2>
            <p>{data.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Work;
