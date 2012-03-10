/**
 * Manager
 */
var cardWidth = 85;
function Manager(context, width) {
  // Properties
  this.startPoint = new Pair(Math.floor(width/3), 
                             Math.floor(width / 16 * 9 / 3 * 2));
  this.allCards = [null]; // holding all cards on the table, the first one to keep which one ready
  this.margin = 20; //TODO not implement

  // Methods
  this.init = function (whatToDeal) {
    var suits = ["Heart", "Diamond", "Spade", "Club"];
    for (var i = 0; i < suits.length; i++) {//FORLOOP
      var tmp = whatToDeal[suits[i]];
      for (var j = 0; j < tmp.length; j++) {//FORLOOP
        var card = new Card(tmp[j], cardWidth, suits[i]);
        this.allCards.push(card);
      }
    }
  };
  
  this.deal = function () {
    context.save();
    context.clearRect(315, 355, 320, 150); // TODO no num
    var ready = this.allCards[0];

    var count = 0; //Make sure x coordinate correct
    for (var i = 1; i < this.allCards.length; i++) { //FORLOOP
      var card = this.allCards[i];
      var upOffset = this.margin;
      if (ready == card)
        upOffset = 0;
      card.draw(context
                , this.startPoint.fst + (count++) * this.margin
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
    for (var i = 1; i < this.allCards.length; i++) {// skip the first one FOORLOOP
      var position = this.allCards[i].position;
      var ckeckedWidth = this.margin;

      if (i == this.allCards.length - 1)
        ckeckedWidth = cardWidth;
        
      area = new Area(position, new Pair(ckeckedWidth, height));

      if (collisonTest(area, point)) 
        found = i;
    }
    return found;
  };

  this.produce = function () { //貌似 出牌 是produce
    var card = this.allCards[0]; // 起来的那张牌
    this.allCards[0] = null;//not necessary mark
    var index = this.allCards.slice(1).indexOf(card);
    if (index != -1) {
      animate(context, card.position, new Pair(400, 100), card);
      //card.draw(context, 0, 0, 5);// 出了的那张的位置 FIXME we need 4 position
      this.allCards.splice(index+1, 1);
    }
  };

  this.ready = function (whichReadyCardIndex) {
    this.allCards[0] = this.allCards[whichReadyCardIndex];
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
  else //FIXME remove else
    manager.produce();
  
  manager.deal();    
}

function collisonTest(area, point) {
  var xCT = false;
  var yCT = false;
  // x test
  var tmpX = point.fst - area.position.fst;
  if (tmpX >= 0 && area.range.fst - tmpX >= 0)
    xCT = true;

  // y test
  var tmpY = point.snd - area.position.snd;
  if (tmpY >= 0 && area.range.snd - tmpY >= 0)
    yCT = true;

  return xCT && yCT;
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

  var xTolerance = xStep.produce() + 1;
  var yTolerance = yStep.produce() + 1;

  var intervalID = setInterval(
    function () {
      //TODO out of bounds check method
      currentX -= xStep.produce();
      currentY -= yStep.produce();

      card.draw(context, currentX, currentY, 5); 

      if ((currentX - target.fst) <= xTolerance 
           && (currentY - target.snd) <= yTolerance) {
        //FIXME another trick ^^^^^^^^
        //console.log("cleared interval id:", intervalID);
        clearInterval(intervalID);
        manager.repaint();
        card.draw(context, target.fst, target.snd, 5); 
      }
    }, refreshTime);
}

