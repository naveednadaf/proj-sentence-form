# Chinese Translation Game

A Duolingo-style game for practicing Chinese translation by rearranging words.

## Features
- 🀄 Translate English sentences to Chinese
- 🔥 Score and streak tracking
- 📁 Multiple question banks
- ⬆️ Upload your own `.md` files

## Setup

### Add New Question Banks

1. **Add `.md` file** to the `question-banks/` folder:
   ```
   question-banks/
   ├── sentences.md
   ├── questions.md
   ├── advanced.md
   └── your-file.md  ← Add your file here
   ```

2. **Format** your `.md` file:
   ```markdown
   English sentence | 中文句子
   Another sentence | 另一个句子
   ```

3. **Update the file list** - Run:
   ```bash
   node generate-file-list.js
   ```

4. **Deploy** to GitHub Pages

## Hosting on GitHub Pages

1. Initialize git:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. Push to GitHub:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git branch -M main
   git push -u origin main
   ```

3. Enable GitHub Pages:
   - Go to your repo → Settings → Pages
   - Source: Deploy from branch → `main` → Save

4. Your game will be live at: `https://YOUR_USERNAME.github.io/YOUR_REPO/`

## Usage

- Click Chinese word chips to arrange your answer
- Click "Check Answer" to verify
- Use dropdown to switch question banks
- Upload custom `.md` files for temporary use
