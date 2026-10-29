import os
import logging
import csv
from pathlib import Path
from typing import Dict, Any, Optional, Tuple

import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

from app.config import settings
from app.utils.text_processing import normalize_text

logger = logging.getLogger(__name__)

class EmailClassifierService:
    def __init__(self):
        self.model: Optional[Pipeline] = None
        self.classes: list = ["legitimate", "phishing", "spam"]
        self.evaluation_metrics: Dict[str, Any] = {}
        self.is_trained: bool = False

    def load_dataset(self, csv_path: str) -> Tuple[list, list]:
        """Loads email dataset from CSV file."""
        texts = []
        labels = []
        if not os.path.exists(csv_path):
            raise FileNotFoundError(f"Training dataset not found at: {csv_path}")

        with open(csv_path, mode="r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                subject = row.get("subject", "")
                body = row.get("body", "")
                category = row.get("category", "").strip().lower()
                if category in self.classes and (subject or body):
                    # Combine subject and body for classification representation
                    combined_text = normalize_text(f"{subject} {body}")
                    texts.append(combined_text)
                    labels.append(category)

        return texts, labels

    def train_and_evaluate(self, dataset_path: str = None, save_path: str = None) -> Dict[str, Any]:
        """
        Trains TF-IDF + Logistic Regression classification pipeline
        on the dataset and records actual performance metrics.
        """
        dataset_path = dataset_path or settings.DATASET_PATH
        save_path = save_path or settings.MODEL_PATH

        logger.info(f"Loading training data from {dataset_path}...")
        texts, labels = self.load_dataset(dataset_path)

        if len(texts) < 10:
            raise ValueError(f"Dataset has too few records ({len(texts)}) for reliable training.")

        # Stratified train-test split for evaluation
        X_train, X_test, y_train, y_test = train_test_split(
            texts, labels, test_size=0.25, random_state=42, stratify=labels
        )

        pipeline = Pipeline([
            ("tfidf", TfidfVectorizer(
                ngram_range=(1, 2),
                max_features=2500,
                stop_words="english",
                sublinear_tf=True
            )),
            ("clf", LogisticRegression(
                C=2.0,
                max_iter=300,
                random_state=42,
                class_weight="balanced"
            ))
        ])

        pipeline.fit(X_train, y_train)
        y_pred = pipeline.predict(X_test)

        acc = float(accuracy_score(y_test, y_pred))
        prec = float(precision_score(y_test, y_pred, average="weighted", zero_division=0))
        rec = float(recall_score(y_test, y_pred, average="weighted", zero_division=0))
        f1 = float(f1_score(y_test, y_pred, average="weighted", zero_division=0))

        self.evaluation_metrics = {
            "accuracy": round(acc, 4),
            "precision": round(prec, 4),
            "recall": round(rec, 4),
            "f1_score": round(f1, 4),
            "total_samples": len(texts),
            "train_samples": len(X_train),
            "test_samples": len(X_test),
            "classes": list(pipeline.classes_)
        }

        self.model = pipeline
        self.is_trained = True

        # Ensure directory exists and persist model
        Path(save_path).parent.mkdir(parents=True, exist_ok=True)
        joblib.dump({
            "model": self.model,
            "metrics": self.evaluation_metrics
        }, save_path)

        logger.info(f"Model successfully trained and saved to {save_path}. Metrics: {self.evaluation_metrics}")
        return self.evaluation_metrics

    def initialize(self):
        """Loads persisted model or trains fresh if artifact missing."""
        if os.path.exists(settings.MODEL_PATH):
            try:
                data = joblib.load(settings.MODEL_PATH)
                self.model = data.get("model")
                self.evaluation_metrics = data.get("metrics", {})
                self.is_trained = True
                logger.info(f"Loaded existing trained model from {settings.MODEL_PATH}")
                return
            except Exception as e:
                logger.warning(f"Failed to load cached model ({e}), retraining fresh...")

        # Train model if not cached or failed
        self.train_and_evaluate()

    def predict(self, text: str) -> Dict[str, Any]:
        """
        Runs model inference on normalized text.
        Returns predicted category, calibrated probabilities, and confidence.
        """
        if self.model is None or not self.is_trained:
            self.initialize()

        norm_text = normalize_text(text)
        if not norm_text:
            return {
                "predicted_label": "legitimate",
                "probabilities": {"legitimate": 1.0, "phishing": 0.0, "spam": 0.0},
                "confidence": 0.5,
                "is_trained": self.is_trained,
                "metrics": self.evaluation_metrics
            }

        probs = self.model.predict_proba([norm_text])[0]
        class_probs = {cls_name: float(p) for cls_name, p in zip(self.model.classes_, probs)}

        # Determine highest probability class
        predicted_class = max(class_probs.items(), key=lambda x: x[1])[0]
        confidence = round(class_probs[predicted_class], 4)

        return {
            "predicted_label": predicted_class,
            "probabilities": class_probs,
            "confidence": confidence,
            "is_trained": self.is_trained,
            "metrics": self.evaluation_metrics
        }

classifier_service = EmailClassifierService()
