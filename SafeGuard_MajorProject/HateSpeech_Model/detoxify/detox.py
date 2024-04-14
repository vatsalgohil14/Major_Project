import torch
import transformers

# Note: Uncomment line 5
DOWNLOAD_URL = "https://github.com/unitaryai/detoxify/releases/download/"
MODEL_URLS = {
    "original": DOWNLOAD_URL + "v0.1-alpha/toxic_original-c1212f89.ckpt",
}

PRETRAINED_MODEL = None


def get_model_and_tokenizer(
    model_type, model_name, tokenizer_name, num_classes, state_dict, huggingface_config_path=None
):
    model_class = getattr(transformers, model_name)
    model = model_class.from_pretrained(
        pretrained_model_name_or_path=None,
        config=huggingface_config_path or model_type,
        num_labels=num_classes,
        state_dict=state_dict,
        local_files_only=huggingface_config_path is not None,
    )
    tokenizer = getattr(transformers, tokenizer_name).from_pretrained(
        huggingface_config_path or model_type,
        local_files_only=huggingface_config_path is not None,
    )

    return model, tokenizer


def load_checkpoint(model_type="original", checkpoint=None, device="cpu", huggingface_config_path=None):
    if checkpoint is None:
        checkpoint_path = MODEL_URLS[model_type]
        loaded = torch.hub.load_state_dict_from_url(checkpoint_path, map_location=device)
    else:
        loaded = torch.load(checkpoint, map_location=device)
        if "config" not in loaded or "state_dict" not in loaded:
            raise ValueError(
                "Checkpoint needs to contain the config it was trained \
                    with as well as the state dict"
            )
    class_names = loaded["config"]["dataset"]["args"]["classes"]
    # standardise class names between models
    change_names = {
        "toxic": "toxicity",
        "identity_hate": "identity_attack",
        "severe_toxic": "severe_toxicity",
    }
    class_names = [change_names.get(cl, cl) for cl in class_names]
    model, tokenizer = get_model_and_tokenizer(
        **loaded["config"]["arch"]["args"],
        state_dict=loaded["state_dict"],
        huggingface_config_path=huggingface_config_path,
    )

    return model, tokenizer, class_names


def load_model(model_type, checkpoint=None):
    if checkpoint is None:
        model, _, _ = load_checkpoint(model_type=model_type)
    else:
        model, _, _ = load_checkpoint(checkpoint=checkpoint)
    return model


class Detoxify:
    def __init__(self, model_type="original", checkpoint=PRETRAINED_MODEL, device="cpu", huggingface_config_path=None):
        super().__init__()
        self.model, self.tokenizer, self.class_names = load_checkpoint(
            model_type=model_type,
            checkpoint=checkpoint,
            device=device,
            huggingface_config_path=huggingface_config_path,
        )
        self.device = device
        self.model.to(self.device)

    @torch.no_grad()
    def predict(self, text):
        self.model.eval()
        inputs = self.tokenizer(text, return_tensors="pt", truncation=True, padding=True).to(self.model.device)
        out = self.model(**inputs)[0]
        scores = torch.sigmoid(out).cpu().detach().numpy()
        results = {}
        for i, cla in enumerate(self.class_names):
            results[cla] = (
                scores[0][i] if isinstance(text, str) else [scores[ex_i][i].tolist() for ex_i in range(len(scores))]
            )
        return results


def toxic_bert():
    return load_model("original")

# print("➡ Loading detox.py model...\n")


