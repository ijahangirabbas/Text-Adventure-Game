// ===========================================
// The Dragon's Quest - Text Adventure Game
// A progression-based learning project
// ===========================================

// Include readline for player input
// (readline-sync removed for Coursera autograder compatibility)

// Game state variables
let gameRunning = true;
let playerName = "";
let playerHealth = 100;
let playerGold = 20; // Starting gold
let currentLocation = "village";
let hasPotion = false;
// Inventory and equipment system
let inventory = [];
let equippedWeapon = null;
let equippedArmor = null;
let monsterDefense = 5; // Monster's defense value
let healingPotionValue = 30; // How much health is restored

// Item templates
const itemTemplates = [
  {
    name: "Sword",
    type: "weapon",
    value: 10, // gold cost
    effect: 10, // damage
    description: "A basic sword. Increases your attack power.",
  },
  {
    name: "Steel Sword",
    type: "weapon",
    value: 25,
    effect: 20,
    description: "A sharp steel sword. Deals more damage than a basic sword.",
  },
  {
    name: "Wooden Shield",
    type: "armor",
    value: 8,
    effect: 5,
    description: "Reduces damage taken in combat.",
  },
  {
    name: "Iron Shield",
    type: "armor",
    value: 18,
    effect: 10,
    description: "A sturdy iron shield. Offers better protection.",
  },
  {
    name: "Health Potion",
    type: "potion",
    value: 5,
    effect: healingPotionValue,
    description: "Restores 30 health.",
  },
];

// Helper: Get all items of a given type
function getItemsByType(type) {
  return inventory.filter((item) => item.type === type);
}

// Helper: Get the best item of a type (highest effect)
function getBestItem(type) {
  const items = getItemsByType(type);
  if (items.length === 0) return null;
  return items.reduce(
    (best, item) => (item.effect > best.effect ? item : best),
    items[0]
  );
}

// Helper: Check if player has good enough equipment to face the dragon
function hasGoodEquipment() {
  // Needs steel sword and any armor
  const hasSteelSword = inventory.some((item) => item.name === "Steel Sword");
  const hasAnyArmor = inventory.some((item) => item.type === "armor");
  return hasSteelSword && hasAnyArmor;
}

// ===========================
// Display Functions
// Functions that show game information to the player
// ===========================

/**
 * Shows the player's current stats
 * Displays health, gold, and current location
 */
function showStatus() {
  console.log("\n=== " + playerName + "'s Status ===");
  console.log("❤️  Health: " + playerHealth);
  console.log("💰 Gold: " + playerGold);
  console.log("📍 Location: " + currentLocation);
}

/**
 * Shows the current location's description and available choices
 */
function showLocation() {
  console.log("\n=== " + currentLocation.toUpperCase() + " ===");
  if (currentLocation === "village") {
    console.log(
      "You're in a bustling village. The blacksmith, market, and a path to the mountains are nearby."
    );
    console.log("\nWhat would you like to do?");
    console.log("1: Go to blacksmith");
    console.log("2: Go to market");
    console.log("3: Enter forest");
    console.log("4: Climb the mountain");
    console.log("5: Check status");
    console.log("6: Use item");
    console.log("7: Help");
    console.log("8: Quit game");
  } else if (currentLocation === "blacksmith") {
    console.log(
      "The heat from the forge fills the air. Weapons and armor line the walls."
    );
    console.log("\nWhat would you like to do?");
    console.log("1: Shop for weapons/armor");
    console.log("2: Return to village");
    console.log("3: Check status");
    console.log("4: Use item");
    console.log("5: Help");
    console.log("6: Quit game");
  } else if (currentLocation === "market") {
    console.log(
      "Merchants sell their wares from colorful stalls. A potion seller catches your eye."
    );
    console.log("\nWhat would you like to do?");
    console.log("1: Shop for potions");
    console.log("2: Return to village");
    console.log("3: Check status");
    console.log("4: Use item");
    console.log("5: Help");
    console.log("6: Quit game");
  } else if (currentLocation === "forest") {
    console.log(
      "The forest is dark and foreboding. You hear strange noises all around you."
    );
    console.log("\nWhat would you like to do?");
    console.log("1: Return to village");
    console.log("2: Check status");
    console.log("3: Use item");
    console.log("4: Help");
    console.log("5: Quit game");
  } else if (currentLocation === "mountain") {
    console.log(
      "You stand at the foot of the mountain. The dragon's lair is near. The air is thick with danger."
    );
    console.log("\nWhat would you like to do?");
    console.log("1: Enter the dragon's lair");
    console.log("2: Return to village");
    console.log("3: Check status");
    console.log("4: Use item");
    console.log("5: Help");
    console.log("6: Quit game");
  }
}

