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
var ReturnState = {OK:true, FAILD:false};
function LogicalManager() {
  //constructor
  var players = new Array();
  var allCards = shuffle(range(52));
  var currentPlayer = null;
  var recorder = null;

  var playerQueue;
  //var interactive = false; // communicate with manager.js
  var uiManager = null;

  var currentTurnSuit = 3;

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
      //interactive = true;
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
    console.log("[changeTurnSuit]is next turn", recorder.isNextTurn());
    if (currentTurnSuit == null)
      currentTurnSuit = Math.floor(card / 13);
    if (recorder.isNextTurn())
      currentTurnSuit = null;
    console.info("[changeTurnSuit]current suit is:   ", currentTurnSuit);
  }

  /**
   * suit checker
   * if not pass throw an exception
   */
  function checkSuit(num) {
    // XXX double invoke >discard< >canDiscard<
    //var noMoreCardWithCurrentTurnSuit = false;
    var t = currentPlayer.cards.filter(function (x){
      return x >= currentTurnSuit * 13 && x < currentTurnSuit*13 + 13;
    });

    if (t.length == 0) return; //当前花色出完了
    console.debug("whom", currentPlayer.name, "current cards", currentPlayer.cards, "noMore", t);

    if (currentTurnSuit != null) {
      var lowerBound = currentTurnSuit * 13;
      var upperBound = lowerBound + 13;
      if (num < lowerBound || num >= upperBound){
        throw {
            name: "Suit not match error"
          , level: "Show Stopper"
          , message: "Suit not match, please offer correct card"
        };
      }
    }
  }


  /*
   * 出牌
   * 该CPU出就出, 该玩家出转移控制权
   */
  function discard(whichCard) {//TODO refactory
    try {
      console.debug("[D] currentPlayer:", currentPlayer.name);
      if (currentPlayer == that.player) {
        checkSuit(whichCard);//假设CPU不会出不符合规范的牌

        /*
        if (whichCard != 39)
          console.error("Auto discard!!", whichCard);
        */

        uiManager.playerDiscard(whichCard);
        //console.debug("Player discard", whichCard);
        console.info("You have not control");
      } else {

        if (whichCard == ClubDeuce)
          whichCard = currentPlayer.discard(whichCard);
        else
          whichCard = currentPlayer.discard(currentTurnSuit);

        uiManager.cpuDiscard(whichCard, currentPlayer.position);
      }

      // record
      recorder.record(currentPlayer, whichCard);
      console.log("[Rec]:", currentPlayer.name, "d:", whichCard);

      determinNextPlayer(); // change to next one
      changeTurnSuit(whichCard);

    } catch (e) {
      console.error(e.message);
      return ReturnState.FAILD;
    }

    console.debug("[D] next Player:", currentPlayer.name);
    return ReturnState.OK;
  }

  /**
   * While a player discarded determin whom is next
   */
  function determinNextPlayer() {
    if (recorder.isNextTurn()) {
      setTimeout(clearDiscardedCardOnDesk, 1000);
      playerQueue.setFirst(recorder.nextFirst(currentTurnSuit));
    }
    currentPlayer = playerQueue.next();
  }

  function clearDiscardedCardOnDesk() {
    uiManager.repaint();
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

    //init recorder
    recorder = new Recorder(players);
    //console.debug("recorder init", recorder.itmes, players);
    uiManager = uimgr;
  };

  this.run = function () {
    determinFirstPlayer();

    //FIXME auto discard CPU
    ptRun();
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
    if (discard(card) == ReturnState.OK) {
      var index = this.player.cards.indexOf(card);
      this.player.cards.splice(index,1);
    }
  };

  /**
   * 检测是否可以出牌
   */
  this.canDiscard = function (cardnum) {
    var can = ReturnState.FAILD;
    if (currentPlayer == this.player) {
      try {
        can = ReturnState.OK;
        checkSuit(cardnum);
      } catch (e) {
        can = ReturnState.FAILD;
        console.error(e.message);
      }
    }
    return can;
  }


  // functions for debug
  this.rec = function () {return recorder;};
  this.discardD = discard;
  this.tRun = ptRun;

  function ptRun() {
    if (currentPlayer == that.player) {
      console.log("You have control!!!");
      return;
    }
    console.log("-*-*- RUN -*-*-")

    discard();
    // loop
    setTimeout(ptRun, 1000);

  };
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
    if (arguments[0] == ClubDeuce) {
      var index = this.cards.indexOf(ClubDeuce);
      this.cards.splice(index,1);
      return ClubDeuce;
    }

    if (this.cards.length == 0) 
      throw {
          name: "no more cards"
      };

    var filter = function (x) {return x >= suit && x < suit + 13;};

    console.debug("what cpu cards are", this.cards, "suit", arguments[0]);
    var suit = arguments[0] * 13;
    if (arguments[0] == null)
      suit = getRandomInt(0, 3) * 13;
    console.log("suit change", suit);

    
    var cs =this.cards.filter(filter);
    console.debug("after filter", cs);

    if (cs.length == 0) {
      console.log("No more cards with suit", suit, "all I have is", this.cards);
      cs = this.cards;
    }

    var cardNum = cs[0];
    //delete the discarded one
    var index = this.cards.indexOf(cardNum);
    //console.debug("before splice", this.cards, "index", index);
    this.cards.splice(index,1);
    //console.debug("what i splice", this.cards.splice(index,1));
    //console.debug("after splice", this.cards);
    console.debug("-->what cpu discard", cardNum);
    return cardNum;
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
 * Recorder: to record players discarded card
 */
function Recorder(ps) {
  var records = new HashTable();
  var sum = 0; // sum of discarded cards
  var keys = new Array();
  constructor(ps);

  // private
  function constructor(ps) {
    for (var p in ps) {
      var key = ps[p].name;
      keys.push(ps[p]);
      records.setItem(key, new Array());
    }
    assert(records.length == 4, ps);
  }


  // public
  this.record = function (who, card) {
    sum++;
    console.debug("who", who.name, "with", card);
    records.getItem(who.name).push(card);
  };

  /**
   * 看看是不是该下一轮了
   */
  this.isNextTurn = function () {
    return sum % 4 == 0;
  };

  /**
   * 本轮出完后谁下一轮先出(同花色情况下点数最大)
   */
  this.nextFirst = function (lastTurnSuit) {
    if (this.isNextTurn()) {
      var index = Math.floor(sum / 4) - 1;

      var max = -1;
      var whom = null;
      for (var i = 0; i < records.length; i++) {
        var t = (records.getItem(keys[i].name))[index];
        console.debug("Name:", keys[i].name, "with", t);
        if (t > max && matchGivenSuit(t, lastTurnSuit)) {
          max = t;
          whom = keys[i];
        }
      }
      console.info("Next turn first is", whom.name);
      return whom;
    }
    return records.getItem(keys[0]);
  }
}

function matchGivenSuit(cardNum, suit) {
  if (suit > 3 || suit < 0) throw {name:"suit num error"};
  var lowerBound = suit * 13;
  var upperBound = lowerBound + 13;
  return cardNum >= lowerBound && cardNum < upperBound;
}
// -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
