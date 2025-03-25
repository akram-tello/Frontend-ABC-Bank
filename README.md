# Bank ABC Frontend

This is the frontend application for Bank ABC's banking system, built with React, TypeScript, and Vite.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── ui/           # Reusable UI components
│   │   └── ...          # Feature-specific components
│   ├── lib/             # Utility functions and shared code
│   ├── services/        # API service functions
│   └── App.tsx          # Main application component
├── public/              # Static assets
└── dist/               # Build output
```

## Getting Started

1. Clone the repository:
   ```sh
   git clone <repository_url>
   cd <project_name>/frontend
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Create a `.env` file in the root directory with:
   ```
   VITE_API_URL=http://localhost:3000
   ```

4. Start the development server:
   ```sh
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Shadcn UI Components
- ESLint

## Development Guidelines

- Use TypeScript for all new components and functions
- Follow the established project structure
- Use the provided UI components from the `components/ui` directory
- Implement proper error handling and loading states
- Write clean, maintainable code following the project's coding standards

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

