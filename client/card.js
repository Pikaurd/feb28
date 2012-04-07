/**
 * This is file is defined 'How to draw a card'
 */

function Card() {
  /* 
   * constructor
   * 3 arguments => rank width suit
   * 2 arguments => num width
   */
  var rank;
  var width = arguments[1];
  var height = Math.floor(width/ 3 * 4);
  if (arguments.length == 3) {
    rank = arguments[0];
    this.suit = arguments[2];
  } else if (arguments.length == 2) {
    rank = arguments[0] % 13;
    switch (Math.floor(arguments[0] / 13)) {
      case 0:
        this.suit = Suits.Heart;
        break;
      case 1:
        this.suit = Suits.Spade;
        break;
      case 2:
        this.suit = Suits.Diamond;
        break;
      case 3:
        this.suit = Suits.Club;
        break;
      default:
        console.error("card init error");
        break;
    }
  }
  this.position = null;

  this.getScore = function () {
    var score = null;
    switch (rank) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
        score = rank + 2;
        break;
      case 9:
        score = "J";
        break;
      case 10:
        score = "Q";
        break;
      case 11:
        score = "K";
        break;
      case 12:
        score = "A";
        break;
      default:
        console.error("Opps, [manager.js -> getScore]", rank);
    }
    return score;
  };

  this.getNum = function() {
    var num = 0;
    switch (this.suit) {
      case Suits.Heart:
        num = rank;
      break;
      case Suits.Diamond:
        num = 13 + rank;
      break;
      case Suits.Spade:
        num = 13 * 2 + rank;
      break;
      case Suits.Club:
        num = 13 * 3 + rank;
      break;
    }
    return num;
  };

  this.draw = function (context, x, y, r) {
    this.position = new Pair(x, y);
    context.save();
    var suitWidth = Math.floor(width / 5);
    roundedRect(context, x, y, r, width, height);// outter rect
    context.stroke(); // storke the whole card
    context.fillStyle = "white";
    context.fill();
    
    // draw left side score and suit
    drawSuitPattern(context, x + r, y + r, suitWidth, rank, this.suit.draw);
    this.drawScoreAndSuit(context, x , y + 3*r, r);

    // draw another side
    context.translate(x + width, y + height);
    context.rotate(Math.PI);
    this.drawScoreAndSuit(context, 0, 3*r, r);
    
    context.restore();
  };

  /**
   * draw a card num and suit on left edge
   */
  this.drawScoreAndSuit = function (context, x, y, offset) {
    context.save();
    // FIXME do NOT using magic number
    this.suit.draw(context, Math.floor(x + offset / 2), y , 12, 16);
    var fontFamily = "17px 'Gill Sans Ultra Bold',sans-serif";//FIXME extra them
    context.font = fontFamily;
    context.fillStyle = this.suit.color;
    context.fillText(this.getScore(), x, y);
    context.restore();
  };
}

/**
 * draw suit using pattens
 */
function drawSuitPattern(context, x, y, suitWidth, num, drawSuit) {
  context.save();
  context.translate(x, y);
  var suitHeight = Math.floor(suitWidth / 3 * 4);
  //var width = suitWidth * 4;  
  //var height = Math.floor(width / 5 * 8);
  var patterns = suitsPattens(num);
  var xMargin = Math.floor(suitWidth / 6 * 5);
  var yMargin = Math.floor(suitHeight * 0.65);
  for (var i = 0; i < patterns.length; i++) {
    var x = patterns[i].fst;
    var y = patterns[i].snd;
    if (y >= 0)
      drawSuit(context, x * xMargin, (3 - y) * yMargin, suitWidth, suitHeight);
    else //TODO remove else consider refactory the function drawReversedSuit
      drawReversedSuit(context, x * xMargin, (3 - y) * yMargin, suitWidth, suitHeight, drawSuit);
  }
  context.restore();
}

