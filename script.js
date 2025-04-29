const gameBoard = document.getElementById('gameBoard');
const moveDisplay = document.getElementById('moveDisplay');
const timeDisplay = document.getElementById('timeDisplay');
const resetButton = document.getElementById('resetButton');
const rulesButton = document.getElementById('rulesButton');
const modal = document.getElementById('rulesModal');
const closeModal = document.getElementById('closeModal');
const matchSound = document.getElementById('matchSound');
const unmatchSound = document.getElementById('unmatchSound');
const statsScreen = document.getElementById('statsScreen');
const finalMoves = document.getElementById('finalMoves');
const finalTime = document.getElementById('finalTime');
const downloadStats = document.getElementById('downloadStats');

let moves = 0;
let timer;
let seconds = 0;
let firstCard, secondCard;
let lockBoard = false;
let matchedPairs = 0;
let timerStarted = false;

const images = [];
const backImages = [];

for (let i = 1; i <= 12; i++) {
  images.push(`spot${i}.jpg`);
  backImages.push(`back${i}.jpg`);
}

function startTimer() {
  timer = setInterval(() => {
    seconds++;
    timeDisplay.textContent = `time: ${seconds} sec`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createBoard() {
  matchedPairs = 0;
  moves = 0;
  seconds = 0;
  timerStarted = false;
  moveDisplay.textContent = `0 moves`;
  timeDisplay.textContent = `time: 0 sec`;
  gameBoard.innerHTML = '';
  stopTimer();

  let cardData = [];
  
  // First, shuffle images and pick 8 random ones
  let selectedImages = shuffle([...images]).slice(0, 8);
  let selectedBacks = shuffle([...backImages]).slice(0, 8);

  for (let i = 0; i < selectedImages.length; i++) {
    cardData.push({ front: selectedImages[i], back: selectedBacks[i] });
    cardData.push({ front: selectedImages[i], back: selectedBacks[i] }); // duplicate
  }
  
  shuffle(cardData);

  cardData.forEach(data => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">
          <img src="${data.front}" alt="" style="visibility: hidden;">
        </div>
        <div class="card-back">
          <img src="${data.back}" alt="">
        </div>
      </div>
    `;
    card.addEventListener('click', flipCard);
    gameBoard.appendChild(card);
  });
}

function flipCard() {
  if (lockBoard) return;
  if (this.classList.contains('matched')) return; // prevent flipping already matched cards again

  if (!timerStarted) {
    startTimer();
    timerStarted = true;
  }

  this.classList.add('flip');
  this.querySelector('.card-front img').style.visibility = 'visible';

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  lockBoard = true;

  moves++;
  moveDisplay.textContent = `${moves} moves`;

  checkForMatch();
}

function checkForMatch() {
  const firstImage = firstCard.querySelector('.card-front img').src;
  const secondImage = secondCard.querySelector('.card-front img').src;

  if (firstImage === secondImage) {
    matchSound.play();
    markAsMatched();
  } else {
    unmatchSound.play();
    unflipCards();
  }
}

function markAsMatched() {
  firstCard.classList.add('matched');
  secondCard.classList.add('matched');

  resetBoard();

  matchedPairs++;
  if (matchedPairs === 8) {
    setTimeout(victory, 800);
  }
}

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');

    firstCard.querySelector('.card-front img').style.visibility = 'hidden';
    secondCard.querySelector('.card-front img').style.visibility = 'hidden';

    resetBoard();
  }, 1000);
}

function resetBoard() {
  [firstCard, secondCard, lockBoard] = [null, null, false];
}

function victory() {
  stopTimer();
  document.querySelectorAll('.card').forEach(card => {
    card.style.opacity = 0;
  });
  setTimeout(() => {
    statsScreen.style.display = 'flex';
    finalMoves.textContent = `Moves: ${moves}`;
    finalTime.textContent = `Time: ${seconds} seconds`;
  }, 1000);
}



resetButton.addEventListener('click', createBoard);
rulesButton.addEventListener('click', () => modal.style.display = 'flex');
closeModal.addEventListener('click', () => modal.style.display = 'none');

const replayButton = document.getElementById('replayButton');


replayButton.addEventListener('click', () => {
  statsScreen.classList.add('fade-out');
  
  setTimeout(() => {
    statsScreen.style.display = 'none'; // Hide the stats screen
    statsScreen.classList.remove('fade-out'); // Reset the fade-out effect
    createBoard(); // Restart the game
  }, 200); // Match duration of the fade-out animation
});

const gotItButton = document.getElementById('gotItButton');

gotItButton.addEventListener('click', () => {
  modal.style.display = 'none';
});
shareTwitterButton.addEventListener('click', () => {
  const quoteText = `I completed the Brain Train Game in ${moves} moves and ${seconds} seconds! `;
  const quotedTweetUrl = 'https://twitter.com/YOUR_HANDLE/status/TWEET_ID'; // <-- replace with your real tweet URL
  const tweetIntentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(quoteText)}&url=${encodeURIComponent(quotedTweetUrl)}`;
  
  window.open(tweetIntentUrl, '_blank');
});

createBoard();