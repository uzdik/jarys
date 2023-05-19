window.addEventListener('DOMContentLoaded', () => {
  const userInput = document.getElementById('user-input');
  const startButton = document.getElementById('start-button');
  const challengeText = document.getElementById('challenge-text');
  const classicButton = document.getElementById('classic-button');
  const pythonButton = document.getElementById('python-button');
  const terminalButton = document.getElementById('terminal-button');
  const statistics = document.getElementById('statistics');

  let challengeOptions = [];
   // HERE SELECTION: as default text, but user may change to code.txt
   fetch('/static/text.txt') 
  // fetch('/static/code.txt')
    .then(response => response.text())
    .then(data => {
      challengeOptions = data.split('\n').filter(line => line.trim() !== '');
      challengeText.textContent = getRandomChallenge();
    })
    .catch(error => {
      console.error('Error fetching challenge options:', error);
    });

  let codingStyle = false;
  let terminalStyle = false;
  let currentIndex = 0;
  let correctCount = 0;
  let incorrectCount = 0;
  let startTime = 0;
  let endTime = 0;

  classicButton.addEventListener('click', () => {
    codingStyle = false;
    terminalStyle = false;
    challengeText.classList.remove('python-code', 'terminal-window');
    challengeText.textContent = getRandomChallenge();
    currentIndex = 0;
    updateCursor();
  });

  pythonButton.addEventListener('click', () => {
    codingStyle = true;
    terminalStyle = false;
    challengeText.classList.remove('terminal-window');
    challengeText.classList.add('python-code');
    challengeText.textContent = getRandomChallenge(true);
    currentIndex = 0;
    updateCursor();
  });

  terminalButton.addEventListener('click', () => {
    codingStyle = false;
    terminalStyle = true;
    challengeText.classList.remove('python-code');
    challengeText.classList.add('terminal-window');
    challengeText.textContent = getRandomChallenge();
    currentIndex = 0;
    updateCursor();
  });

  startButton.addEventListener('click', () => {
    userInput.disabled = false;
    userInput.focus();
    startButton.disabled = true;
    userInput.value = '';
    currentIndex = 0;
    correctCount = 0;
    incorrectCount = 0;
    startTime = Date.now();
    updateCursor();
  });

  userInput.addEventListener('input', () => {
    const inputText = userInput.value.trim();
    const challengeTextContent = challengeText.textContent.trim();

    if (inputText === challengeTextContent.slice(0, inputText.length)) {
      userInput.classList.remove('incorrect');
      currentIndex = inputText.length;
      correctCount = inputText.length;
      incorrectCount = challengeTextContent.length - correctCount;
    } else {
      userInput.classList.add('incorrect');
      incorrectCount = inputText.length;
      correctCount = challengeTextContent.length - incorrectCount;
    }

    if (inputText === challengeTextContent) {
      userInput.disabled = true;
      startButton.disabled = false;
      userInput.value = '';
      endTime = Date.now();
      const totalTime = (endTime - startTime) / 1000; // in seconds
      const averageSpeed = Math.round((correctCount / totalTime) * 60); // in characters per minute
      statistics.innerHTML = `Correct: ${correctCount} | Incorrect: ${incorrectCount} | Average Speed: ${averageSpeed} CPM`;
      currentIndex = 0;
    }

    updateCursor();
  });

  function updateCursor() {
    const challengeTextContent = challengeText.textContent.trim();
    const highlightedText = challengeTextContent.slice(0, currentIndex);
    const remainingText = challengeTextContent.slice(currentIndex);
    challengeText.innerHTML = `<span class="highlight">${highlightedText}</span>${remainingText}`;
  }

  function getRandomChallenge(pythonFormat = false) {
    const randomIndex = Math.floor(Math.random() * challengeOptions.length);
    let randomChallenge = challengeOptions[randomIndex];
    if (pythonFormat) {
      randomChallenge = randomChallenge.replace(/,/g, ';\n');
    }
    return randomChallenge;
  }
});