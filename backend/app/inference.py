import torch
import torch.nn.functional as F
from torchvision import models, transforms
from PIL import Image
from pathlib import Path

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print("Using device:", device)

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406],
                         [0.229, 0.224, 0.225])
])

BASE_DIR = Path(__file__).resolve().parent.parent

STAGE1_PATH = BASE_DIR / "models" / "stage1_leaf_fruit_model.pth"
STAGE2A_PATH = BASE_DIR / "models" / "stage2A_fruit_disease_model.pth"
STAGE2B_PATH = BASE_DIR / "models" / "stage2B_leaf_disease_model.pth"

STAGE1_CLASSES = ["Fruit", "Leaf"]

FRUIT_CLASSES = [
    "Fruit_Anthracnose",
    "Fruit_FruitFly",
    "Fruit_Healthy",
    "Fruit_Scab",
    "Fruit_StylerEndRot"
]

LEAF_CLASSES = [
    "Leaf_Anthracnose",
    "Leaf_Canker",
    "Leaf_Defect",
    "Leaf_Dot",
    "Leaf_FungalSpot",
    "Leaf_Healthy",
    "Leaf_Rust"
]

def load_model(num_classes, path):
    model = models.mobilenet_v3_small(weights=None)
    model.classifier[3] = torch.nn.Linear(
        model.classifier[3].in_features, num_classes
    )
    model.load_state_dict(torch.load(path, map_location=device))
    model.to(device)
    model.eval()
    return model

stage1_model = load_model(len(STAGE1_CLASSES), STAGE1_PATH)
stage2A_model = load_model(len(FRUIT_CLASSES), STAGE2A_PATH)
stage2B_model = load_model(len(LEAF_CLASSES), STAGE2B_PATH)

def predict_guava_pipeline(image_path: str):
    img = Image.open(image_path).convert("RGB")
    x = transform(img).unsqueeze(0).to(device)

    with torch.no_grad():
        out1 = stage1_model(x)
        prob1 = F.softmax(out1, dim=1)
        idx1 = prob1.argmax(1).item()

    plant_part = STAGE1_CLASSES[idx1]
    plant_conf = prob1[0][idx1].item() * 100

    with torch.no_grad():
        if plant_part == "Fruit":
            out2 = stage2A_model(x)
            prob2 = F.softmax(out2, dim=1)
            idx2 = prob2.argmax(1).item()
            disease = FRUIT_CLASSES[idx2]
        else:
            out2 = stage2B_model(x)
            prob2 = F.softmax(out2, dim=1)
            idx2 = prob2.argmax(1).item()
            disease = LEAF_CLASSES[idx2]

    disease_conf = prob2[0][idx2].item() * 100

    return {
        "plant_part": plant_part,
        "plant_part_confidence": round(plant_conf, 2),
        "disease": disease.replace(f"{plant_part}_", ""),
        "disease_confidence": round(disease_conf, 2),
    }

def run_inference(image_path: str):
    return predict_guava_pipeline(image_path)
