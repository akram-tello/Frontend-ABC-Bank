# frontend/
# Project Structure

This is the directory structure for the React application:

```
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── Login.js
│   │   │   └── Register.js
│   │   ├── Dashboard/
│   │   │   ├── Balance.js
│   │   │   ├── TransactionForm.js
│   │   │   └── TransactionHistory.js
│   │   └── Layout/
│   │       ├── Navbar.js
│   │       └── PrivateRoute.js
│   ├── services/
│   │   ├── api.js
│   │   ├── auth.js
│   │   └── transaction.js
│   ├── utils/
│   │   └── auth.js
│   └── App.js
```

## Getting Started
1. Clone the repository:
   ```sh
   git clone <repository_url>
   cd <project_name>
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm start
   ```

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

