/**
 * This is file is defined 'How to draw a card'
 */

function Card(context, num, width, suit) {
  this.num = num;
  this.width = width;
  this.height = Math.floor(width / 3 * 4);
  this.position = null;
  this.color = function () {
    var color = "somthing wrong";
    switch (suit) {
      case "Heart":
      case "Diamond":
        color = "red";
      break;
      case "Spade":
      case "Club":
        color = "black";
      break;
      default:
        console.info("Opps, there is something wrong", suit);
      break;
    }
    return color;
  };
  this.drawSuit = determineSuit(suit);
  this.draw = function (x, y, r) {
    this.position = new Pair(x, y);
    context.save();
//    var height = Math.floor(width / 3 * 4);
    var suitWidth = Math.floor(width / 5);
    roundedRect(context, x, y, r, width, this.height);// outter rect
    context.fillStyle = "white";
    context.fill();
    drawSuitPattern(context, x + r, y + r, suitWidth, num, this.drawSuit);
    this.drawScoreAndSuit(x , y + 3*r, r);
    // TODO: add method to rotate
    
    context.translate(x+width, y+this.height);

    context.rotate(Math.PI);
    this.drawScoreAndSuit(0, 3*r, r);
    
    context.restore();
  };
  /**
   * draw a card num and suit on left edge
   */
  this.drawScoreAndSuit = function (x, y, offset) {
    context.save();
    this.drawSuit(context, Math.floor(x + offset / 2), y , 12, 16);
    var fontFamily = "17px 'Gill Sans Ultra Bold',sans-serif";
    context.font = fontFamily;
    context.fillStyle = this.color();
    if (num == 1)
      context.fillText("A", x, y);
    else
      context.fillText(num.toString(), x, y);
    context.restore();
  };
}

/**
 *
 *
 */
function drawSuitPattern(context, x, y, suitWidth, num, drawSuit) {
  context.save();
  context.translate(x, y);
  var suitHeight = Math.floor(suitWidth / 3 * 4);
  var width = suitWidth * 4;  
  var height = Math.floor(width / 5 * 8);
  var patterns = arragementTest(num);
  var xMargin = Math.floor(suitWidth / 6 * 5);
  var yMargin = Math.floor(suitHeight * 0.65);
  for (var i = 0; i < patterns.length; i++) {
    var x = patterns[i].fst;
    var y = patterns[i].snd;
    if (y >= 0)
      drawSuit(context, x * xMargin, (3 - y) * yMargin, suitWidth, suitHeight);
    else 
      drawReversedSuit(context, x * xMargin, (3 - y) * yMargin, suitWidth, suitHeight, drawSuit);
  }
  context.restore();
}

function determineSuit(suit) {
  var func = null;
  switch (suit) {
    case "Heart":
      func = drawHeart;
    break;
    case "Diamond":
      func = drawDiamond;
    break;
    case "Spade":
      func = drawSpade;
    break;
    case "Club":
      func = drawClub;
    break;
    default:
      console.info("[ERR-from determinSuit]Opps, there is something wrong", suit);
    break;
  }
  return func;
}
/*
function testDraw(context) {
  context.save();
  var suits = ["Heart", "Diamond", "Spade", "Club"];
  for (var i = 0; i < suits.length; i++) {
    for (var j = 0; j < 10; j++) {
      var card = new Card(context, j + 1, suits[i], 85);
      card.draw(j*90, i * 120 + 20, 5);
    }
  }
  context.restore();
}
*/
// [4, 3, 2, 1, 0, -1, -2, -3, -4] to [0, 1, 2, 3, 4, 5, 6, 7, 8]
function testC2D(x) {
  return 4 - x;
}
