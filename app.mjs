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