// ===========================
// Movement Functions
// Functions that handle player movement
// ===========================

/**
 * Handles movement between locations
 * @param {number} choiceNum The chosen option number
 * @returns {boolean} True if movement was successful
 */
function move(choiceNum) {
  let validMove = false;
  if (currentLocation === "village") {
    if (choiceNum === 1) {
      currentLocation = "blacksmith";
      console.log("\nYou enter the blacksmith's shop.");
      validMove = true;
    } else if (choiceNum === 2) {
      currentLocation = "market";
      console.log("\nYou enter the market.");
      validMove = true;
    } else if (choiceNum === 3) {
      currentLocation = "forest";
      console.log("\nYou venture into the forest...");
      validMove = true;
      // Trigger combat when entering forest
      console.log("\nA monster appears!");
      if (!handleCombat()) {
        currentLocation = "village";
      }
    } else if (choiceNum === 4) {
      currentLocation = "mountain";
      console.log("\nYou approach the mountain path...");
      validMove = true;
    }
  } else if (currentLocation === "blacksmith") {
    if (choiceNum === 1) {
      buyFromBlacksmith();
      validMove = false; // Stay in blacksmith after shopping
    } else if (choiceNum === 2) {
      currentLocation = "village";
      console.log("\nYou return to the village center.");
      validMove = true;
    }
  } else if (currentLocation === "market") {
    if (choiceNum === 1) {
      buyFromMarket();
      validMove = false; // Stay in market after shopping
    } else if (choiceNum === 2) {
      currentLocation = "village";
      console.log("\nYou return to the village center.");
      validMove = true;
    }
  } else if (currentLocation === "forest") {
    if (choiceNum === 1) {
      currentLocation = "village";
      console.log("\nYou hurry back to the safety of the village.");
      validMove = true;
    }
  } else if (currentLocation === "mountain") {
    if (choiceNum === 1) {
      // Enter dragon's lair
      if (!hasGoodEquipment()) {
        console.log(
          "You feel unprepared. You need a steel sword and some armor to face the dragon!"
        );
        return false;
      }
      console.log("\nYou enter the dragon's lair...");
      if (handleCombat(true)) {
        // Victory handled in handleCombat
        return true;
      } else {
        // If player survives, return to village
        if (playerHealth > 0) {
          currentLocation = "village";
          console.log(
            "\nYou barely escape the dragon and flee to the village!"
          );
        }
        return false;
      }
    } else if (choiceNum === 2) {
      currentLocation = "village";
      console.log(
        "\nYou return to the village, the mountain looming behind you."
      );
      validMove = true;
    }
  }
  return validMove;
}

// ===========================
// Combat Functions
// Functions that handle battles and health
// ===========================

/**
 * Handles monster battles
 * Checks if player has weapon and manages combat results
 * @returns {boolean} true if player wins, false if they retreat
 */
