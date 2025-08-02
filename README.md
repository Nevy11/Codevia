# Codevia - AI-Driven E-Learning Platform

Codevia is a modern **e-learning platform** built with **Angular** and **Supabase**, designed for interactive and adaptive learning.  
It allows learners to **watch YouTube video lessons** while coding in a **Monaco code editor (like VS Code)** directly inside the browser.  

---

## ✨ Features
- **User Authentication** (Sign up, login, email confirmation) using Supabase Auth.
- **Interactive Code Editor** with `ngx-monaco-editor` (VS Code-like experience).
- **YouTube Lesson Integration** – watch lessons while coding.
- **Modern Angular Material UI** – responsive and clean interface.
- **Supabase Database** – scalable and secure backend for users and course data.
- **Session Management** – persistent login using Supabase tokens.
- **Scalable Project Structure** – built for future AI-based adaptive learning.

---

## 📹 Demo Video
(Coming soon – insert your video link here)

---

## 🛠 Tech Stack
- **Frontend**: Angular 20+, Angular Signals, Angular Material, RxJS
- **Code Editor**: ngx-monaco-editor (VS Code-like editor)
- **Video Player**: YouTube iframe integration
- **Backend**: Supabase (Auth + Database)
- **Build Tool**: Vite (default with Angular 20+)

---

## 📂 Folder Structure
src/
├── app/
│ ├── auth/
│ │ ├── login/ # Login page
│ │ └── signup/ # Signup page
│ ├── layout/
│ │ └── home/ # Dashboard page with video + code editor
│ ├── services/
│ │ └── supabase-client.service.ts
│ └── app.component.ts # App root component
├── assets/
├── environments/



---

## 📥 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/codevia.git
cd codevia
```
### 2. Install the Dependencies
```
npm install
```
### 3. Run the application
```
ng serve -o
```

Contributing
Pull requests are welcome. For significant changes, open an issue first to discuss what you would like to change.
## License
MIT

