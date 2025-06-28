const readline = require("readline-sync");
/*
Adventure Game
This game will be a text-based adventure game where the player will be able to make choices that affect the outcome of the game.
The player will be able to choose their own path and the story will change based on their decisions.
*/

let playerName = "";
let playerHealth = 100;
let playerGold = 20;
let currentLocation = "village";
let gameRunning = true;
let inventory = [];
// Display the game title
console.log("Welcome to the Adventure Game!");

// Add a welcome message
console.log("Prepare yourself for an epic journey!");


playerName = readline.question(`Enter your name,brave adventurer:`)
        console.log(`Welcome, ${playerName}! Your Journey begins in the ${currentLocation}.`);
        console.log(`Your have ${playerGold} gold coins to start you adventure.`);

