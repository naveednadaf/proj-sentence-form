let sentences = [];
let currentSentence = null;
let shuffledWords = [];
let placedWords = [];
let score = 0;
let streak = 0;

const englishSentenceEl = document.getElementById('englishSentence');
const wordBankEl = document.getElementById('wordBank');
const answerSlotsEl = document.getElementById('answerSlots');
const checkBtn = document.getElementById('checkBtn');
const nextBtn = document.getElementById('nextBtn');
const feedbackEl = document.getElementById('feedback');
const scoreEl = document.getElementById('score');
const streakEl = document.getElementById('streak');
const fileSelectEl = document.getElementById('fileSelect');
const fileUploadEl = document.getElementById('fileUpload');

let currentFile = 'sentences.md';
let uploadedSentences = null;

async function loadSentences() {
  try {
    if (uploadedSentences) {
      sentences = uploadedSentences;
      loadSentence();
      return;
    }

    const response = await fetch(currentFile);
    const text = await response.text();
    sentences = parseSentences(text);
    loadSentence();
  } catch (error) {
    console.error('Error loading sentences:', error);
    englishSentenceEl.textContent = 'Error loading ' + currentFile;
  }
}

async function loadAvailableFiles() {
  try {
    const response = await fetch('file-list.json');
    const files = await response.json();

    fileSelectEl.innerHTML = '';
    files.forEach(file => {
      const option = document.createElement('option');
      option.value = file.file;
      option.textContent = file.name;
      fileSelectEl.appendChild(option);
    });

    currentFile = files[0]?.file || 'sentences.md';
    loadSentences();
  } catch (error) {
    console.error('Error loading file list:', error);
    const option = document.createElement('option');
    option.value = 'sentences.md';
    option.textContent = 'Sentences';
    fileSelectEl.appendChild(option);
    currentFile = 'sentences.md';
    loadSentences();
  }
}

function parseSentences(markdown) {
  const result = [];
  const lines = markdown.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('---')) {
      const parts = trimmed.split('|');
      if (parts.length === 2) {
        const english = parts[0].trim();
        const chineseStr = parts[1].trim();
        const chinese = chineseStr.split('').filter(c => c.trim());
        result.push({ english, chinese });
      }
    }
  }

  return result;
}

function shuffle(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function loadSentence() {
  currentSentence = sentences[Math.floor(Math.random() * sentences.length)];
  shuffledWords = shuffle(currentSentence.chinese);
  placedWords = [];
  
  englishSentenceEl.textContent = currentSentence.english;
  
  renderWordBank();
  renderAnswerSlots();
  
  checkBtn.disabled = false;
  feedbackEl.className = 'feedback';
  feedbackEl.textContent = '';
  nextBtn.classList.add('hidden');
}

function renderWordBank() {
  wordBankEl.innerHTML = '';
  shuffledWords.forEach((word, index) => {
    if (word !== null) {
      const chip = createWordChip(word, index, 'bank');
      wordBankEl.appendChild(chip);
    }
  });
}

function renderAnswerSlots() {
  answerSlotsEl.innerHTML = '';
  placedWords.forEach((word, index) => {
    const chip = createWordChip(word, index, 'answer');
    answerSlotsEl.appendChild(chip);
  });
}

function createWordChip(word, index, location) {
  const chip = document.createElement('div');
  chip.className = 'word-chip';
  if (location === 'answer') {
    chip.classList.add('placed');
  }
  chip.textContent = word;
  chip.addEventListener('click', () => handleWordClick(index, location));
  return chip;
}

function handleWordClick(index, location) {
  if (feedbackEl.classList.contains('correct') || feedbackEl.classList.contains('incorrect')) {
    return;
  }
  
  if (location === 'bank') {
    const word = shuffledWords[index];
    shuffledWords[index] = null;
    placedWords.push(word);
  } else {
    const word = placedWords[index];
    placedWords.splice(index, 1);
    const nullIndex = shuffledWords.findIndex(w => w === null);
    shuffledWords[nullIndex] = word;
  }
  
  renderWordBank();
  renderAnswerSlots();
}

function checkAnswer() {
  if (placedWords.length === 0) {
    return;
  }
  
  const isCorrect = placedWords.join('') === currentSentence.chinese.join('');
  
  checkBtn.disabled = true;
  
  if (isCorrect) {
    score += 10;
    streak++;
    feedbackEl.textContent = '✓ Correct! 太棒了！';
    feedbackEl.className = 'feedback correct';
  } else {
    streak = 0;
    feedbackEl.textContent = `✗ Incorrect. Answer: ${currentSentence.chinese.join(' ')}`;
    feedbackEl.className = 'feedback incorrect';
  }
  
  scoreEl.textContent = `Score: ${score}`;
  streakEl.textContent = `🔥 Streak: ${streak}`;
  nextBtn.classList.remove('hidden');
}

checkBtn.addEventListener('click', checkAnswer);
nextBtn.addEventListener('click', loadSentence);

fileSelectEl.addEventListener('change', (e) => {
  if (e.target.value === 'uploaded') {
    // Use uploaded sentences
    sentences = uploadedSentences;
  } else {
    currentFile = e.target.value;
    uploadedSentences = null;
  }
  score = 0;
  streak = 0;
  scoreEl.textContent = 'Score: 0';
  streakEl.textContent = '🔥 Streak: 0';
  loadSentences();
});

fileUploadEl.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      uploadedSentences = parseSentences(event.target.result);

      // Add to dropdown
      const option = document.createElement('option');
      option.value = 'uploaded';
      option.textContent = '📄 ' + file.name;
      fileSelectEl.appendChild(option);
      fileSelectEl.value = 'uploaded';

      score = 0;
      streak = 0;
      scoreEl.textContent = 'Score: 0';
      streakEl.textContent = '🔥 Streak: 0';
      loadSentence();
    };
    reader.readAsText(file);
  }
});

loadAvailableFiles();
