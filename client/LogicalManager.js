/*
 * Logical manager
 * manage all players
 *
 * @reqiure manager.js util.js
 */
var ClubDeuce = 39;
var cpuIndex = 0;
function LogicalManager() {
  //constructor
  var players = new Array();
  var allCards = shuffle(range(52));
  var that = this;
  var currentPlayer = null;

  var playerQueue;
  var interactive = false; // communicate with manager.js

  var _count = 4;

  // public property
  this.player;
  

  // private mathods
  function determinFirstPlayer() {
    var first = 3 - Math.floor(allCards.indexOf(ClubDeuce) / 13);
    var firstPlayer = players[first];
    if (first > 3 || first < 0)
      console.debug(allCards);
    playerQueue.setFirst(players[first]);
    isPlayerToDiscard();
  }

  function isPlayerToDiscard() {
    currentPlayer = playerQueue.next();
    if (currentPlayer == that.player) {
      interactive = true;
      console.info("You have control");
    } else { //cpu 出牌
      discard(1);//FIXME cpu 出牌
    }
  }

  // public methods
  this.init = function() {
    players.push(new CPU(this.getCards()));
    players.push(new CPU(this.getCards()));
    players.push(new CPU(this.getCards()));
    this.player = new Player("Player", this.getCards());
    players.push(this.player);
    //console.log("print player in init", this.player);
    playerQueue = new PlayerQueue(players);
    determinFirstPlayer();
  };

  this.getCards = function () {
    if (_count-- > 0){
      return allCards.slice(_count * 13, (_count+1)*13);
    }
  };
  
  /*
   * 出牌
   * 该CPU出就出, 该玩家出转移控制权
   */
  //this.discard = function () {
  function discard() {
    var whichCard = arguments[0];
    if (!interactive) {
      if (currentPlayer == this.player) {
        console.error("Auto discard!!");
        //TODO 出牌

        console.debug("Player discard", whichCard);
        console.info("You have not control");
      } else {
        console.info("CPU discard", whichCard);
      }
    } else console.log("manager.js have this control");
  };

  /*
   * 通过manager与之交互, player出牌
   */
  this.playerDiscard = function (card) {
    interactive = false;
    discard(card);
  };
}

function Player(name, cards) {
  this.name = name;
  this.cards = cards;
}

function CPU(cards) {
  var cardsCount = cards.length;

  this.name = "CPU" + cpuIndex++;
  this.cards = cards;

  this.discard = function () {
    var suit = arguments[0];
    return cards[0];
  };
}

function PlayerQueue(ps) {
  var queue = ps;
  var index = 4;

  // public methods
  this.next = function() {
    var current = index % 4;
    index ++;
    return queue[current];
  };

  this.setFirst = function(firstPlayer) {
    //console.log("setFirst:", firstPlayer);
    var playerName = firstPlayer.name;
    for (var i = 0; i < 4; i++)
      if (this.next().name == playerName)
        index--;
  };
}

