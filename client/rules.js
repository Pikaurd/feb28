/*
 * Rules of Gongzhu
 */
function matchSuit(suit, card) {
  return suit == card.suit;
}

function haveSuit(suit, cards) {
  for (var i in cards)
    if (matchSuit(suit, cards[i]))
      return true;
  return false;
}

/**
 * Rule of game "Gongzhu"
 */
function Rule() {
  var currentSuit = null;
  var players = null;
}
