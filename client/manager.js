/**
 * Manager
 */
var cardWidth = 85;
function Manager(context, width) {
  // Properties
  this.startPoint = new Pair(Math.floor(width/3), 
                             Math.floor(width / 16 * 9 / 3 * 2));
  // holding all cards on the table, the first one to keep the ready one 
  playerCards = [null];
  var _margin = 20;
  var thisTurnSuit = null;// make sure right suit to discard

  var discardRuls = new Array();

  // --- private Methods ---
  function compare(a, b) {
    return a - b;
  }

  function discard(card, x, y, r) { //貌似 出牌 是discard
    card.draw(context, x, y, r);
  }

  /*
   * Check whether discarded card fit the rules
   */
  function isLegitimate(whichCard) {
    console.debug("[D]isLegitimate", whichCard);
    var num = whichCard.getNum();
    return num >=0 && num < 52;
  }

  // --- public methods ---
  this.init = function (ranks) {
    playerCards = [null];
    var cards = new Array();
    for (var r in ranks.sort(compare)) {
      var card = new Card(ranks[r], cardWidth);
      cards.push(card);
      playerCards.push(card);
      if (ranks[r] == 39) 
        playerCards[0] = card;
    }
  };
  
  this.deal = function () {
    context.save();
    context.clearRect(315, 355, 340, 150); // TODO no num
    var ready = playerCards[0];

    var count = 0; //Make sure x coordinate correct
    for (var i = 1; i < playerCards.length; i++) { //FORLOOP
      var card = playerCards[i];
      var upOffset = _margin;
      if (ready == card)
        upOffset = 0;
      card.draw(context
                , this.startPoint.fst + (count++) * _margin
                , this.startPoint.snd + upOffset
                , 5
                );
    }

    context.restore();
  };
  
  /**
   * check whether the point on the card
   */
  this.inCheck = function (point) {
    var found = -1;
    var height = Math.floor(cardWidth / 3 * 4);    
    for (var i = 1; i < playerCards.length; i++) {// skip the first one FOORLOOP
      var position = playerCards[i].position;
      var ckeckedWidth = _margin;

      if (i == playerCards.length - 1)
        ckeckedWidth = cardWidth;
        
      area = new Area(position, new Pair(ckeckedWidth, height));

      if (collisonTest(area, point)) 
        found = i;
    }
    return found;
  };

  this.playerDiscard = function () {
    var card = playerCards[0]; // 起来的那张牌
    var index = playerCards.slice(1).indexOf(card);
    if (index != -1 && isLegitimate(card)) {
      playerCards.splice(index+1, 1);
      discard(card, 438, 200, 5);//XXX magic position
      if (!arguments[0])
        logicalManager.playerDiscard(card.getNum());
      this.deal();
    }
  };

  this.cpuDiscard = function (card, position) {
    console.debug("[D] cpuDiscard:", card);

    discard(new Card(card, 85), position.fst, position.snd, 5);
  };


  this.ready = function (whichReadyCardIndex) {
    playerCards[0] = playerCards[whichReadyCardIndex];
    this.deal();
  };

  /**
   * repaint whole canvas
   */
  this.repaint = function () {
    context.save();
    context.clearRect(0, 0, 960, 540);
    this.deal();
    context.restore();
  };

}

// Listeners
/**
 * 这个放法管的是检点住了没, 点住了动一下牌, 没点住不管, 点空白再出牌
 */
function clickEvent(e) {
  var position = getCursorPosition(e, this);
  var whichCard = manager.inCheck(position);
  if (whichCard != -1) //TODO consider change to another way
    manager.ready(whichCard);
  else
    manager.playerDiscard();
  
}

function collisonTest(area, point) {
    return point.fst >= area.position.fst &&
           point.fst <= (area.range.fst + area.position.fst) &&
           point.snd >= area.position.snd &&
           point.snd <= (area.range.snd + area.position.snd);
}

// ------------ Animation --------------
var fps = 30;
var refreshTime = Math.floor(1000 / fps);
function animate(context, startPosition, target, card) {
  //TODO 待完善吧…
  var xStep = new IntAmender((startPosition.fst - target.fst) / fps);
  var yStep = new IntAmender((startPosition.snd - target.snd) / fps);

  var currentX = startPosition.fst;
  var currentY = startPosition.snd;

  var xTolerance = xStep.produce() + 2;
  var yTolerance = yStep.produce() + 2;

  var intervalID = setInterval(
    function () {
      //TODO out of bounds check method
      currentX -= xStep.produce();
      currentY -= yStep.produce();

      card.draw(context, currentX, currentY, 5); 

      if ((currentX - target.fst) <= xTolerance 
           && (currentY - target.snd) <= yTolerance) {
        //console.log("cleared interval id:", intervalID);
        clearInterval(intervalID);
        manager.repaint();
        card.draw(context, target.fst, target.snd, 5); 
      }
    }, refreshTime);
}

