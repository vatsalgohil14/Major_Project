# !pip install googletrans==3.1.0a0
# pip install tweepy

from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from glob import glob
from collections.abc import Iterable    
from fastai import *
from pathlib import Path
import subprocess

# import fastai
from fastai.vision import *
from fastai.vision.all import *
from fastai.text.all import *

import base64
from flask import Flask, request
from PIL import Image

import sys
sys.path.insert(1,"../../HateSpeech_Model")
from tests.test_models import test_original_input
import googletrans
from googletrans import Translator

import tweepy

# Enter API tokens below
bearer_token = "AAAAAAAAAAAAAAAAAAAAAL2YpwEAAAAARZ3LiI5CcPD83xJeIHQDFsEN%2Fxw%3D6tabBJ0wdGSHkgBi9Vyx0c2zCjPXkp2s0keXL1lkQmTDeFK8XR"
consumer_key = "cgTkmJGROQ7FQLVk1KRmMubHO"
consumer_secret = "Tkqy4RW8XqayTz4PgHRGrkdm4MZTpOM8MdbeGfnn5OA6tlbcwj"
access_token = "1701275294278049792-Cr8YXyBC2BjACtsiQaKbhUS89Fdoyn"
access_token_secret = "I3qs7FZ5FwvDt7JvYB3Orf4hJAIz4ukVJOFQ1jWcBEef1"
auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)
tweet_api = tweepy.API(auth, wait_on_rate_limit=True)

client = tweepy.Client(
    bearer_token,
    consumer_key,
    consumer_secret,
    access_token,
    access_token_secret,
    wait_on_rate_limit=True,
)

api = Flask(__name__)
CORS(api, support_credentials=True)


CLASSES = [
    "toxicity",
    "severe_toxicity",
    "obscene",
    "threat",
    "insult",
    "identity_attack"
    ]

def predict_image(img_url):
    print("===> Loading NSFW Model.")
    # print("✅Execution Started!!")
    path = Path(r'D:\SPIT\MajorProject\NSFW_Model\data')
    # print(path.ls())
    print("✅Execution Started for NSFW Model!!")
    data1 = ImageDataLoaders.from_folder(path,
                                    train='train',
                                    valid='test',
                                    num_workers=12,
                                    item_tfms=Resize(460),
                                    batch_tfms=[*aug_transforms(size=224), Normalize.from_stats(*imagenet_stats)])
    learn = vision_learner(data1, models.resnet34, metrics=accuracy)
    learn = learn.load('resnet34_model')
    # pth1 = r"D:\SPIT\MajorProject\frontend\backend\uploads\wallpaper_1.jpeg"
    pth1 = img_url
    prediction = learn.predict(pth1)
    # print("Your Image classified as: " + prediction[0])
    print("✅Execution Stopped!!")
    return prediction[0]

@api.route('/', methods=['GET'])
@cross_origin(origin='*')
def my_profile():
    response_body = {
        "name": "Amaresh",
        "about" :"Hello! I'm a full stack developer that loves python and javascript"
    }
    return jsonify(response_body)


@api.route('/postdata', methods=['POST'])
@cross_origin(origin='*')
def post_data():
    data = request.get_json()
    text = data['text_msg'];
    img_url = data['img_url'];

    # Translate function
    translator = Translator()
    conv_text = translator.translate(text, dest='en').text
    text_results = test_original_input(conv_text)
    if(img_url == ""):
        print("--------- No Image Selected ---------")
        answer = {
            "text": {
                "toxicity" : f"{text_results['toxicity']*100:.2f}%",
                "severe_toxicity" : f"{text_results['severe_toxicity']*100:.2f}%",
                "obscene" : f"{text_results['obscene']*100:.2f}%",
                "threat" : f"{text_results['threat']*100:.2f}%",
                "insult" : f"{text_results['insult']*100:.2f}%",
                "identity_attack" : f"{text_results['identity_attack']*100:.2f}%",
            },
            "img" : "No Image Selected"
        }
        return jsonify(answer)
    else:
        print("--------- Uploading Image ---------")
    
        # Get base64 image data from JSON payload
        base64_image = request.get_json()['base64Image']
        image_name = request.get_json()['img_name']
        encoded_data = base64_image.split(',')[1]
        decoded_data = base64.b64decode(encoded_data)

        # Convert the decoded data to an image
        image = Image.open(io.BytesIO(decoded_data))

        if image.mode == 'RGBA':
            image = image.convert('RGB')

        # Save the image to a folder with a unique filename
        uploads_dir = os.path.join(os.path.dirname(__file__), 'uploads')
        if not os.path.exists(uploads_dir):
            os.makedirs(uploads_dir)

        unique_filename = generate_unique_filename()
        filename = image_name if image_name != "" else unique_filename
        if image_name != "":
            unique_filename = image_name
        
        image.save(os.path.join(uploads_dir, filename+".jpeg"), format='JPEG')

        print("--------- Image Uploaded Successfully ---------")
        print(">>>>>>> Classifying Image <<<<<<<<<")
        imgpath = os.path.join(uploads_dir, filename+".jpeg")
        predict = predict_image(imgpath)
        print(">>>>>>> Image Classified <<<<<<<<<")
        print(predict)
        answer = {
            "text": {
                "toxicity" : f"{text_results['toxicity']*100:.2f}%",
                "severe_toxicity" : f"{text_results['severe_toxicity']*100:.2f}%",
                "obscene" : f"{text_results['obscene']*100:.2f}%",
                "threat" : f"{text_results['threat']*100:.2f}%",
                "insult" : f"{text_results['insult']*100:.2f}%",
                "identity_attack" : f"{text_results['identity_attack']*100:.2f}%",
            },
        "img" : predict
        }
        return jsonify(answer)
    
@api.route('/posttweet', methods=['POST'])
@cross_origin(origin='*')
def post_tweet():
    print("--------- Posting Tweet ---------")
    data = request.get_json()
    text = data['text'];
    img = data['img'];
    img_path = './uploads/'+img+'.jpeg'

    if img == "":
        print("--------- No Image Selected ---------")
        client.create_tweet(text=text)
    else:
        media_id = tweet_api.media_upload(filename=img_path).media_id_string
        print(media_id)
        client.create_tweet(text=text, media_ids=[media_id])
    print(" >>>>>>>> Tweeted! <<<<<<<<<")
    answer = {
        "tweet" : "true"
    }
    return jsonify(answer)

    



def generate_unique_filename():
    import uuid
    return str(uuid.uuid4()) + '.jpg'


if __name__ == '__main__':
    api.run(debug=True)

