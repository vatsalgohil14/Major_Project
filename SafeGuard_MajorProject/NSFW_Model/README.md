```

Note: Make sure you change EOL Conversion into Unix before running script files
i.e Open filename.sh file in Notepad++ then
    Go to:  Edit --> EOL Conversion --> Unix

Step 1: First get the urls by running scripts inside scripts folder Run: ./1_get_urls.sh (No need to run it now, already scrapped enough urls and stored it inside Folder: raw_data > class_name > urls_class_name.txt )
    Step 1.1: We will use Save Tab extension to download the images. Copy urls from urls_class_name.txt and save in that respective folder

Step2: Run "./2_create_train_.sh" in terminal
Step3: Run "./3_create_test_.sh" in terminal
Step 4: Execute train_model.ipynb file

Important:
Running train_model.ipynb in Python venv Environment. If not then create new Environment and activate it

Requirements for train_model.ipynb
pip install fastai==2.7.13
pip install opencv-python
pip install pathlib

```