function handleCombat(isDragon = false) {
  // Monster stats
  let monster = isDragon
    ? { name: "Dragon", health: 50, damage: 20 }
    : { name: "Monster", health: 20, damage: 10 };

  // Auto-select best equipment
  equippedWeapon = getBestItem("weapon");
  equippedArmor = getBestItem("armor");
  let weapon = equippedWeapon;
  let armor = equippedArmor;

  // Show equipment
  if (weapon) {
    console.log(`You wield your ${weapon.name} (damage: ${weapon.effect})!`);
  } else {
    console.log("You have no weapon!");
  }
  if (armor) {
    console.log(
      `You brace with your ${armor.name} (protection: ${armor.effect})!`
    );
  } else {
    console.log("You have no armor!");
  }

  // Dragon battle requires steel sword and any armor
  if (isDragon) {
    if (!weapon || weapon.name !== "Steel Sword" || !armor) {
      console.log(
        "The dragon shrugs off your feeble attack! You are not well-equipped!"
      );
      let protection = armor ? armor.effect : 0;
      let damageTaken = Math.max(1, monster.damage - protection);
      console.log(
        `The dragon deals ${monster.damage} damage. Your armor blocks ${protection}. You take ${damageTaken} damage!`
      );
      updateHealth(-damageTaken);
      return false;
    }
  }

  // Calculate player and monster health
  let playerAttack = weapon ? weapon.effect : 0;
  let monsterHealth = monster.health;
  let playerAlive = true;

  // Player attacks first
  if (playerAttack > 0) {
    console.log(`You attack the ${monster.name} for ${playerAttack} damage!`);
    monsterHealth -= playerAttack;
  } else {
    console.log(`You can't hurt the ${monster.name} without a weapon!`);
  }

  if (monsterHealth <= 0) {
    if (isDragon) {
      console.log("You have slain the DRAGON! You win the game!");
      playerGold += 100;
      gameRunning = false;
    } else {
      console.log("Victory! You found 10 gold!");
      playerGold += 10;
    }
    return true;
  }

  // Monster attacks back
  let protection = armor ? armor.effect : 0;
  let damageTaken = Math.max(1, monster.damage - protection);
  console.log(
    `${monster.name} attacks! It deals ${monster.damage} damage. Your armor blocks ${protection}. You take ${damageTaken} damage!`
  );
  updateHealth(-damageTaken);

  // If player survives, they retreat
  if (playerHealth > 0) {
    console.log("You barely escape with your life!");
    return false;
  } else {
    console.log("You have been defeated in battle!");
    return false;
  }
}

/**
 * Updates player health, keeping it between 0 and 100
 * @param {number} amount Amount to change health by (positive for healing, negative for damage)
 * @returns {number} The new health value
 */
function updateHealth(amount) {
  playerHealth += amount;

  if (playerHealth > 100) {
    playerHealth = 100;
    console.log("You're at full health!");
  }
  if (playerHealth < 0) {
    playerHealth = 0;
    console.log("You're gravely wounded!");
  }

  console.log("Health is now: " + playerHealth);
  return playerHealth;
}

// ===========================
// Item Functions
// Functions that handle item usage and inventory
// ===========================

/**
 * Handles using items like potions
 * @returns {boolean} true if item was used successfully, false if not
 */
function useItem() {
  if (hasPotion) {
    console.log("You drink the healing potion.");
    updateHealth(healingPotionValue);
    hasPotion = false;
    // Remove potion from inventory if present
    const idx = inventory.findIndex((i) => i.type === "potion");
    if (idx !== -1) inventory.splice(idx, 1);
    return true;
  }
  console.log("You don't have any usable items!");
  return false;
}

/**
 * Displays the player's inventory
 */
function checkInventory() {
  console.log("\n=== INVENTORY ===");
  if (inventory.length === 0 && !hasPotion) {
    console.log("Your inventory is empty!");
    return;
  }
  inventory.forEach((item) => {
    console.log(`- ${item.name} (${item.type}, effect: ${item.effect})`);
  });
  if (hasPotion) console.log("- Health Potion");
  if (equippedWeapon) console.log(`* Equipped Weapon: ${equippedWeapon.name}`);
  if (equippedArmor) console.log(`* Equipped Armor: ${equippedArmor.name}`);
}

// ===========================
// Shopping Functions
// Functions that handle buying items
// ===========================

/**
 * Handles purchasing items at the blacksmith
 */
function buyFromBlacksmith() {
  console.log("\nBlacksmith: 'Welcome! What would you like to buy?'");
  console.log("1: Sword (10 gold)");
  console.log("2: Steel Sword (25 gold)");
  console.log("3: Wooden Shield (8 gold)");
  console.log("4: Iron Shield (18 gold)");
  console.log("5: Cancel");
  let choice = readline.question("Choose item to buy (number): ");
  let item = null;
  if (choice === "1") item = itemTemplates.find((i) => i.name === "Sword");
  else if (choice === "2")
    item = itemTemplates.find((i) => i.name === "Steel Sword");
  else if (choice === "3")
    item = itemTemplates.find((i) => i.name === "Wooden Shield");
  else if (choice === "4")
    item = itemTemplates.find((i) => i.name === "Iron Shield");
  else if (choice === "5") return;
  else {
    console.log("Invalid choice.");
    return;
  }
  if (playerGold >= item.value) {
    playerGold -= item.value;
    inventory.push({ ...item });
    if (item.type === "weapon") equippedWeapon = item;
    if (item.type === "armor") equippedArmor = item;
    console.log(`You bought a ${item.name} for ${item.value} gold!`);
    console.log("Gold remaining: " + playerGold);
  } else {
    console.log("Not enough gold!");
  }
}

