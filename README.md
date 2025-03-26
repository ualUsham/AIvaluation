# AIvaluation- Take your interview preperation to the next level.

This repository contains the frontend code for my all interview app AIvaluation, which analyzes resumes using Google's Gemini API and provides an interview experience. The link to the website is https://aivaluation.vercel.app/home . I have deployed the backend separately on https://aivaluation.onrender.com . So, no need to set up for the backend.

## 🚀 Features
- Upload your resume in .pdf
- Extract and analyze your skills using AI
- Generate technical interview questions
- Evaluate your responses to determine candidate suitability
- Grade you on a scale of 10

---

## 📌 Prerequisites
Ensure you have the following installed:
- **Node.js** (v18 or later) - [Download Node.js](https://nodejs.org/)
- **npm** (comes with Node.js) or
- **Git** - [Download Git](https://git-scm.com/)

---

## How to run locally

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/yourusername/aivaluation-frontend.git
cd aivaluation-frontend
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Configure Environment Variables
Create a `.env` file in the root directory and add the necessary environment variables:
```
GOOGLE_API_KEY = your Gemini API key 
(You need to create it through Google Cloud Console: https://aistudio.google.com/app/apikey)

REACT_APP_BACKEND_URL=https://aivaluation.onrender.com
```

### 4️⃣ Start the Development Server
```sh
npm start
```

The app will be available at **http://localhost:3000/**.

---

## 🛠 Deployment
To build the project for production:
```sh
npm run build
```

That's it!! Feel free to contact me through my website incase of any queries. https://profile-usham-adhitya-luwang.onrender.com/

