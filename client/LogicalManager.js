/*
 * Logical manager
 * manage all players
 *
 * @reqiure manager.js util.js
 *
 * 明显抽象级别混乱了…
 * XXX这个里面的更低, 说混乱可能有点过了, 反正不统一
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

  var currentTurnSuit = null;

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

  function changeTurnSuit(card) {
    var suit = null;
    console.info("is next turn", recorder.isNextTurn());
    if (!recorder.isNextTurn())
      suit = Math.floor(card / 13);
    currentTurnSuit = suit;
    console.info("current suit is:   ", currentTurnSuit);
  }

  /**
   * suit checker
   * if not pass throw an exception
   */
  function checkSuit(num) {
    if (currentTurnSuit != null) {
      var lowerBound = currentTurnSuit * 13;
      var upperBound = lowerBound + 13;
      if (num < lowerBound || num >= upperBound){
        throw {
            name: "Suit not match error"
          , level: "Show Stopper"
          , massage: "Suit not match, please offer correct card"
        };
      }
      console.log("l", lowerBound, "u", upperBound, "num", num);
    }
  }


  /*
   * 出牌
   * 该CPU出就出, 该玩家出转移控制权
   */
  function discard() {//TODO refactory
    var whichCard = arguments[0];

    checkSuit(whichCard);  


    console.debug("[D] currentPlayer:", currentPlayer);
    if (currentPlayer == that.player) {
      if (whichCard != 39)
        console.error("Auto discard!!", whichCard);

      uiManager.playerDiscard(whichCard);
      //console.debug("Player discard", whichCard);
      console.info("You have not control");
    } else {
      //  FIXME 位置
      uiManager.cpuDiscard(whichCard, currentPlayer.position);
    }
    currentPlayer = playerQueue.next();

    // record
    recorder.record(currentPlayer, whichCard);

    changeTurnSuit(whichCard);

    console.debug("[D] currentPlayer:", currentPlayer);
  }

  // public methods
  this.init = function(uimgr) {
    players.push(new CPU(this.getCards(), new Pair(375, 165)));
    players.push(new CPU(this.getCards(), new Pair(438, 130)));
    players.push(new CPU(this.getCards(), new Pair(505, 165)));
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
      console.error("You can NOT discard");
      return ;
    }
    interactive = false;
    discard(card);
    //uiManager.deal();
  };

  // functions for debug
  this.rec = function () {return recorder;};
  this.discardD = discard;
}

function Player(name, cards) {
  this.name = name;
  this.cards = cards;
}

/**
 * CPU 
 * XXX 它的位置信息不应该在这里
 */
function CPU(cards, position) {
  var cardsCount = cards.length;

  this.name = "CPU" + cpuIndex++;
  this.cards = cards;
  
  this.position = position;

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
  var sum = 0; // sum of discarded cards
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
    //var cards = records.getItem(who.name);
    //cards.push(card);
    //console.log("record", cards);
    sum++;
    records.getItem(who.name).push(card);
  };

  /**
   * 看看是不是该下一轮了
   */
  this.isNextTurn = function () {
    return sum % 4 == 0;
  };

  this.xxx = function () {
    return records.items;
  }
}

// -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
