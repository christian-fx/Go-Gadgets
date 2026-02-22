# Go Gadgets - E-Commerce Storefront

A modern, fast, and fully functional Single Page Application (SPA) built with **Vanilla JavaScript**, **Tailwind CSS**, and **Firebase**. This project serves as the customer-facing storefront for the Go Gadgets e-commerce platform.

## Features

*   **Custom SPA Router**: A lightweight, history-API based JavaScript router for seamless, reload-free page navigation.
*   **Firebase Authentication**: 
    *   Email & Password login/signup.
    *   Google OAuth integration.
    *   Email verification workflows & password resets.
*   **Real-time Database**: Integrates directly with Firestore to fetch products, trending items, and categories dynamically.
*   **Shopping Cart**: Persistent cart state managed via `localStorage`.
*   **Secure Checkout**: Utilizes Firestore Transactions (`runTransaction`) to guarantee atomicity—verifying stock levels and deducting inventory precisely before creating an order.
*   **Account Management (Full CRUD)**:
    *   Users can manage their profiles.
    *   Add, edit, view, and delete multiple Shipping Addresses and Payment Methods directly to their user document in Firestore.
    *   View real-time order history with expandable, detailed invoices.
*   **Responsive Design**: Fully styled with Tailwind CSS to look stunning on mobile, tablet, and desktop devices.

## Tech Stack

*   **Frontend**: HTML5, Vanilla JavaScript (ES6+), Tailwind CSS
*   **Backend / BaaS**: Firebase Authentication, Cloud Firestore
*   **Tooling**: Vite (via `npm run dev`)

## Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.
You will also need a Firebase project set up with **Authentication** (Email/Password & Google enabled) and **Firestore Database** initialized.

### Installation

1.  **Clone the repository** (or download the source code).
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Environment Variables**:
    Create a `.env` file in the root of the project and add your Firebase configuration details:
    ```env
    VITE_FIREBASE_API_KEY="your-api-key"
    VITE_FIREBASE_AUTH_DOMAIN="your-auth-domain"
    VITE_FIREBASE_PROJECT_ID="your-project-id"
    VITE_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
    VITE_FIREBASE_MESSAGING_SENDER_ID="your-messaging-sender-id"
    VITE_FIREBASE_APP_ID="your-app-id"
    ```

4.  **Run the Development Server**:
    ```bash
    npm run dev
    ```
    This will start the local server. Open the provided `localhost` link in your browser to view the app!

## Project Structure

*   `index.html` - The main entry point and app shell (contains Navbar and Footer).
*   `src/router.js` - Handles client-side routing.
*   `src/store.js` - Lightweight global state management (handles Cart and Auth state).
*   `src/api/firebase-config.js` - Initializes Firebase services.
*   `src/pages/` - Contains the logic and HTML templates for each route (`Home.js`, `Store.js`, `Product.js`, `Account.js`, `Auth.js`, `Checkout.js`, `Cart.js`).
*   `src/style.css` - Global Tailwind imports and custom CSS rules.

## License
This project is open-source and available under the MIT License.
