const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 25;

const MODE_ATTACK = "ATTACK";
const MODE_STRONG_ATTACK = "STRONG_ATTACK";
const LOG_EVENT_PLAYER_ATTACK = "PLAYER_ATTACK";
const LOG_EVENT_MONSTER_ATTACK = "MONSTER_ATTACK";
const LOG_EVENT_PLAYER_STRONG_ATTACK = "PLAYER_STRONG_ATTACK";
const LOG_EVENT_PLAYER_HEAL = "PLAYER_HEAL";
const LOG_EVENT_GAME_OVER = "GAME_OVER";

let battleLog = [];

const enteredValue = prompt("Maximum life for you and monster", "100");
let chosenMaxLife = parseInt(enteredValue);
if (isNaN(chosenMaxLife) || chosenMaxLife <= 0 || chosenMaxLife >= 0) {
  chosenMaxLife = 100;
}

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

adjustHealthBars(chosenMaxLife);

function writeToLog(event, value, monsterHealth, playerHealth) {
  let logEntry = {
    event: event,
    value: value,
    finalMonsterHealth: monsterHealth,
    finalPlayerHealth: playerHealth,
  };

switch(event) {
  case LOG_EVENT_PLAYER_ATTACK:
    logEntry.target = "MONSTER";
    break;
  case LOG_EVENT_PLAYER_STRONG_ATTACK:
    logEntry = {
      event: event,
      value: value,
      target: "MONSTER",
      finalMonsterHealth: monsterHealth,
      finalPlayerHealth: playerHealth,
    };
    break;
  case LOG_EVENT_MONSTER_ATTACK:
    logEntry = {
      event: event,
      value: value,
      target: "PLAYER",
      finalMonsterHealth: monsterHealth,
      finalPlayerHealth: playerHealth,
    };
    break;
  case LOG_EVENT_PLAYER_HEAL:
    logEntry = {
      event: event,
      value: value,
      target: "PLAYER",
      finalMonsterHealth: monsterHealth,
      finalPlayerHealth: playerHealth,
    };
    break;
  case LOG_EVENT_GAME_OVER:
    logEntry = {
      event: event,
      value: value,
      finalMonsterHealth: monsterHealth,
      finalPlayerHealth: playerHealth,
    };
    break;
    default:
      logEntry = {};
}


  // if (event === LOG_EVENT_PLAYER_ATTACK) {
  //   logEntry.target = "MONSTER";
  // } else if (event === LOG_EVENT_PLAYER_STRONG_ATTACK) {
  //   logEntry = {
  //     event: event,
  //     value: value,
  //     target: "MONSTER",
  //     finalMonsterHealth: monsterHealth,
  //     finalPlayerHealth: playerHealth,
  //   };
  // } else if (event === LOG_EVENT_MONSTER_ATTACK) {
  //   logEntry = {
  //     event: event,
  //     value: value,
  //     target: "PLAYER",
  //     finalMonsterHealth: monsterHealth,
  //     finalPlayerHealth: playerHealth,
  //   };
  // } else if (event === LOG_EVENT_PLAYER_HEAL) {
  //   logEntry = {
  //     event: event,
  //     value: value,
  //     target: "PLAYER",
  //     finalMonsterHealth: monsterHealth,
  //     finalPlayerHealth: playerHealth,
  //   };
  // } else if (event === LOG_EVENT_GAME_OVER) {
  //   logEntry = {
  //     event: event,
  //     value: value,
  //     finalMonsterHealth: monsterHealth,
  //     finalPlayerHealth: playerHealth,
  //   };
  // }
  battleLog.push(logEntry);
}

function reset() {
  currentMonsterHealth = chosenMaxLife;
  currentPlayerHealth = chosenMaxLife;
  resetGame(chosenMaxLife);
}

function endRound() {
  const initialPlayerHealth = currentPlayerHealth;
  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  currentPlayerHealth -= playerDamage;
  writeToLog(
    LOG_EVENT_MONSTER_ATTACK,
    playerDamage,
    currentMonsterHealth,
    currentPlayerHealth
  );

  //check for bonus life then remove the life
  if (currentPlayerHealth <= 0 && hasBonusLife) {
    hasBonusLife = false;
    removeBonusLife();
    // reset health to 100
    currentPlayerHealth = initialPlayerHealth;
    setPlayerHealth(initialPlayerHealth);
    alert("Bonus life activated!");
  }

  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    alert("You won!");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "Player Won",
      currentMonsterHealth,
      currentPlayerHealth
    );
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    alert("You lost!");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "Monster Won",
      currentMonsterHealth,
      currentPlayerHealth
    );
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
    alert("DRAW");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "DRAW",
      currentMonsterHealth,
      currentPlayerHealth
    );
  }
}

function attackMonster(mode) {
  // const maximumDamage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
  // const logEvent = mode === MODE_ATTACK ? LOG_EVENT_PLAYER_ATTACK : LOG_EVENT_PLAYER_STRONG_ATTACK;
  let maximumDamage;
  let logEvent;
  if (mode === MODE_ATTACK) {
    maximumDamage = ATTACK_VALUE;
    logEvent = LOG_EVENT_PLAYER_ATTACK;
  } else if (mode === MODE_STRONG_ATTACK) {
    maximumDamage = STRONG_ATTACK_VALUE;
    logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
  }

  const damage = dealMonsterDamage(maximumDamage);
  currentMonsterHealth -= damage;
  writeToLog(logEvent, damage, currentMonsterHealth, currentPlayerHealth);

  endRound();
}

function healPlayerHandler() {
  let healValue;
  if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
    alert("You cannot heal more than max initial health");
  } else {
    healValue = HEAL_VALUE;
  }
  increasePlayerHealth(HEAL_VALUE);
  currentPlayerHealth += HEAL_VALUE;
  writeToLog(
    LOG_EVENT_PLAYER_HEAL,
    healValue,
    currentMonsterHealth,
    currentPlayerHealth
  );
  endRound();
}

function attackHandler() {
  attackMonster(MODE_ATTACK);
}

function strongAttackHandler() {
  attackMonster(MODE_STRONG_ATTACK);
}

function printLogHandler() {
  console.log(battleLog);
}

attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healPlayerHandler);
logBtn.addEventListener("click", printLogHandler);
