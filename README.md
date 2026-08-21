# 🍬 Sweety Pie — Bengali Sweets E-Commerce Platform

**Sweety Pie** is a full-stack e-commerce platform designed for selling authentic Bengali sweets and confectionery products online.

The application provides a complete shopping experience for customers, including authentication, product discovery, filtering, cart management, secure online payments, order tracking, user profiles, and PDF invoice generation.

It also includes a dedicated **Admin Dashboard** for managing products, categories, promotional banners, customer queries, inventory, and orders.

---

## ✨ Features

### 👤 User Authentication

* User registration and login
* Secure password hashing using **bcrypt**
* JWT-based authentication
* HTTP cookie-based authentication
* Protected user and admin routes
* Separate access levels for:

  * **Shopping User**
  * **Administrator**

---

## 🛍️ Customer Features

### 🏠 Dynamic Home Dashboard

Users can explore the store through a dynamic homepage containing:

* Promotional banners
* Featured products
* Discounted products
* Product categories
* Product discovery sections

### 🔎 Product Discovery

Users can:

* Browse all available sweets
* Filter products by category
* Filter products by price
* View product cards
* View product ratings
* See original and discounted prices
* Open detailed product pages
* View complete product descriptions

### 🛒 Shopping Cart

Users can:

* Add products to their cart
* View cart items
* Manage product quantities
* Review pricing before checkout
* Proceed to purchase

### 💳 Online Payment

The application integrates **Razorpay** as the payment gateway.

Payment flow:

```text
Product
   ↓
Shopping Cart
   ↓
Checkout
   ↓
Razorpay Payment
   ↓
Payment Verification
   ↓
Order Creation
   ↓
Order Page
```

The application uses Razorpay for secure online payment processing and handles the payment result before completing the order.

### 📦 Order Management

After a successful purchase, users can:

* View their orders
* Check order details
* Track order status
* View purchased products
* View payment/order information
* Generate invoices

Administrators can manage customer orders and update their status throughout the fulfillment process.

Example order lifecycle:

```text
Pending → Processing → Shipped → Delivered
```

### 🧾 PDF Invoice Generation

Users can generate downloadable PDF invoices for their orders.

Invoices contain relevant information such as:

* Order details
* Customer information
* Purchased products
* Quantity
* Pricing
* Total amount

The backend uses **PDFKit** and **EasyInvoice** for invoice generation.

### 👨‍💼 User Profile

Users have a dedicated profile section where they can manage and view their personal information, including location and delivery-related details.

---

# 🔐 Admin Dashboard

The platform includes a dedicated administration panel for managing the entire e-commerce system.

### 📊 Dashboard & Analytics

Administrators can monitor:

* Total orders
* Order activity
* Best-selling products
* Remaining stock
* Product inventory
* Customer queries

### 📂 Category Management

Administrators can:

* Create categories
* View categories
* Update categories
* Delete categories

### 🍭 Product Management

Complete CRUD functionality is available for products.

Administrators can:

* Create products
* View products
* Update products
* Delete products
* Manage pricing
* Manage discounted pricing
* Manage stock
* Manage product information
* Manage product images

### 🖼️ Dynamic Banner Management

Administrators can create and manage promotional banners displayed on the customer-facing dashboard.

This allows the store to dynamically promote:

* Special offers
* Discounted products
* Seasonal sweets
* Featured products
* Marketing campaigns

### 💬 Customer Queries

Administrators can view and manage queries submitted by customers.

### 📦 Order Management

Administrators can:

* View customer orders
* Inspect order details
* Monitor order activity
* Update order status
* Track fulfillment progress

---

# 🧰 Tech Stack

## Frontend

| Technology      | Purpose             |
| --------------- | ------------------- |
| React 19        | UI development      |
| Vite            | Frontend build tool |
| React Router    | Client-side routing |
| Tailwind CSS    | Styling             |
| Axios           | API communication   |
| Lucide React    | Icons               |
| React Hot Toast | Notifications       |
| React Toastify  | Toast notifications |
| ESLint          | Code quality        |

### Frontend Dependencies

```text
React
React DOM
Vite
React Router DOM
Tailwind CSS
Axios
Lucide React
React Hot Toast
React Toastify
ESLint
```

---

## Backend

| Technology    | Purpose                             |
| ------------- | ----------------------------------- |
| Node.js       | Runtime environment                 |
| Express.js    | REST API framework                  |
| MongoDB       | Database                            |
| Mongoose      | MongoDB ODM                         |
| JWT           | Authentication                      |
| bcrypt        | Password hashing                    |
| Cookie Parser | Cookie handling                     |
| CORS          | Cross-origin communication          |
| Multer        | File uploads                        |
| Cloudinary    | Image/media storage                 |
| Razorpay      | Payment gateway                     |
| PDFKit        | PDF generation                      |
| EasyInvoice   | Invoice generation                  |
| Slugify       | URL-friendly product/category slugs |
| dotenv        | Environment configuration           |

---

# 🏗️ Application Architecture

