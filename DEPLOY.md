---
description: Deploy to GitHub Pages
---

# How to Deploy to GitHub Pages

Follow these steps to host your Reviewer App on GitHub Pages.

## 1. Initialize Git (if not already done)
If you haven't already, initialize a git repository in your project folder:
```bash
git init
git add .
git commit -m "Initial commit"
```

## 2. Create a GitHub Repository
1. Go to [GitHub.com](https://github.com/new) and create a new repository named `reviewer-app`.
2. Do **not** initialize with README, .gitignore, or License (keep it empty).

## 3. Connect to GitHub
Run the following commands in your terminal (replace `<USERNAME>` with your GitHub username):
```bash
git branch -M main
git remote add origin https://github.com/<USERNAME>/reviewer-app.git
git push -u origin main
```

## 4. Deploy
Run the deploy script we set up:
```bash
npm run deploy
```

## 5. Enable GitHub Pages
1. Go to your repository settings on GitHub.
2. Navigate to **Pages**.
3. Under **Source**, ensure it is set to `gh-pages` branch (this should happen automatically after step 4).
4. Your site will be live at `https://<USERNAME>.github.io/reviewer-app/`.

## Updating the App
Whenever you make changes:
1. Commit your changes:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push
   ```
2. Redeploy:
   ```bash
   npm run deploy
   ```
