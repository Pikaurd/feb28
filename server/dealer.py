#!/usr/bin/python3
# -*- coding: utf8 -*-
import pdb

import json
import random

spade2 = 41

class Dealer:
  """Dealer. manager 4 player"""
  def __init__(self):
    self.currentTurnPlayer = None
    self.players = None
    self.deal()
    self.playerQueue = PlayerQueue(self.players)
    self.determineFirstTurnPlayer()
    self.currentTurnCards = CardList()
    
  def deal(self):
    """deal every players cards"""
#    if 0:# another way
    cards = list(range(1,53))
    random.shuffle(cards)
    player1 = Player(cards[:13])
    player2 = Player(cards[13:26])
    player3 = Player(cards[26:39])
    player4 = Player(cards[39:52])
    self.players = {
        player1.identity : player1
      , player2.identity : player2
      , player3.identity : player3
      , player4.identity : player4
      }

    self.__tmpCounter = 0# used be getPlayer

  def getPlayer(self, identity=None):
    """Get a player
    if given a identity then using it. 
    If not return a player from index 1 to 4 in players"""
    if identity == None and self.__tmpCounter < 4:
      identity = [e for e in self.players.keys()][self.__tmpCounter]
      self.__tmpCounter += 1
    else:
      raise GameError("Only 4 players allowed")

    return self.players.get(identity)

  def playerDiscard(self, card):
    #TODO card correct check
    self.currentTurnPlayer.discard(card)
    self.currentTurnCards.push(card, self.currentTurnPlayer.identity)
    self.determineNextPlayer()

  def determineFirstTurnPlayer(self):
    """Detemine which player first
    If can not determine Raise a GameError"""
    for k in self.players.keys():
      player = self.players.get(k)
      if spade2 in player.getCards():
        self.playerQueue.setFirst(player.identity)
        nextPlayerIdentity = self.playerQueue.next()#FIXME extra to a method?
        self.currentTurnPlayer = self.players.get(nextPlayerIdentity)
        return
    raise GameError("NO player has Club 2")

  def determineNextPlayer(self):#TODO needn't any more?
    """There are two cases:
    1. After current turn first player discard. Who is next
    2. Current turn finished, whom is first in next turn"""
    # I need a cyle queue which has 4 element
    if self.currentTurnCards.count() == 4:
      playerID = self.currentTurnCards.max()
      self.playerQueue.setFirst(playerID)
    self.currentTurnPlayer = self.players.get(self.playerQueue.next())

class CardList:
  """Hold one turn all cards
  (suitNum, cardScore, playerID)"""
  def __init__(self):
    self.clear()

  def push(self, card, playerID):
    t = CardList.cardIndexToSuitWithScorePlayerID(card, playerID)
    if len(self._cards) == 4:
      self._cards.pop(0)
    self._cards.append(t)

  def get(self):
    return self._cards[:]

  def clear(self):
    self._cards = []

  @staticmethod
  def cardIndexToSuitWithScorePlayerID(card, playerID):
    suit, score = divmod(card, 13)
    if score == 0:
      suit,score = suit-1, 13
    if score == 1:
      score = 14
    return (suit, score, playerID)

  def count(self):
    return len(self._cards)

  def max(self):
    suit = self._cards[0][0]
    
    return max([e for e in self._cards if e[0] == suit])[2]



class PlayerQueue:
  """A 4 element cycle queue to simulate order of players"""
  def __init__(self, playersDict, index=0):
    self.index = index
    self.players = list(playersDict.keys())#only keys

  def next(self):
    currentPlayerKey = self.players.pop(0)
    self.players.append(currentPlayerKey)
    return currentPlayerKey

  def setFirst(self, key):
    if key != self.players[0]:
      self.next()
      self.setFirst(key)


class Player:
  """Player: what cards the player have and score"""
  def __init__(self, cards=[]):
    cards.sort()
    self.__cards = cards
    self.identity = id(self)

  def discard(self, card):
    """出牌"""
    if card not in self.__cards:
      raise GameError("No such card")
    self.__cards.remove(card)
    return (card, self)

  def getCards(self):
    return self.__cards

class GameError(BaseException):
  def __init__(self, value=""):
    self.value = value

  def __str__(self):
    return self.value.__repr__()
