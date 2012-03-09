/**
 * Manager
 */
var cardWidth = 85;
function Manager(context) {
  // --testing 
  var point = new Pair(320, 360); 
  // end
  
  // holding all cards on the table, the first one to keep which one ready
  var suits = ["Heart", "Diamond", "Spade", "Club"]; //TODO extra?
  //properties
  this.allCards = [null]; 
  this.deal = function (whatToDeal) {
    context.save();
    var count = 0; //Is it needed?
    for (var i = 0; i < suits.length; i++) {
      var tmp = whatToDeal[suits[i]];
      for (var j = 0; j < tmp.length; j++) {
        var card = new Card(context, tmp[j], cardWidth, suits[i]);
        card.draw(point.fst + (count++) * 20, point.snd + 20, 5);
        this.allCards.push(card);
      }
    }
    context.restore();
  };
  // collision tests
  this.inCheck = function (point) {
    //console.debug(point.fst, point.snd);
    //console.debug(allCards);
    var found = -1;
    // skip the first one
    for (var i = 1; i < this.allCards.length; i++) {
      //TODO  reformmat
      var position = this.allCards[i].position;
      var height = Math.floor(cardWidth / 3 * 4);

      // TODO else is necessary?
      if (i == this.allCards.length - 1)
        area = new Area(position, new Pair(cardWidth, height));
      else
        var area = new Area(position, new Pair(20, height));//FIXME 20
      if (collisonTest(area, point)) {
        //TODO set first here?
        this.allCards[0] = this.allCards[i];
        return i;
      }
    }
    return found;
  };

  this.youTurn = function () { //出牌英语的不会啊…
    var card = this.allCards[0];
    var index = this.allCards.slice(1).indexOf(card);
    if (index != -1) {
      d = card;
      card.draw(0, 0, 5);
      this.allCards.splice(index+1, 1);
      console.debug("where is my card?", card);
    }
    console.log("youTrun finished");
  };

  // redeal will be combine
  this.reDeal = function () {
    context.save();
    context.clearRect(320, 360, 960, 540);
    var ready = this.allCards[0];

    var count = 0; //Is it needed?
    for (var i = 1; i < this.allCards.length; i++) {
      var card = this.allCards[i];
      if (ready == card)
        card.draw(point.fst + (count++) * 20, point.snd, 5);
      else
        card.draw(point.fst + (count++) * 20, point.snd + 20, 5);
    }

    context.restore();
  };
  
  this.ready = function (whichReadyCardIndex) {
    this.allCards[0] = this.allCards[whichReadyCardIndex];
  };
}

var dummyDealing = {// 这个东西是从服务器给来的， 所以就瞎写一个
                     "Heart":[1, 2, 3]
                   , "Diamond": [4, 5, 6]
                   , "Club":[1, 5, 9]
                   , "Spade":[1, 2, 10]
                   };

// Listeners
/**
 * 这个放法管的是检点住了没, 点住了动一下牌, 没点住不管, 点空白再出牌
 */
function clickEvent(e) {
  var position = getCursorPosition(e, this);
  var whichCard = manager.inCheck(position);
  if (whichCard != -1) {
    manager.ready(whichCard);
    manager.reDeal();
  }else{
    manager.youTurn();
    manager.reDeal();
  }
    
  //console.debug("index", debugMsg);
}

function collisonTest(area, point) {
  //TODO reformat
  var xCT = false;
  var yCT = false;
  // x test
  var tmpX = point.fst - area.position.fst;
  if (tmpX >= 0)
    if (area.range.fst - tmpX >= 0)
      xCT = true;

  // y test
  var tmpY = point.snd - area.position.snd;
  if (tmpY >= 0)
    if (area.range.snd - tmpY >= 0)
      yCT = true;
  return xCT && yCT;
}
