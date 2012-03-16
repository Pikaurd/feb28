/**
 * Manager
 */
var cardWidth = 85;
function Manager(context, width) {
  // Properties
  this.startPoint = new Pair(Math.floor(width/3), 
                             Math.floor(width / 16 * 9 / 3 * 2));
  // holding all cards on the table, the first one to keep the ready one 
  allCards = [null]; 
  var _margin = 20;
  var thisTurnSuit = null;// make sure right suit to discard

  // Methods
  this.init = function (whatToDeal) {
  //FIXME  code monster…
    var hearts = [];
    var diamonds = [];
    var spades = [];
    var clubs = [];

    // test
    var hAce, dAce, sAce, cAce;
    // tset
    for (var c in whatToDeal) {
      var tmp = whatToDeal[c];
      var score = tmp % 13;
      if (score == 0)
        score = 13;

      switch (Math.floor((tmp - 1) / 13)) {
        case 0:
          if (score == 1)
            hAce = new Card(score, cardWidth, Suits.Heart);
          else
            hearts.push(new Card(score, cardWidth, Suits.Heart));
          break;
        case 1:
          if (score == 1)
            dAce = new Card(score, cardWidth, Suits.Diamond);
          else
            diamonds.push(new Card(score, cardWidth, Suits.Diamond));
          break;
        case 2:
          if (score == 1)
            sAce = new Card(score, cardWidth, Suits.Spade);
          else
            spades.push(new Card(score, cardWidth, Suits.Spade));
          break;
        case 3:
          if (score == 1)
            cAce = new Card(score, cardWidth, Suits.Club);
          else
            clubs.push(new Card(score, cardWidth, Suits.Club));
          break;
        default:
          console.error("Opps, we got a", Math.floor(tmp / 13), tmp);
        break;
      }
    }
    if (hAce) hearts.push(hAce);
    if (dAce) diamonds.push(dAce);
    if (sAce) spades.push(sAce);
    if (cAce) clubs.push(cAce);
    allCards = allCards.concat(hearts).concat(spades).concat(diamonds).concat(clubs);

  };
  
  this.deal = function () {
    context.save();
    context.clearRect(315, 355, 340, 150); // TODO no num
    var ready = allCards[0];

    var count = 0; //Make sure x coordinate correct
    for (var i = 1; i < allCards.length; i++) { //FORLOOP
      var card = allCards[i];
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
    for (var i = 1; i < allCards.length; i++) {// skip the first one FOORLOOP
      var position = allCards[i].position;
      var ckeckedWidth = _margin;

      if (i == allCards.length - 1)
        ckeckedWidth = cardWidth;
        
      area = new Area(position, new Pair(ckeckedWidth, height));

      if (collisonTest(area, point)) 
        found = i;
    }
    return found;
  };

  this.discard = function () { //貌似 出牌 是discard
    var card = allCards[0]; // 起来的那张牌
    allCards[0] = null;//not necessary mark
    var index = allCards.slice(1).indexOf(card);
    if (index != -1) {
      animate(context, card.position, new Pair(400, 100), card);
      //card.draw(context, 0, 0, 5);// 出了的那张的位置 FIXME we need 4 position
      allCards.splice(index+1, 1);
    }
  };

  this.ready = function (whichReadyCardIndex) {
    allCards[0] = allCards[whichReadyCardIndex];
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
    manager.discard();
  
  manager.deal();    
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

