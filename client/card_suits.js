/*from url=(0079)http://www.html5canvastutorials.com/demos/labs/html5_canvas_playing_card_suits/ */
// width * height using 3 : 4
function drawSpade(context, x, y, width, height){
  x = x + Math.floor(width/2); //modified
  context.save();
  var bottomWidth = width * 0.7;
  var topHeight = height * 0.7;
  var bottomHeight = height * 0.3;
  
  context.beginPath();
  context.fillStyle = "black";
  context.moveTo(x, y);
  
  // top left of spade          
  context.bezierCurveTo(
          x, y + topHeight / 2, // control point 1
          x - width / 2, y + topHeight / 2, // control point 2
          x - width / 2, y + topHeight // end point
      );
  
  // bottom left of spade
  context.bezierCurveTo(
          x - width / 2, y + topHeight * 1.3, // control point 1
          x, y + topHeight * 1.3, // control point 2
          x, y + topHeight // end point
      );
  
  // bottom right of spade
  context.bezierCurveTo(
          x, y + topHeight * 1.3, // control point 1
          x + width / 2, y + topHeight * 1.3, // control point 2
          x + width / 2, y + topHeight // end point
      );
  
  // top right of spade
  context.bezierCurveTo(
          x + width / 2, y + topHeight / 2, // control point 1
          x, y + topHeight / 2, // control point 2
          x, y // end point
      );
  
  context.closePath();
  context.fill();
  
  // bottom of spade
  context.beginPath();
  context.moveTo(x, y + topHeight);
  context.quadraticCurveTo(
          x, y + topHeight + bottomHeight, // control point
          x - bottomWidth / 2, y + topHeight + bottomHeight // end point
      );
  context.lineTo(x + bottomWidth / 2, y + topHeight + bottomHeight);
  context.quadraticCurveTo(
          x, y + topHeight + bottomHeight, // control point
          x, y + topHeight // end point
      );
  context.closePath();
  context.fill();
  context.restore();
}
            
function drawHeart(context, x, y, width, height){
  x = x + Math.floor(width/2); //modified
  context.save();
  context.beginPath();
  var topCurveHeight = height * 0.3;
  context.moveTo(x, y + topCurveHeight);
  // top left curve
  context.bezierCurveTo(
                          x, y, 
                          x - width / 2, y, 
                          x - width / 2, y + topCurveHeight
                  );
  
  // bottom left curve
  context.bezierCurveTo(
                          x - width / 2, y + (height + topCurveHeight) / 2, 
                          x, y + (height + topCurveHeight) / 2, 
                          x, y + height
                  );
  
  // bottom right curve
  context.bezierCurveTo(
                          x, y + (height + topCurveHeight) / 2, 
                          x + width / 2, y + (height + topCurveHeight) / 2, 
                          x + width / 2, y + topCurveHeight
                  );
  
  // top right curve
  context.bezierCurveTo(
                          x + width / 2, y, 
                          x, y, 
                          x, y + topCurveHeight
                  );
  
  context.closePath();
  context.fillStyle = "red";
  context.fill();
  context.restore();
}
            
function drawClub(context, x, y, width, height){
  x = x + Math.floor(width/2); //modified
  context.save();
  var circleRadius = width * 0.3;
  var bottomWidth = width * 0.5;
  var bottomHeight = height * 0.35;
  context.fillStyle = "black";
                  
  // top circle
  context.beginPath();
  context.arc(
                x, y + circleRadius + (height * 0.05), 
                circleRadius, 0, 2 * Math.PI, false
             );
  context.fill();
  
  // bottom right circle
  context.beginPath();
  context.arc(
                x + circleRadius, y + (height * 0.6), 
                circleRadius, 0, 2 * Math.PI, false
             );
  context.fill();
  
  // bottom left circle
  context.beginPath();
  context.arc(
                x - circleRadius, y + (height * 0.6), 
                circleRadius, 0, 2 * Math.PI, false
             );
  context.fill();
  
  // center filler circle
  context.beginPath();
  context.arc(
                x, y + (height * 0.5), 
                circleRadius / 2, 0, 2 * Math.PI, false
             );
  context.fill();
  
  // bottom of club
  context.moveTo(x, y + (height * 0.6));
  context.quadraticCurveTo(
                          x, y + height, 
                          x - bottomWidth / 2, y + height
                  );
  context.lineTo(x + bottomWidth / 2, y + height);
  context.quadraticCurveTo(
                          x, y + height, 
                          x, y + (height * 0.6)
                  );
  context.closePath();
  context.fill();
  context.restore();
}
            
