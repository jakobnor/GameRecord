import Game from "./models/Game.js";

export function saveGame(game) {
    const key = 'game_' + game.title;  
    localStorage.setItem(key, JSON.stringify(game));
  }
  
  export function getGames() {
    const games = [];
    for (let i = 0; i < localStorage.length; i++){
      const key = localStorage.key(i);
      if (key.startsWith('game_')) {
        const game = JSON.parse(localStorage.getItem(key));
        games.push(game);
      }
    }
    return games;
  }
  
  export function exportGames() {
    return JSON.stringify(getGames(), null, 2);
  }
  
  export function importGamesFromJSON(jsonStr) {
    try {
      const gameArray = JSON.parse(jsonStr);
      gameArray.forEach(game => {
        saveGame(game);
      });
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  }
  
console.log("App loaded and Game class imported");

let games = getGames();
console.log("Initial games loaded from localStorage:", games);


document.getElementById('importSource').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return; 

    const reader = new FileReader();

    
    reader.onload = function(e) {
        const jsonStr = e.target.result;
        try {
            
            const gameArray = JSON.parse(jsonStr);
            gameArray.forEach(game => {
                
                saveGame(game);
            });
            
            games = getGames();
            console.log("Games imported successfully:", games);

        } catch (error) {
            console.error("Error parsing JSON from file:", error);
        }
    };

    reader.readAsText(file);
});

function handleRatingChange(event) {
    const title = event.target.dataset.title;
    const newRating = parseInt(event.target.value, 10);

    const game = games.find(g => g.title === title);
    if (game) {
        game.personalRating = newRating;
        saveGame(game);
        renderGames();
    }
}

function handlePlayCountIncrement(event) {
    const title = event.target.dataset.title;

    const game = games.find(g => g.title === title);
    if (game) {
        game.playCount += 1;
        saveGame(game);
        renderGames();
    }
}

function renderGames() {
    const gameList = document.getElementById('gameList');
    gameList.innerHTML = ''; 
    
    games.forEach(game => {
      
      const gameDiv = document.createElement('div');
      gameDiv.className = 'game-entry';
      
      const titleElem = document.createElement('h3');
      titleElem.textContent = game.title;
      
      const detailsElem = document.createElement('p');
      detailsElem.textContent = `Designer: ${game.designer} | Year: ${game.year} | Play Count: ${game.playCount}`;
      
      const ratingInput = document.createElement('input');
      ratingInput.type = 'range';
      ratingInput.min = '0';
      ratingInput.max = '10';
      ratingInput.value = game.personalRating;
      ratingInput.dataset.title = game.title; 
      ratingInput.addEventListener('input', handleRatingChange);

      const updateButton = document.createElement('button');
      updateButton.textContent = 'Update Rating/Play Count';
      updateButton.dataset.title = game.title;
      updateButton.addEventListener('click', handlePlayCountIncrement);

      gameDiv.appendChild(titleElem);
      gameDiv.appendChild(detailsElem);
      gameDiv.appendChild(ratingInput);
      gameDiv.appendChild(updateButton);
      
      
      gameList.appendChild(gameDiv);
    });
  }
  
  document.addEventListener('DOMContentLoaded', () => {
  renderGames();
});