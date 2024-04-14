from glob import glob
from collections.abc import Iterable    
from fastai import *
from pathlib import Path
# import fastai
from fastai.vision import *
from fastai.vision.all import *
from fastai.text.all import *
import os
# print(fastai.__version__)

# glob(str(path/'*'))

print("===> Loading NSFW Model.")

def predict_image():
    path = Path('data') 
    print(path.ls())
    print("✅Execution Started!!")
    data1 = ImageDataLoaders.from_folder(path,
                                    train='train',
                                    valid='test',
                                    num_workers=12,
                                    item_tfms=Resize(460),
                                    batch_tfms=[*aug_transforms(size=224), Normalize.from_stats(*imagenet_stats)])
    print(data1)
    learn = vision_learner(data1, models.resnet34, metrics=accuracy)
    learn = learn.load('resnet34_model')
    pth1 = r"D:\SPIT\MajorProject\NSFW_Model\raw_data\hentai\IMAGES\0bfocjvir1d21.jpg"
    # pth = r'D:\SPIT\MajorProject\NSFW_Model\raw_data\porn\IMAGES\99707718_013_6827.jpg'
    prediction = learn.predict(pth1)
    print("Your Image classified as: " + prediction[0])
    print("✅Execution Stopped!!")

predict_image()