/**
 * Handles purchasing items at the market
 */
function buyFromMarket() {
  // Show all potions (and optionally other consumables)
  const potions = itemTemplates.filter((item) => item.type === "potion");
  if (potions.length === 0) {
    console.log("No potions available at the market.");
    return;
  }
  console.log("\nMerchant: 'Welcome! Here are my wares:'");
  potions.forEach((item, idx) => {
    console.log(
      `${idx + 1}: ${item.name} (${item.value} gold) - ${item.description}`
    );
  });
  console.log(`${potions.length + 1}: Cancel`);
  let choice = readline.question("Choose item to buy (number): ");
  let num = parseInt(choice);
  if (isNaN(num) || num < 1 || num > potions.length + 1) {
    console.log("Invalid choice.");
    return;
  }
  if (num === potions.length + 1) return;
  let item = potions[num - 1];
  if (playerGold >= item.value) {
    playerGold -= item.value;
    hasPotion = true;
    inventory.push({ ...item });
    console.log(`You bought a ${item.name} for ${item.value} gold!`);
    console.log("Gold remaining: " + playerGold);
  } else {
    console.log("Not enough gold!");
  }
}

// ===========================
// Help System
// Provides information about available commands
// ===========================

/**
 * Shows all available game commands and how to use them
 */
function showHelp() {
  console.log("\n=== AVAILABLE COMMANDS ===");

  console.log("\nMovement Commands:");
  console.log("- In the village, choose 1-3 to travel to different locations");
  console.log(
    "- In other locations, choose the return option to go back to the village"
  );

  console.log("\nBattle Information:");
  console.log("- You need a sword to win battles");
  console.log("- Monsters appear in the forest");
  console.log("- Without a weapon, you'll lose health when retreating");

  console.log("\nItem Usage:");
  console.log("- Health potions restore 30 health");
  console.log("- You can buy potions at the market for 5 gold");
  console.log("- You can buy a sword at the blacksmith for 10 gold");

  console.log("\nOther Commands:");
  console.log("- Choose the status option to see your health and gold");
  console.log("- Choose the help option to see this message again");
  console.log("- Choose the quit option to end the game");

  console.log("\nTips:");
  console.log("- Keep healing potions for dangerous areas");
  console.log("- Defeat monsters to earn gold");
  console.log("- Health can't go above 100");
}

// ===========================
// Input Validation
// Ensures player input is valid
// ===========================

/**
 * Validates if a choice number is within valid range
 * @param {string} input The user input to validate
 * @param {number} max The maximum valid choice number
 * @returns {boolean} True if choice is valid
 */
function isValidChoice(input, max) {
  if (input === "") return false;
  let num = parseInt(input);
  return num >= 1 && num <= max;
}

// ===========================
// Main Game Loop
// Controls the flow of the game
// ===========================

function startGame(name) {
  playerName = name || "Player";
  gameRunning = true;
  playerHealth = 100;
  playerGold = 20;
  currentLocation = "village";
  hasPotion = false;
  inventory.length = 0;
  equippedWeapon = null;
  equippedArmor = null;
  // Game intro
  console.log("=================================");
  console.log("       The Dragon's Quest        ");
  console.log("=================================");
  console.log("\nYour quest: Defeat the dragon in the mountains!");
  console.log("\nWelcome, " + playerName + "!");
  console.log("You start with " + playerGold + " gold.");
}

// (CLI game loop removed for Coursera autograder compatibility)

// Export all variables and functions for modularity
module.exports = {
  // Variables
  playerName,
  playerHealth,
  playerGold,
  inventory,
  currentLocation,
  gameRunning,
  hasPotion,
  equippedWeapon,
  equippedArmor,
  monsterDefense,
  healingPotionValue,
  itemTemplates,

  // Functions
  startGame,
  showStatus,
  showLocation,
  handleCombat,
  updateHealth,
  useItem,
  checkInventory,
  getItemsByType,
  getBestItem,
  hasGoodEquipment,
  buyFromBlacksmith,
  buyFromMarket,
  showHelp,
  move,
  isValidChoice,
};
