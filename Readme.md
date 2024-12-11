# Inventory Management System

A full-stack Inventory Management System built with Node.js, Express, React.js, Redis, AWS DynamoDB, and Swagger UI for API documentation.

## Features

### Backend Features
- User Authentication (JWT-based) with Role-Based Access Control (RBAC)
- Inventory Management:
  - Add, update, delete, and view items
  - Low-stock notifications
  - Export inventory reports as CSV
- Sales Management:
  - Record sales transactions with customer details and timestamps in IST
  - Export sales reports as CSV
  - View sales summaries
- Analytics:
  - Total sales for a specific period
  - Top-selling items
  - Low-stock alerts
  - Total inventory value

### Frontend Features (Planned)
- Dashboard for admins, inventory managers, and sales personnel
- Visualizations for sales trends and inventory distribution

## Tech Stack
- **Backend**: Node.js, Express
- **Database**: AWS DynamoDB
- **Cache**: Redis
- **API Documentation**: Swagger UI
- **Deployment**: Render

## Getting Started

### Prerequisites
- Node.js and npm installed
- AWS credentials configured (`aws configure`)
- Redis installed and running locally or on a cloud service

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/inventory-management.git
   cd inventory-management
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file and configure it:
   ```env
   PORT=5000
   JWT_SECRET=your_jwt_secret
   REDIS_URL=redis://localhost:6379
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   DYNAMODB_REGION=your_dynamodb_region
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_email_password
   ```

4. Start the server:
   ```bash
   npm start
   ```

### API Documentation
Visit [http://localhost:5000/api-docs](http://localhost:5000/api-docs) for Swagger UI documentation.

## Deployment

### Deploy to Render
1. Create a new web service on Render.
2. Connect your GitHub repository.
3. Configure the following build and start commands:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add environment variables in Render's dashboard.
5. Deploy the service.

## Contributing
Contributions are welcome! Please fork this repository and create a pull request.

## License
This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.