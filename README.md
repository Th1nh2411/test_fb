
# 🔥 Firebase Todo App

A full-stack Todo application built with **React + Vite** and **Firebase** (Authentication + Firestore).

Every user sees only their own todos — data is isolated at the query and security-rule level.

---

## ✨ Features

| Feature   | Details                                      |
| --------- | -------------------------------------------- |
| Auth      | Email/password register & login              |
| Todos     | Create · Read · Edit · Delete · Toggle   |
| Real-time | Firestore `onSnapshot`— updates instantly |
| Filters   | All / Active / Done                          |
| Security  | Todos filtered by `userId`in every query   |

---

## 🚀 Step 1 — Create a Firebase Project

1. Go to **[console.firebase.google.com](https://console.firebase.google.com/)** and click  **Add project** .
2. Give your project a name (e.g. `todo-app`) → Continue → Finish.

---

## 🔐 Step 2 — Enable Email/Password Authentication

1. In the Firebase console, click **Authentication** (left sidebar).
2. Click  **Get started** .
3. Under  **Sign-in method** , choose  **Email/Password** .
4. Toggle **Enable** →  **Save** .

---

## 🗄️ Step 3 — Create a Firestore Database

1. Click **Firestore Database** in the sidebar.
2. Click  **Create database** .
3. Choose **Start in test mode** (so you can read/write without extra setup while developing).

   ⚠️ For production, replace with proper security rules (see below).
4. Select a region →  **Done** .

### Recommended Firestore Security Rules (production)

Paste these in  **Firestore → Rules** :

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /todos/{todoId} {
      // Only the owner of a todo can read, write, or delete it
      allow read, write, delete: if request.auth != null
        && request.auth.uid == resource.data.userId;

      // Allow creating a new todo if the userId matches the logged-in user
      allow create: if request.auth != null
        && request.resource.data.userId == request.auth.uid;
    }
  }
}
```

---

## ⚙️ Step 4 — Get Your Firebase Config

1. In the Firebase console, click the **gear icon** →  **Project settings** .
2. Scroll down to **Your apps** → click the **</>** (Web) icon → register the app.
3. Copy the `firebaseConfig` object. It looks like:

```js
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "todo-app-xxxx.firebaseapp.com",
  projectId: "todo-app-xxxx",
  storageBucket: "todo-app-xxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123:web:abc..."
};
```

---

## 🔑 Step 5 — Configure Environment Variables

Create a `.env` file in the project root (copy from `.env.example`):

```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=todo-app-xxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=todo-app-xxxx
VITE_FIREBASE_STORAGE_BUCKET=todo-app-xxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123:web:abc...
```

> **Never commit `.env` to git.** It's already in `.gitignore`.

---

## 📦 Step 6 — Install & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 📁 Project Structure

```
src/
├── firebase.js          # Firebase init (auth + db)
├── main.jsx             # React entry point
├── index.css            # Global styles
├── App.jsx              # Router + auth guards
├── pages/
│   ├── Login.jsx        # Sign-in page
│   ├── Register.jsx     # Sign-up page
│   └── TodoPage.jsx     # Main todo page (CRUD + real-time)
└── components/
    ├── TodoForm.jsx     # "Add todo" input
    ├── TodoList.jsx     # Renders list or empty state
    └── TodoItem.jsx     # Single todo row (edit/delete/toggle)
```

---

## 🗂️ Firestore Document Shape

Collection: **`todos`**

```json
{
  "title":     "Buy milk",
  "completed": false,
  "userId":    "uid_of_owner",
  "createdAt": "<Firestore Timestamp>"
}
```

---

## 🛠️ Build for Production

```bash
npm run build      # outputs to /dist
npm run preview    # preview the production build locally
```

---

## 💡 Tips

* **Double-click** a todo title to edit it inline.
* Only **active** (incomplete) todos can be edited.
* Todos are ordered newest-first via `createdAt` timestamp.
* Firestore `onSnapshot` gives you **live updates** — open two tabs to see it in action!
