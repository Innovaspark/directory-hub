# ngXpress: Full-Stack Angular 20+ Starter Kit with Server-Side Rendering (SSR), Express 5, Prisma ORM, Tailwind CSS 4, and Better Auth Integration

[![ngXpress](https://img.shields.io/github/package-json/v/angularcafe/ngxpress?label=ngXpress)](./package.json)
[![Angular](https://img.shields.io/badge/Angular-20-red.svg)](https://angular.dev/)
[![Express.js](https://img.shields.io/badge/Express.js-5.1+-green.svg)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)


![GitHub stars](https://img.shields.io/github/stars/angularcafe/ngxpress)
![GitHub forks](https://img.shields.io/github/forks/angularcafe/ngxpress)
![GitHub issues](https://img.shields.io/github/issues/angularcafe/ngxpress)
![GitHub pull requests](https://img.shields.io/github/issues-pr/angularcafe/ngxpress)

Created and maintained by [@immohammadjaved](https://x.com/immohammadjaved)

Think of **ngXpress** as bringing the best of the Next.js experience to Angular—without the bloat or learning curve. ngXpress is a modern, full-stack Angular 20 + Express 5 starter kit featuring out-of-the-box server-side rendering (SSR), zoneless execution, Prisma ORM, secure authentication with better-auth, and Tailwind CSS for responsive UIs. Build scalable, production-ready web applications with zero boilerplate and a feature-first, modular backend structure—perfect for both prototypes and production apps.

## 🚀 Live Demo

Check out a live example of ngXpress in action:

[View Live Demo](http://demo.ngxpress.dev)

---

## ✨ Features & Tech Stack

- **Angular 20+**: Leverage the latest Angular with signals, standalone components, and new control flow for modern, reactive UIs
- **Server-Side Rendering (SSR)**: Out-of-the-box SSR for SEO, performance, and fast initial loads
- **Express 5 Backend**: Modular, feature-first REST API architecture for rapid backend development
- **Prisma ORM**: Type-safe database access (SQLite by default, easily switchable to PostgreSQL, MySQL, etc.)
- **Zoneless Execution**: No zone.js overhead—enjoy maximum speed and simplicity
- **Better Auth Integration**: Secure, production-ready authentication out of the box
- **Tailwind CSS 4**: Build beautiful, responsive UIs with utility-first CSS
- **TypeScript Everywhere**: Strict typing for both frontend and backend
- **NgOptimizedImage**: Performant image handling for Angular apps
- **Global Error Handling**: Robust error management for APIs and UI
- **Ready for Deployment**: Optimized for Vercel, Netlify, and traditional servers
- **Easy to Extend & Maintain**: Clean, scalable codebase and feature-first folder structure
- **Dev & Tooling**: Angular CLI, ESLint & Prettier, Vite (optional), VS Code recommended settings, Node.js 20+

---

## ⚡ Quick Start Guide

Get started with your own ngXpress project in minutes:

1. **Create Your Project from the Template**
   - Click the **“Use this template”** button on the [ngXpress GitHub repository](https://github.com/angularcafe/ngxpress) to generate a new repository under your GitHub account.

2. **Clone Your New Repository**
   ```bash
   git clone https://github.com/<your-username>/<your-repo-name>.git
   cd <your-repo-name>
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Set Up the Database (Prisma + SQLite by default)**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the Development Server (Angular + Express SSR)**
   ```bash
   npm run dev
   ```

6. **Open Your Browser**
   - Visit [http://localhost:4200](http://localhost:4200)

**Additional Tips:**
- To open Prisma Studio (DB GUI):  
  `npx prisma studio`
- To build for production:  
  `npm run build`
- To start the production server:  
  `npm run start`
- Configure environment variables in the `.env` file as needed.

---

## 📦 What’s Included

- **Beautiful SaaS Landing Page:** Modern, responsive, and ready to customize
- **Authentication Screens:** Sign In, Sign Up, Forgot/Reset Password (secure, production-ready)
- **Admin Dashboard:** Modular, extendable admin interface
- **Todos CRUD Example:** End-to-end CRUD with Angular, Express, and Prisma

---

## 📂 File Structure

A clear, modular structure for both frontend (Angular) and backend (Express):

```text
src/
├── app/
│   ├── components/      # Standalone, reusable UI components
│   ├── core/            # Core services, guards, and utilities
│   ├── layouts/         # Application layouts (admin, auth, main)
│   ├── models/          # TypeScript interfaces and models
│   ├── pages/           # Route-based pages (admin, home, auth, not-found)
│   ├── services/        # Feature and domain services
│   ├── app.component.ts
│   ├── app.routes.ts
│   └── ...
├── api/
│   ├── features/
│   │   └── todos/
│   │       ├── todos.controller.ts
│   │       └── todos.routes.ts
│   ├── lib/
│   │   ├── prisma.ts
│   │   └── auth.ts
│   ├── middlewares/     # Express middlewares
│   ├── utils/           # Utility functions
│   └── api.ts           # Main API router
├── generated/           # Prisma generated client
├── main.ts              # Angular entry point
├── main.server.ts       # Angular SSR entry point
├── server.ts            # Express server entry point
└── styles.css           # Global styles
```

- **Separation of concerns:** Frontend and backend code are clearly separated for maintainability.
- **Feature-first:** Both Angular and Express codebases are organized by feature for scalability.
- **Ready for extension:** Add new features by creating new folders in `src/app/pages` or `src/api/features`.

---

## 🔗 Import Aliases

ngXpress uses TypeScript path aliases for clean, maintainable imports throughout your Angular app. This eliminates long relative paths and makes refactoring easier.

### Why Use Import Aliases?
- **Readability:** Cleaner, more descriptive import statements
- **Maintainability:** Refactor and move files without breaking imports
- **Scalability:** Add new features and modules with less hassle

### Usage Example

```typescript
// ❌ Without aliases (hard to maintain)
import { TodoService } from '../../../services/todo.service';
import { AuthGuard } from '../../core/guards/auth.guard';

// ✅ With aliases (recommended)
import { TodoService } from '@services/todo.service';
import { AuthGuard } from '@core/guards/auth.guard';
```

### Available Aliases

| Alias              | Path                          | Description                        |
|--------------------|-------------------------------|------------------------------------|
| `@components/*`    | `src/app/components/*`        | Reusable UI components             |
| `@core/*`          | `src/app/core/*`              | Core services, guards, utilities   |
| `@layouts/*`       | `src/app/layouts/*`           | Application layouts                |
| `@models/*`        | `src/app/models/*`            | TypeScript interfaces and models   |
| `@pages/*`         | `src/app/pages/*`             | Route-based pages                  |
| `@services/*`      | `src/app/services/*`          | Feature/domain services            |

Aliases are configured in `tsconfig.json` and work seamlessly with Angular CLI and most editors (VS Code recommended).

### Adding New Aliases
1. Open `tsconfig.json` in the project root.
2. Add your new alias under the `compilerOptions.paths` section. For example:
   ```json
   "@utils/*": ["src/app/utils/*"]
   ```
3. Restart your IDE for the changes to take effect.

For more details, see the [TypeScript documentation on path mapping](https://www.typescriptlang.org/tsconfig#paths).

---

## 🚀 Deployment

ngXpress is designed to be deployment-ready out of the box and can be deployed to any server that supports Angular 20+ SSR applications. You can deploy this app like a regular Node.js application - no need to run frontend and backend separately as it's a single, unified application.

**Note:** Work is in progress to add support for Vercel, Netlify, and Docker deployment. For now, traditional server deployment is recommended.

### Traditional Server Deployment (Recommended)

For VPS, dedicated servers, or any Node.js hosting provider:

1. **Build the Application**
   ```bash
   npm run build
   ```

2. **Start Production Server**
   ```bash
   npm run start
   ```

3. **Environment Setup**
   - Ensure Node.js 20+ is installed on your server
   - Set production environment variables
   - Use a process manager like PM2 for production

### Environment Variables

Ensure these environment variables are set in production:

```bash
# Database
DATABASE_URL="your_database_connection_string"

# Authentication
BETTER_AUTH_SECRET="your_secret_key"
BETTER_AUTH_URL="https://yourdomain.com"

# Optional: Customize ports
PORT=4000
```

### Database Considerations

- **SQLite**: Good for development and small applications
- **PostgreSQL/MySQL**: Recommended for production applications
- **Database Migrations**: Run `npx prisma migrate deploy` in production
- **Connection Pooling**: Configure in your Prisma schema for production databases

### Supported Hosting Providers

ngXpress works with any server that supports Angular 20+ SSR applications:

- **VPS Providers**: DigitalOcean, Linode, Vultr, AWS EC2, Google Cloud Compute
- **Shared Hosting**: Any provider with Node.js 20+ and Angular SSR support
- **Traditional Hosting**: Any server with Node.js 20+ support
- **Cloud Platforms**: AWS, Google Cloud, Azure (with proper Node.js setup)

**Coming Soon:** Vercel, Netlify, and Docker deployment support

---

## 📚 Documentation & Resources

- **Angular Documentation**: [angular.dev](https://angular.dev)
- **Express.js Documentation**: [expressjs.com](https://expressjs.com/en/5x/api.html)
- **Prisma Documentation**: [prisma.io](https://www.prisma.io/docs/)
- **Tailwind CSS Documentation**: [tailwindcss.com](https://tailwindcss.com/docs)
- **Better Auth Documentation**: [better-auth.com](https://www.better-auth.com/docs/introduction)

---

## 🤝 Contributing

We welcome contributions to ngXpress! Please read our [Contributing Guide](CONTRIBUTING.md) for details on how to contribute.

---

## 📝 License

ngXpress is open-source software licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute it as per the license terms.

---

## 🏷️ Keywords

angular, angular-starter, angular-template, angular-fullstack, angular-universal, angular-ssr, angular-express, angular-prisma, angular-tailwind, angular-auth, fullstack, fullstack-starter, ssr, express, expressjs, prisma, tailwindcss, authentication, better-auth, typescript, nodejs, monorepo, modern-web, scalable, production-ready, nextjs-alternative, nextjs-for-angular, zoneless, angular-zoneless

---

## 👤 Creator

Made with ❤️ by [@immohammadjaved](https://x.com/immohammadjaved)

Follow for updates, tips, and more Angular/NodeJs content!