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
  var currentPlayer = null;
  var recorder = null;

  var playerQueue;
  var interactive = false; // communicate with manager.js
  var uiManager = null;

  var _count = 4;
  var that = this;

  // public property
  this.player;
  

  // private mathods
  function determinFirstPlayer() {
    var first = 3 - Math.floor(allCards.indexOf(ClubDeuce) / 13);
    var firstPlayer = players[first];
    if (first > 3 || first < 0)
      console.debug(allCards);
    playerQueue.setFirst(players[first]);
    //isPlayerToDiscard();
    discardClubDeuce(ClubDeuce);
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

  function discardClubDeuce() {
    currentPlayer = playerQueue.next();
    console.debug("who discard:", currentPlayer.name);
    discard(ClubDeuce);
  }

  /*
   * 出牌
   * 该CPU出就出, 该玩家出转移控制权
   */
  function discard() {
    var whichCard = arguments[0];
    console.debug("[D] currentPlayer:", currentPlayer);
    if (currentPlayer == that.player) {
      if (whichCard != 39)
        console.error("Auto discard!!", whichCard);

      uiManager.playerDiscard(whichCard);
      console.debug("Player discard", whichCard);
      console.info("You have not control");
    } else {
    //  console.error("1");
    //  console.info("CPU discard", whichCard);
    //  FIXME 位置
      uiManager.cpuDiscard(new Card(whichCard, 85), players.indexOf(currentPlayer));
    }
    currentPlayer = playerQueue.next();

    // record
    recorder.record(currentPlayer, whichCard);

    console.debug("[D] currentPlayer:", currentPlayer);
  }

  // public methods
  this.init = function(uimgr) {
    players.push(new CPU(this.getCards()));
    players.push(new CPU(this.getCards()));
    players.push(new CPU(this.getCards()));
    this.player = new Player("Player", this.getCards());
    players.push(this.player);
    //console.log("print player in init", this.player);
    playerQueue = new PlayerQueue(players);

    //init recoder
    recorder = new Recoder(players);
    //console.debug("recorder init", recorder.itmes, players);
    uiManager = uimgr;
  };

  this.run = function () {
    determinFirstPlayer();
    //FIXME auto discard CPU
  };

  this.getCards = function () {
    if (_count-- > 0){
      return allCards.slice(_count * 13, (_count+1)*13);
    }
  };
  

  /*
   * 通过manager与之交互, player出牌
   */
  this.playerDiscard = function (card) {
    if (currentPlayer != this.player) {
      console.error("You can NOT discard"); return ;
    }
    interactive = false;
    discard(card);
    //uiManager.deal();
  };

  // functions for debug
  this.discardD = discard;
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


/**
 * Recoder: to record players discarded card
 */
function Recoder(ps) {
  var records = new HashTable();
  constructor(ps);

  // private
  function constructor(ps) {
    for (var p in ps) {
      var key = ps[p].name;
      records.setItem(key, new Array());
    }
    assert(records.length == 4, ps);
  }


  // public
  this.record = function (who, card) {
    records.getItem(who.name, card);
  };

  this.xxx = function () {
    return recoder.items;
  }
}

// -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