function drawDiamond(context, x, y, width, height){
  x = x + Math.floor(width/2); //modified
  context.save();
  context.beginPath();
  context.moveTo(x, y);
    
  // top left edge
  context.lineTo(x - width / 2, y + height / 2);
    
  // bottom left edge
  context.lineTo(x, y + height);
    
  // bottom right edge
  context.lineTo(x + width / 2, y + height / 2);
    
  // closing the path automatically creates
  // the top right edge
  context.closePath();
    
  context.fillStyle = "red";
  context.fill();
  context.restore();
}
// draw reversed suits
function drawReversedSuit(context, x, y, width, height, drawSuit) {
  context.save();
  var xOffset = Math.floor(width / 2);
  var yOffset = Math.floor(height / 2)
  context.translate(x + xOffset, y + yOffset);
  context.rotate(Math.PI);
  drawSuit(context, -xOffset, -yOffset, width, height);
  context.restore();
}

// new added
/**
 *    0  1  2  3  4 
 *  4 ┌──┬──┬──┬──┐ 
 *  3 ├──┼──┼──┼──┤
 *  2 ├──┼──┼──┼──┤
 *  1 ├──┼──┼──┼──┤
 *  0 ├──┼──┼──┼──┤
 * -1 ├──┼──┼──┼──┤
 * -2 ├──┼──┼──┼──┤
 * -3 ├──┼──┼──┼──┤
 * -4 └──┴──┴──┴──┘  │
 * 各个图形位置使用这个坐标的交点来表示
 */
/**
 * baseArrangement is a descriptor of "How the card suits of above part  
 * arrangement". So there are 5 elements.
 */
var baseArrangement = [
    [new Pair(2, 0)] // Ace
  , [new Pair(2, 3)] // 2
  , [new Pair(2, 3), new Pair(2, 0)] // 3
  , [new Pair(1, 3), new Pair(3, 3)] // 4
  , [new Pair(1, 3), new Pair(3, 3), new Pair(2, 0)] // 5
  , [new Pair(1, 3), new Pair(3, 3), new Pair(1, 0), new Pair(3, 0)] // 6
  , [new Pair(1, 3), new Pair(3, 3), new Pair(2, 2), new Pair(1, 0), new Pair(3, 0)] // 7, 8
  , [new Pair(1, 3), new Pair(3, 3), new Pair(1, 1), new Pair(3, 1), new Pair(2, 2)] // 9, 10
];

/**
 * Translate baseArrangement to fullArrangement(shapeArragement)
 */
function suitsPattens(num) {
  var result;
  var index = num - 1;
  var basePair;
    switch (num) {
      case 1: 
        result = baseArrangement[index].slice();
      break;
      case 2: // pattern 1
      case 3: // pattern 2
        basePair = baseArrangement[index].slice();
        result = batchCoordinateReverse(basePair, 1, basePair);
      break;
      case 4: // pattern 3
      case 5: // pattern 4
      case 6: // pattern 5
      case 7: // pattern 6
        basePair = baseArrangement[index].slice();
        result = batchCoordinateReverse(basePair, 2, basePair);
      break;
      case 8: // pattern 6
        basePair = baseArrangement[6].slice(); 
        result = batchCoordinateReverse(basePair, 3, basePair);
      break;
      case 9: // pattern 7
        basePair = baseArrangement[7].slice();
        result = batchCoordinateReverse(basePair, 4, basePair);
      break;
      case 10: // pattern 7
        basePair = baseArrangement[7].slice(); 
        result = batchCoordinateReverse(basePair, 5, basePair);
      break;

      case 11:
      case 12:
      case 13:
        result = [];
      break;

      default:
        console.info(num, "Opps, there must be someting wrong");
      break;
    
  }
  return result;
}

// shape coordinate reverse
function coordinateReverse(pair) {
  return new Pair(pair.fst, -pair.snd);
}

function batchCoordinateReverse(container, times, basePairs) {
  for (var i = 0; i < times; i++)
    container.push(coordinateReverse(basePairs[i]));
  return container;
}

/**
 * Suits
 */
var Suits = {
    Heart: {name:"Heart", color:"red", draw:drawHeart}
  , Diamond: {name:"Diamond", color:"red", draw:drawDiamond}
  , Spade: {name:"Spade", color:"black", draw:drawSpade}
  , Club: {name:"Club", color:"black", draw:drawClub}
};

// testing ---------
// for testing
function arr2String(x) {
  var result = new StringBuffer();
  for (var v in x) {
    result.append(x[v].fst);
    result.append(x[v].snd);
  }
  return result.toString();
}
