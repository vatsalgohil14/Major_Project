import sys
sys.path.append("..")

from detoxify.detox import Detoxify, toxic_bert
from transformers import BertForSequenceClassification


CLASSES = [
    "toxicity",
    "severe_toxicity",
    "obscene",
    "threat",
    "insult",
    "identity_attack"
    ]


def test_model_toxic_bert():
    model = toxic_bert()
    assert isinstance(model, BertForSequenceClassification)

# Testing the original model with predefined sentences
def test_original():
    flag = False
    model = Detoxify("original")
    sentences = ["shut up, you liar", "i am a jewish woman who is blind", 'you should die']
    results = model.predict(sentences)
    
    print("Results for 'original' model:")
    for i, sentence in enumerate(sentences):
        print(f"Predictions for '{sentence}':")
        for class_name in CLASSES:
            print(f" {class_name} : {results[class_name][i]*100:.2f}%")
            if(results[class_name][i]*100 > 50):
                flag = True
        if(flag):
            print(f" << Hateful >>\n")
        else:
            print(f" << Not Hateful >>\n")

        # Again reset the flag for next sentence
        flag = False

# Taking input from user
def test_original_input(sentence):
    flag = False
    model = Detoxify("original")
    results = model.predict(sentence)

    print(f"Predictions for '{sentence}':")
    # for class_name in CLASSES:
    #     print(f" {class_name} : {results[class_name]*100:.2f}%")
    #     if(results[class_name]*100 > 50):
    #         flag = True
    # if(flag):
    #     print(f" << Hateful >>\n")
    # else:
    #     print(f" << Not Hateful >>\n")
    
    return results


# Calling the functions
# test_original()

# user_input = input("Enter a sentence: ")
# test_original_input(user_input)
# print("End of test.")