```text
                    ┌──────────────────────┐
                    │      React + Vite     │
                    │       Frontend        │
                    └──────────┬───────────┘
                               │
                               │ REST API
                               ▼
                    ┌──────────────────────┐
                    │    Node + Express    │
                    │       Backend        │
                    └──────┬───────┬───────┘
                           │       │
              ┌────────────┘       └─────────────┐
              ▼                                  ▼
      ┌─────────────────┐               ┌─────────────────┐
      │  MongoDB Atlas  │               │    Cloudinary   │
      │     Database    │               │  Image Storage  │
      └─────────────────┘               └─────────────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │     Razorpay    │
                  │ Payment Gateway │
                  └─────────────────┘
```

---

# 🔄 User Shopping Flow

```text
Register / Login
       ↓
   Home Page
       ↓
Browse Categories
       ↓
Filter Products
       ↓
View Product Details
       ↓
   Add to Cart
       ↓
    Checkout
       ↓
Razorpay Payment
       ↓
 Payment Success
       ↓
   Order Created
       ↓
   Order History
       ↓
 Generate Invoice
```

---

# 🔄 Admin Workflow

```text
Admin Login
     ↓
Admin Dashboard
     │
     ├── Category Management
     │       ├── Create
     │       ├── Update
     │       └── Delete
     │
     ├── Product Management
     │       ├── Create
     │       ├── Read
     │       ├── Update
     │       └── Delete
     │
     ├── Banner Management
     │
     ├── Customer Queries
     │
     ├── Order Management
     │
     └── Sales / Inventory Overview
```

---

# 📁 Project Structure

A simplified representation of the project structure:

```text
sweety-pie/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── assets/
│   │   └── ...
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── index.js
│   │
│   ├── package.json
│   └── ...
│
└── README.md
```

---

# ⚙️ Installation & Setup

## Prerequisites

Make sure you have the following installed:

* Node.js
* npm
* MongoDB / MongoDB Atlas
* Git

You will also need accounts/configuration for:

* Cloudinary
* Razorpay

---

## 1. Clone the Repository

```bash
git clone <your-repository-url>

cd sweety-pie
```

---

## 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

Start the frontend development server:

```bash
npm run dev
```

---

## 3. Install Backend Dependencies

Open another terminal:

```bash
cd backend
npm install
```

Start the backend development server:

```bash
npm run dev
```

---

# 🔑 Environment Variables

Create a `.env` file inside the backend directory.

Example:

```env
PORT=3000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

For the frontend, use an environment variable for the backend API URL:

```env
VITE_API_URL=http://localhost:3000
```

> Never commit `.env` files or API secrets to GitHub.

---

# 🔒 Security

The application implements several security-related practices:

* Password hashing with bcrypt
* JWT-based authentication
* HTTP cookie-based authentication
* Protected routes
* Role-based authorization
* Environment variables for sensitive credentials
* CORS configuration
* Server-side payment verification
* Admin-only management operations

---

# 💰 Payment Integration

The project uses **Razorpay** for online payments.

The payment workflow is designed so that an order is created only after the payment process has been successfully handled and verified by the backend.

For development, Razorpay's test environment can be used to simulate payments without processing real transactions.

---

# ☁️ Deployment

The application can be deployed using a separate hosting service for the frontend and backend.

Recommended setup:

```text
Frontend → Vercel
Backend  → Render
Database → MongoDB Atlas
Images   → Cloudinary
Payments → Razorpay
```

Production architecture:

```text
             Vercel
        React + Vite App
               │
               │ HTTPS
               ▼
             Render
       Node + Express API
          │           │
          ▼           ▼
     MongoDB Atlas  Cloudinary
          │
          ▼
       Razorpay
```

For production, update:

```env
CLIENT_URL=https://your-frontend-domain.com
```

and:

```env
VITE_API_URL=https://your-backend-domain.com
```

---

# 🎯 Project Objectives

The primary objective of Sweety Pie is to demonstrate the development of a complete modern e-commerce platform with both customer-facing and administrative functionality.

The project focuses on:

* Full-stack application development
* REST API development
* Authentication and authorization
* Role-based access control
* Database design
* Product and inventory management
* Payment gateway integration
* Cloud-based image storage
* Order management
* PDF document generation
* Responsive frontend development
* Admin dashboard development

---

# 🚀 Future Improvements

Potential future improvements include:

* Product reviews and verified ratings
* Wishlist functionality
* Coupon and promotional code system
* Advanced sales analytics
* Email notifications
* Order tracking with delivery updates
* Multiple delivery addresses
* Product search with advanced filtering
* Stock alerts for administrators
* Customer order cancellation/refund workflow
* Automated deployment using CI/CD
* Docker-based deployment

---

# 👨‍💻 Author

**Rounik Sarkar**

Full-Stack Web Developer

Built using the MERN ecosystem with modern frontend tooling, cloud services, and payment integration.

---

## ⭐ Project Highlights

**Sweety Pie** demonstrates an end-to-end e-commerce workflow:

> **Authentication → Product Discovery → Cart → Payment → Order Management → Invoice Generation**

while providing administrators with complete control over:

> **Products → Categories → Banners → Inventory → Orders → Customer Queries → Sales Insights**

This project was built to demonstrate practical full-stack development beyond basic CRUD functionality, including authentication, payment processing, cloud storage, order workflows, and administrative operations.
