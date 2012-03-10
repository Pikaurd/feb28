// -- for canvas --
function getCursorPosition(e, obj) {//obj is which element sent event
  var x;
  var y;
  if (e.pageX || e.pageY) {
    x = e.pageX;
    y = e.pageY;
  } else {
    x = e.clientX + document.body.scrollLeft +
         document.documentElement.scrollLeft;
    y = e.clientY + document.body.scrollTop + 
         document.documentElement.scrollTop;
  }
  x -= obj.offsetLeft;
  y -= obj.offsetTop;
//  console.info("x: " + x + "  y: " + y);
  
  return new Pair(x, y);
}

function roundedRect(context, x, y, r, width, height) {
  context.save();
  context.beginPath();
  context.moveTo(x + r, y);
  // top
  context.lineTo(x + width - r,y);
  context.quadraticCurveTo(
                         x + width, y, 
						 x + width, y + r
						);
  //right
  context.lineTo(x + width, y + height - r);
  context.quadraticCurveTo(
                         x + width, y + height,
						 x + width - r, y + height
						);
  //bottom
  context.lineTo(x + r, y + height);
  context.quadraticCurveTo(
                         x, y + height,
						 x, y + height - r
						);
  //left
  context.lineTo(x, y + r);
  context.quadraticCurveTo(x, y, x + r, y);
  context.closePath();
  context.restore();
}

// -- end --

// -- common --
/**
 * String buffer
 */
function StringBuffer(){
  this.buffer = [];
}
StringBuffer.prototype.append = function append(string){
  this.buffer.push(string);
  return this;
};
StringBuffer.prototype.toString = function toString(){
  return this.buffer.join("");
};

// Define a pair
function Pair(fst, snd) {
  this.fst = fst;
  this.snd = snd;
}

/**
 * Area(x, y, width, height) //rectangl
 * OR Area(x, y, radius) // circle
 * OR Area(Pair, Pair) 
 */
function Area() {
  this.position = new Pair(arguments[0], arguments[1]);
  this.range = null;
  if (arguments.length > 3)
    this.range = new Pair(arguments[2], arguments[3]);
  else if (arguments.length == 3) { //TODO maybe there is a better way
    var r = 2 * arguments[2];
    this.range = new Pair(r, r);
  } else {
    this.position = arguments[0];
    this.range = arguments[1];
  }
}

/**
 * A generator using given decimal to produce integer with amend
 */
function IntAmender(x) {
  //this.integerPart = Math.round(x);
  this.integerPart = parseInt(x);
  this.decimalPart = x - this.integerPart;
  this.amender = 0;

  this.produce = function() {
    this.amender += this.decimalPart;
    var result = this.integerPart;
    if (this.amender >= 1) {
      this.amender  -= 1
      result += 1;
    }
    if (this.amender <= -1) {
      this.amender += 1;
      result -= 1;
    }
    return result;
  };
}
/**
 * Calculate distance of two points
 */
function distance(pa, pb) {
  var x = pa.fst - pb.fst;
  var y = pa.snd - pb.snd;
  return Math.sqrt(x*x + y*y);
}

// ckeck odd
function even(num) {
  return num % 2 == 0;
}

function odd(num) {
  return !even(num);
}
// -- end --
