# NodeJs-Blog

A simple Node.js blog project scaffold (starter).

## What this repo contains

- `app.js` — application entry (currently empty). The `package.json` scripts assume `app.js` is the start file.
- `package.json` — lists dependencies and npm scripts (`start`, `dev`).
- `.gitignore` — already configured to ignore `node_modules/` and `.env`.

## Prerequisites

- Node.js (>= 18 recommended)
- npm (bundled with Node.js)

## Install

From the project root:

```powershell
npm install
```

## Run

Start the app (as defined in `package.json`):

```powershell
npm run dev   # uses nodemon for development
npm start     # runs the production start script (runs app.js)
```

## Environment

Create a `.env` file in the project root for any configuration (MongoDB URI, JWT secret, session secret, etc.). This repo already has `.gitignore` entry for `.env`.

## Git setup (local -> remote)

Below are recommended steps to initialize a local git repo and push it to GitHub.

1) Initialize git locally and create an initial commit:

```powershell
cd C:\Users\Abdo\NodeJs-Blog
git init -b main
git add .
git commit -m "chore: initial commit"
```

2) Create a remote repository on GitHub:

- Option A (UI): Go to github.com, create a new repository, copy the remote URL.
- Option B (`gh` CLI):

```powershell
# (if you have GitHub CLI installed and are logged in)
gh repo create <your-username>/<repo-name> --public --source=. --remote=origin --push
```

3) If you created the remote manually (UI), add it and push:

```powershell
git remote add origin https://github.com/<your-username>/<repo-name>.git
git branch -M main
git push -u origin main
```


- Add a minimal `app.js` starter (Express server) so `npm start` runs out-of-the-box.
- Update `package.json` `main` to `app.js`.
- Create a GitHub repo for you (I can show the exact `gh` command to run locally).

Which of the above would you like me to do next?
