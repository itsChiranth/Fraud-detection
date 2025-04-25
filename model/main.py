from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, validator
from typing import Dict, Any, Optional
import random
import uvicorn
from datetime import datetime
import numpy as np
from sklearn.ensemble import RandomForestClassifier

app = FastAPI(title="Fraud Detection Model API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock model (in a real scenario, you would load a pre-trained model)
class MockModel:
    def __init__(self):
        # Initialize a simple RandomForestClassifier as our mock model
        self.model = RandomForestClassifier(n_estimators=10, random_state=42)
        
        # Create some mock training data
        X = np.random.rand(1000, 4)  # 4 features
        y = np.random.randint(0, 2, 1000)  # Binary classification
        
        # Train the model
        self.model.fit(X, y)
    
    def predict(self, features: Dict[str, Any]) -> float:
        # Extract features from the transaction
        amount = float(features.get('amount', 0))
        
        # Location risk factor (higher for certain locations)
        location_risk = {
            'Mumbai': 0.2,
            'Delhi': 0.3,
            'Bangalore': 0.1,
            'Hyderabad': 0.15,
            'Chennai': 0.2,
            'Kolkata': 0.25,
            'Pune': 0.1,
            'Ahmedabad': 0.2,
            'Jaipur': 0.3,
            # Default risk for unknown locations
            'default': 0.5
        }
        
        location = features.get('location', 'default')
        loc_risk = location_risk.get(location, location_risk['default'])
        
        # Time risk factor (higher for night transactions)
        time_risk = {
            'Morning': 0.1,
            'Afternoon': 0.2,
            'Evening': 0.3,
            'Night': 0.6,
            'Late Night': 0.8,
            # Default risk for unknown time
            'default': 0.5
        }
        
        time = features.get('time', 'default')
        time_risk_value = time_risk.get(time, time_risk['default'])
        
        # Device risk factor
        device_risk = {
            'Mobile Android': 0.3,
            'Mobile iOS': 0.2,
            'Desktop Windows': 0.15,
            'Desktop Mac': 0.1,
            'Tablet': 0.25,
            # Default risk for unknown device
            'default': 0.5
        }
        
        device = features.get('device', 'default')
        dev_risk = device_risk.get(device, device_risk['default'])
        
        # Create feature vector
        X = np.array([[
            amount / 10000,  # Normalize amount
            loc_risk,
            time_risk_value,
            dev_risk
        ]])
        
        # Get model probability
        proba = self.model.predict_proba(X)[0][1]
        
        # Convert to fraud score (0-100)
        fraud_score = int(proba * 100)
        
        # Add some randomness for demo purposes
        fraud_score = min(100, max(0, fraud_score + random.randint(-10, 10)))
        
        return fraud_score

# Initialize our mock model
model = MockModel()

class Transaction(BaseModel):
    amount: float = Field(..., gt=0, description="Transaction amount in INR")
    location: str = Field(..., min_length=1, description="Transaction location")
    time: str = Field(..., min_length=1, description="Time of day")
    device: str = Field(..., min_length=1, description="Device used for transaction")
    
    @validator('location')
    def validate_location(cls, v):
        valid_locations = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad", "Jaipur"]
        if v not in valid_locations:
            raise ValueError(f"Location must be one of: {', '.join(valid_locations)}")
        return v
    
    @validator('time')
    def validate_time(cls, v):
        valid_times = ["Morning", "Afternoon", "Evening", "Night", "Late Night"]
        if v not in valid_times:
            raise ValueError(f"Time must be one of: {', '.join(valid_times)}")
        return v
    
    @validator('device')
    def validate_device(cls, v):
        valid_devices = ["Mobile Android", "Mobile iOS", "Desktop Windows", "Desktop Mac", "Tablet"]
        if v not in valid_devices:
            raise ValueError(f"Device must be one of: {', '.join(valid_devices)}")
        return v

class PredictionResponse(BaseModel):
    fraudScore: int
    riskFactors: Dict[str, str]
    timestamp: str

@app.post("/predict", response_model=PredictionResponse)
async def predict(transaction: Transaction):
    try:
        # Convert transaction to dictionary
        transaction_dict = transaction.dict()
        
        # Get prediction from model
        fraud_score = model.predict(transaction_dict)
        
        # Determine risk factors
        risk_factors = {}
        
        # Amount risk
        if transaction.amount > 20000:
            risk_factors["amount"] = "High"
        elif transaction.amount > 5000:
            risk_factors["amount"] = "Medium"
        else:
            risk_factors["amount"] = "Low"
            
        # Location risk
        if transaction.location in ["Delhi", "Mumbai"]:
            risk_factors["location"] = "Medium"
        elif transaction.location in ["Kolkata", "Jaipur"]:
            risk_factors["location"] = "Medium"
        else:
            risk_factors["location"] = "Low"
            
        # Time risk
        if transaction.time in ["Night", "Late Night"]:
            risk_factors["time"] = "High"
        elif transaction.time == "Evening":
            risk_factors["time"] = "Medium"
        else:
            risk_factors["time"] = "Low"
            
        # Device risk
        if transaction.device == "Mobile Android":
            risk_factors["device"] = "Medium"
        elif transaction.device == "Tablet":
            risk_factors["device"] = "Medium"
        else:
            risk_factors["device"] = "Low"
        
        return {
            "fraudScore": fraud_score,
            "riskFactors": risk_factors,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
