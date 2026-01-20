# 🍽️ FeastDelights - Restaurant Management System
**FeastDelights** is a modern, full-stack web application designed to streamline restaurant operations. It provides a seamless experience for customers to browse menus and place orders, while offering a robust administrative dashboard for managing inventory, orders, and sales.

---

## ✨ Features

### 👤 Customer Portal
*   **User Authentication**: Secure Signup and Login.
*   **Interactive Menu**: Browse categorized items with rich visuals.
*   **Smart Cart**: Real-time cart management and total calculation.
*   **Order Tracking**: View order history and live status updates.
*   **Profile Management**: Manage personal details and delivery addresses.
*   **Cross-Tab Sessions**: Independent sessions allow users to be logged in as different users in separate tabs.

### 🛡️ Admin Dashboard
*   **Operational Overview**: Real-time stats on active orders and revenue.
*   **Menu Control**: Add, edit, or remove items; manage stock and availability.
*   **Order Management**: Process incoming orders (Pending → Completed).
*   **Offers & Discounts**: Create promotional campaigns.
*   **Customer Insights**: View registered users and order history.

---

## 🚀 Tech Stack

*   **Frontend**: React.js, Tailwind CSS, Context API
*   **Backend**: Django (Python), Django REST Framework
*   **Database**: Supabase (PostgreSQL)
*   **Authentication**: Custom Session Management (SessionStorage)

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
*   [Python 3.8+](https://www.python.org/downloads/)
*   [Node.js 14+](https://nodejs.org/) & npm
*   [Git](https://git-scm.com/)

You also need a **Supabase** account.

---

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/affanrehman1/feast-delights.git
cd feast-delights
```

### 2. Database Setup (Supabase)
1.  Create a new project on [Supabase](https://supabase.com/).
2.  Go to **Project Settings > API** and copy your:
    *   `Project URL`
    *   `anon` public key
3.  You will need to create the necessary tables (`customer`, `menu_item`, `order_header`, `order_item`, `offer`, `notification`, `payment`) matching the schema used in the application.

### 3. Backend Configuration (Django)

Navigate to the backend directory:
```bash
cd myproject
```

**Create a Virtual Environment:**
```bash
python -m venv venv
# Windows
.\venv\Scripts\activate
# Mac/Linux
source venv/bin/activate
```

**Install Dependencies:**
```bash
pip install -r ../requirements.txt
```

**Configure Environment Variables:**
Create a `.env` file in the `myproject/` folder (same level as `manage.py`) and add your Supabase credentials:
```ini
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
```

**Run the Backend Server:**
```bash
python manage.py runserver
```
The server will start at `http://127.0.0.1:8000/`.

### 4. Frontend Configuration (React)

Open a new terminal and navigate to the frontend directory:
```bash
cd myproject/restaurant-frontend-main
```

**Install Dependencies:**
```bash
npm install
```

**Configure Environment Variables:**
Create a `.env` file in the `restaurant-frontend-main/` folder and add the same credentials:
```ini
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_KEY=your_supabase_anon_key
```

**Start the Frontend:**
```bash
npm start
```
The application will open at `http://localhost:3000/`.

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/place_order/` | Submit a complete order |
| `GET` | `/menu/get_items/` | Fetch all menu items |
| `POST` | `/menu/items/` | Add a new menu item (Admin) |
| `POST` | `/offers/` | Create a new offer (Admin) |
| `GET` | `/orders/get_order_headers/` | Fetch all orders (Admin) |

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.


