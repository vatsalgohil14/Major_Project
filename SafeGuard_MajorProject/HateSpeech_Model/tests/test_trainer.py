import sys
sys.path.append("..")

import json
import src.data_loaders as module_data
import torch
from pytorch_lightning import seed_everything, Trainer
from torch.utils.data import DataLoader
from train import ToxicClassifier


def initialize_trainer(CONFIG):
    seed_everything(1234)
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    def get_instance(module, name, config, *args, **kwargs):
        return getattr(module, config[name]["type"])(*args, **config[name]["args"], **kwargs)

    model = ToxicClassifier(CONFIG)
    model.to(device)

    dataset = get_instance(module_data, "dataset", CONFIG)
    val_dataset = get_instance(module_data, "dataset", CONFIG, train=False)

    data_loader = DataLoader(
        dataset,
        batch_size=CONFIG["batch_size"],
        num_workers=3,
        shuffle=True,
        drop_last=True,
        pin_memory=True,
    )

    valid_data_loader = DataLoader(
        val_dataset,
        batch_size=CONFIG["batch_size"],
        num_workers=5,
        shuffle=False,
    )

    trainer = Trainer(
        gpus=0 if torch.cuda.is_available() else None,
        limit_train_batches=3,
        limit_val_batches=3,
        max_epochs=9,
    )
    trainer.fit(model, data_loader, valid_data_loader)
    results = trainer.test(dataloaders=valid_data_loader)

    return results


def test_trainer():
    CONFIG = json.load(open("../configs/Toxic_comment_classification_BERT.json"))
    CONFIG["dataset"]["args"]["train_csv_file"] = "dummy_data/jigsaw-toxic-comment-classification-challenge/train.csv"
    CONFIG["dataset"]["args"]["test_csv_file"] = "dummy_data/jigsaw-toxic-comment-classification-challenge/test.csv"
    CONFIG["batch_size"] = 4

    results = initialize_trainer(CONFIG)
    print(results)
    print(f"Test accuracy: {results[0]['test_acc']:.2f} and test loss: {results[0]['test_loss']:.2f} ")
    assert results[0]["test_acc"] > 0.3


if __name__ == "__main__":
    test_trainer()

""" 
dataloader:
    num_workers=2
trainer:
    limit_train_batches=3,
    limit_val_batches=3,
    max_epochs=4,

'test_loss': 0.3557186424732208, 'test_acc': 0.7647058963775635}

dataloader:
    num_workers=2
trainer:
    limit_train_batches=3,
    limit_val_batches=3,
    max_epochs=7,

[{'test_loss': 0.32850465178489685, 'test_acc': 0.7647058963775635}]

dataloader:
    num_workers=4
trainer:
    limit_train_batches=3,
    limit_val_batches=3,
    max_epochs=6,
[{'test_loss': 0.2654941976070404, 'test_acc': 0.7647058963775635}]

dataloader:
    num_workers=5
CONFIG["batch_size"] = 2
trainer:
    limit_train_batches=3,
    limit_val_batches=3,
    max_epochs=9,
[{'test_loss': 0.21046403050422668, 'test_acc': 0.7647058963775635}]

dataloader:
    num_workers=5
CONFIG["batch_size"] = 4
trainer:
    limit_train_batches=3,
    limit_val_batches=3,
    max_epochs=9,
[{'test_loss': 0.2397284209728241, 'test_acc': 0.8976035118103027}]
"""