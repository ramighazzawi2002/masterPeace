# MasterPiece

MasterPiece is a comprehensive platform that offers a variety of features including articles, workshops, products, and more. It is built using modern web technologies to provide a seamless user experience.

## Features

- **Articles**: Read and write articles on various topics.
- **Workshops**: Participate in workshops and enhance your skills.
- **Products**: Browse and purchase products.
- **User Authentication**: Secure login and signup using email or Google.
- **Admin Dashboard**: Manage articles, workshops, products, and users.

## Technologies Used

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Node.js, Express, Sequelize, PostgreSQL
- **Authentication**: JWT, Google OAuth
- **Payment**: Stripe, PayPal

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ramighazzawi2002/masterPiece.git
   ```
2. Navigate to the project directory:
   ```bash
   cd masterPiece
   ```
3. Install dependencies for the client:
   ```bash
   cd client
   npm install
   ```
4. Install dependencies for the server:
   ```bash
   cd ../server
   npm install
   ```
5. Set up environment variables:
   - Create a `.env` file in the `server` directory and add the following:
     ```
     DB_NAME=your_database_name
     DB_PASSWORD=your_database_password
     JWT_SECRET=your_jwt_secret
     EMAIL=your_email
     PASSWORD=your_email_password
     GOOGLE_CLIENT_ID=your_google_client_id
     GOOGLE_CLIENT_SECRET=your_google_client_secret
     GOOGLE_REDIRECT_URI=your_google_redirect_uri
     ```
6. Run the development server:
   ```bash
   cd ../client
   npm run dev
   ```
7. Run the backend server:
   ```bash
   cd ../server
   npm start
   ```
   
## Usage

- Open your browser and navigate to `http://localhost:5173/masterPiece` to access the frontend.
- The backend server will be running on `http://localhost:5000`.

## Project Structure

- `client/`: Contains the frontend code.
  - `src/`: Source code for the React application.
  - `public/`: Public assets.
- `server/`: Contains the backend code.
  - `controllers/`: Handles the logic for different routes.
  - `models/`: Defines the database models.
  - `routes/`: Defines the API routes.
  - `migrations/`: Database migration files.
  - `seeders/`: Database seeder files.
  - `middleware/`: Custom middleware functions.
  - `config/`: Configuration files.

## Contact Information

- **Author**: Rami Ghazzawi
- **Email**: rami.ghazzawiabed@gmail.com

## Project Links

- [Trello](https://trello.com/invite/b/672a01eeaa4968b12966b79c/ATTI9144b0c143a353fb99ea9992fac4f77eA82F70B6/master-piece)
- [Figma](https://www.figma.com/design/ttzneYCK8kreNzmudfOujZ/masterpeace?node-id=0-1&t=pjbBfw3moW1ecDCS-1)
- [Presentation](https://www.canva.com/design/DAGVmh2l5Xs/GKPwSdZHXETenqTC0XAV7Q/edit?utm_content=DAGVmh2l5Xs&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)
- [Project Documentation](./Jordan Heritage Project Brief.pdf)
- [Project Brief](./Jordan_Heritage_Project_Documentation.pdf)

## Note

- This project is private and cannot be cloned.
