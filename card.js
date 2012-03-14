/**
 * This is file is defined 'How to draw a card'
 */

function Card(num, width, suit) {
  this.num = num;
  this.width = width;
  this.height = Math.floor(width / 3 * 4);
  this.position = null;
  this.suit = suit;

  this.draw = function (context, x, y, r) {
    this.position = new Pair(x, y);
    context.save();
    var suitWidth = Math.floor(width / 5);
    roundedRect(context, x, y, r, width, this.height);// outter rect
    context.stroke(); // storke the whole card
    context.fillStyle = "white";
    context.fill();
    
    // draw left side score and suit
    drawSuitPattern(context, x + r, y + r, suitWidth, num, this.suit.draw);
    this.drawScoreAndSuit(context, x , y + 3*r, r);

    // draw another side
    context.translate(x+width, y+this.height);
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
    var scoreStr = num.toString();
    switch (num) {
      case 1:
        scoreStr = "A";
      break;
      case 11:
        scoreStr = "J";
      break;
      case 12:
        scoreStr = "Q";
      break;
      case 13:
        scoreStr = "K";
      break;
      case 14:
      case 15:
        scoreStr = "Joker";
      break;
    }
    context.fillText(scoreStr, x, y);
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
  var width = suitWidth * 4;  
  var height = Math.floor(width / 5 * 8);
  var patterns = suitsPattens(num);
  var xMargin = Math.floor(suitWidth / 6 * 5);
  var yMargin = Math.floor(suitHeight * 0.65);
  for (var i = 0; i < patterns.length; i++) {
    var x = patterns[i].fst;
    var y = patterns[i].snd;
    if (y >= 0)
      drawSuit(context, x * xMargin, (3 - y) * yMargin, suitWidth, suitHeight);
    else //TODO remove else. consider refactory the function drawReversedSuit
      drawReversedSuit(context, x * xMargin, (3 - y) * yMargin, suitWidth, suitHeight, drawSuit);
  }
  context.restore();
}

