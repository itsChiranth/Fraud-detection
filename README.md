# Enhanced AI-Powered Fraud Detection Dashboard

A full-stack application for detecting fraudulent banking transactions using AI, with enhanced user interaction and data visualization features.

## Project Structure

- **Frontend**: Next.js with Tailwind CSS and ShadCN components
- **Backend**: Node.js API routes
- **AI Model**: Python FastAPI server

## Enhanced Features

### Frontend
- **Interactive Table**: Sortable columns and pagination for transaction data
- **Transaction Details Modal**: Detailed view of each transaction with risk analysis
- **Add Transaction Form**: User-friendly form to manually add and analyze transactions
- **Data Visualization**: Charts and graphs showing fraud metrics and trends
- **Responsive Design**: Works on all device sizes

### Backend
- **Enhanced API Routes**: Support for pagination, sorting, and filtering
- **Data Persistence**: Transaction data stored in JSON file
- **Mock Data Generation**: Realistic Indian-based mock data

### AI Model
- **Robust Data Validation**: Input validation and error handling
- **Risk Factor Analysis**: Detailed risk assessment for each transaction
- **Indian Context**: Model tuned for Indian transaction patterns

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- Python (v3.8 or later)
- pip (Python package manager)

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/fraud-detection-dashboard.git
   cd fraud-detection-dashboard
   \`\`\`

2. Install frontend dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Install Python dependencies:
   \`\`\`bash
   pip install fastapi uvicorn scikit-learn numpy pydantic
   \`\`\`

### Running the Application

1. Start the Python FastAPI server:
   \`\`\`bash
   cd model
   python main.py
   \`\`\`

2. In a new terminal, start the Next.js application:
   \`\`\`bash
   npm run dev
   \`\`\`

3. Open your browser and navigate to `http://localhost:3000/dashboard`

## API Endpoints

### Frontend to Backend

- `POST /api/predict`: Send transaction data for fraud detection
- `GET /api/recent-transactions`: Get transactions with pagination and sorting
- `GET /api/visualization-data`: Get data for visualization components

### Backend to AI Model

- `POST http://localhost:8000/predict`: Send transaction data to the AI model for prediction
- `GET http://localhost:8000/health`: Check the health status of the AI model

## Using the Dashboard

1. **View Transactions**: Browse through the paginated transaction table
2. **Sort Transactions**: Click on column headers to sort by that field
3. **View Details**: Click on a transaction row or the info icon to see detailed information
4. **Add Transaction**: Click "Add Transaction" to manually enter and analyze a new transaction
5. **Visualize Data**: Use the visualization tabs to see different charts and graphs

## License

MIT
