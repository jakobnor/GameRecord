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
function handleDeleteGame(event) {
    const title = event.target.dataset.title;
    
    const gameIndex = games.findIndex(g => g.title === title);
    if (gameIndex !== -1) {
        
        games.splice(gameIndex, 1);
        
        localStorage.removeItem('game_' + title);
        
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

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.dataset.title = game.title;
      deleteButton.addEventListener('click', handleDeleteGame);

      gameDiv.appendChild(titleElem);
      gameDiv.appendChild(detailsElem);
      gameDiv.appendChild(ratingInput);
      gameDiv.appendChild(updateButton);
      gameDiv.appendChild(deleteButton);
      
      gameList.appendChild(gameDiv);
    });
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

  document.addEventListener('DOMContentLoaded', () => {
  renderGames();

  document.getElementById('addGameForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const title = document.getElementById('title').value.trim();
    const designer = document.getElementById('designer').value.trim();
    const artist = document.getElementById('artist').value.trim();
    const publisher = document.getElementById('publisher').value.trim();
    const year = parseInt(document.getElementById('year').value, 10);
    const players = document.getElementById('players').value.trim();
    const time = document.getElementById('time').value.trim();
    const difficulty = document.getElementById('difficulty').value.trim();
    const url = document.getElementById('url').value.trim();
    const playCount = parseInt(document.getElementById('playCount').value, 10);
    const personalRating = parseInt(document.getElementById('personalRating').value, 10);

    if (!title || !designer || isNaN(year)) {
      alert('Title, Designer, and Year are required.');
      return;
    }

    const newGame = new Game(
      title, designer, artist, publisher, year,
      players, time, difficulty, url,
      playCount, personalRating
    );

    saveGame(newGame);
    games.push(newGame);
    renderGames();
    event.target.reset();
  });
});

document.getElementById('sortButton').addEventListener('click', function() { 
    const criteria = document.getElementById('sortCriteria').value;
    games.sort((a, b) => {
        
        if (criteria === 'personalRating' || criteria === 'playCount' || criteria === 'year') {
            return a[criteria] - b[criteria];
        }
    
        return a[criteria].toString().localeCompare(b[criteria].toString());
    });
    renderGames();
});