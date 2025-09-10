# OmHome

OmHome is a web application built with React and Vite. The original project design can be viewed on [Figma](https://www.figma.com/design/BpcRY7EjyRhdn1VhqGi8UP/OmHome).

## Project Overview

This repository contains the source code for the OmHome website. It is implemented using modern frontend tools and libraries such as React, Vite, and Radix UI components.

## Environment Setup

1. **Install Node.js** (version 20 or later) and npm.
2. **Clone the repository**.
3. **Install dependencies**:
   ```bash
   npm install
   ```

## Development

Start a local development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173/`.

## Build & Deployment

Generate a production build:

```bash
npm run build
```

The compiled output is placed in the `dist/` directory.

### GitHub Pages

To publish to GitHub Pages:

1. Run `npm run build`.
2. Push the contents of the `dist/` directory to a `gh-pages` branch or configure Pages to serve from the `dist` folder.
3. If the repository is hosted at `https://github.com/USERNAME/OmHome`, the site will be available at `https://USERNAME.github.io/OmHome/`.

## Contributing

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/my-feature`.
3. Make your changes and ensure they build successfully.
4. Commit with a clear message and push your branch.
5. Open a pull request for review.

