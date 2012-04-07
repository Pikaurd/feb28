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
function StringBuilder() {
  var buffer = [];

  if (arguments[0])
    buffer.push(arguments[0]);

  this.append = function (s) {
    buffer.push(s);
  };

  this.toString - function () {
    return buffer.join("");
  };
}

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
  var integerPart = parseInt(x);
  var decimalPart = x - integerPart;
  var amender = 0;

  this.produce = function() {
    amender += decimalPart;
    var result = integerPart;
    if (amender >= 1) {
      amender  -= 1
      result += 1;
    }
    if (amender <= -1) {
      amender += 1;
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

/*
 * Shuffle an array
 * http://en.wikipedia.org/wiki/Fisher-Yates_shuffle
 */
function shuffle(a) {
  /*
   * for i from n - 1 downto 1 do
   *   j <- random integer with 0 <= j <= i
   *   exchange a[j] and a[i]
   */
  for (var i = a.length - 1; i >= 0; i--) {
    var j = getRandomInt(0, i);
    var t = a[i];
    a[i] = a[j];
    a[j] = t;
  }
  return a;
}

/*
 * generate a array using given range
 * 1 arguments => 0 to end
 * 2 arguments => start to end
 * 3 arguments => start to end with step
 */
function range() {
  var end, start, step;
  var result = new Array();
  switch (arguments.length) {
    case 1:
      end = arguments[0];
      start = 0;
      step = 1;
    break;
    case 2:
      start = arguments[0];
      end = arguments[1];
      step = 1;
    break;
    case 3:
      start = arguments[0];
      end = arguments[1];
      step = arguments[2];
    break;
    default:
      console.error("illegle parameter count");
      return new Array();
  }

  // error check
  if (step < 0)  return [];
  
  if (start < end) {
    while (end - start > 0) {
      result.push(start);
      start += step;
    }
  } else {
    while (start - end > 0) {
      result.push(start);
      start -= step;
    }
  }

  return result;
}

/*
 * Randoms
 * from https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Math/random
 */
function gerRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Hashtable
 */
function HashTable() {
  this.length = 0;
  this.items = new Array();
  for (var i = 0; i < arguments.length; i += 2) {
    if (typeof (arguments[i + 1]) != 'undefined') {
      this.items[arguments[i]] = arguments[i + 1];
      this.length++;
    }
  }

  this.removeItem = function (in_key) {
    var tmp_previous;
    if (typeof (this.items[in_key]) != 'undefined') {
      this.length--;
      var tmp_previous = this.items[in_key];
      delete this.items[in_key];
    }

    return tmp_previous;
  }

  this.getItem = function (in_key) {
    return this.items[in_key];
  }

  this.setItem = function (in_key, in_value) {
    var tmp_previous;
    if (typeof (in_value) != 'undefined') {
      if (typeof (this.items[in_key]) == 'undefined') {
        this.length++;
      } else {
        tmp_previous = this.items[in_key];
      }

      this.items[in_key] = in_value;
    }

    return tmp_previous;
  }

  this.hasItem = function (in_key) {
    return typeof (this.items[in_key]) != 'undefined';
  }

  this.clear = function () {
    for (var i in this.items) {
      delete this.items[i];
    }

    this.length = 0;
  }
}

/**
 * assert
 */
function assert(b, msg) {
  if (!b) console.error("assertion error", msg);
}
