#!/usr/bin/python3
# -*- coding: utf8 -*-

import unittest

from dealer import Dealer
from dealer import CardList
from dealer import PlayerQueue
from dealer import Player
from dealer import GameError

class TestDealer(unittest.TestCase):
  def setUp(self):
    pass

  def tearDown(self):
    pass

  def test_deal(self):
    dealer = Dealer()
    expected = 13
    player1 = dealer.getPlayer()
    player2 = dealer.getPlayer()
    player3 = dealer.getPlayer()
    player4 = dealer.getPlayer()
    self.assertEqual(expected, len(player1.getCards()))
    self.assertEqual(expected, len(player2.getCards()))
    self.assertEqual(expected, len(player3.getCards()))
    self.assertEqual(expected, len(player4.getCards()))

  def test_getPlayer(self):
    dealer = Dealer()
    player1 = dealer.getPlayer()
    player2 = dealer.getPlayer()
    player3 = dealer.getPlayer()
    player4 = dealer.getPlayer()
    with self.assertRaises(GameError) as e:
      dealer.getPlayer()

  def test_determineFirstTurnPlayer(self):
    dealer = Dealer()
    playerSet = [dealer.players.get(e) for e in dealer.players.keys()]
    self.assertTrue(dealer.currentTurnPlayer in playerSet)

  def test_functional(self):
    dealer = MockDealer()
    player1 = dealer.getPlayer()
    player2 = dealer.getPlayer()
    player3 = dealer.getPlayer()
    player4 = dealer.getPlayer()
    #init finished
    
    after = dealer.currentTurnPlayer
    self.assertEqual(player1, after)
    dealer.playerDiscard(41) # player 1

    after = dealer.currentTurnPlayer
    self.assertEqual(player2, after)
    dealer.playerDiscard(51) # player 2

    after = dealer.currentTurnPlayer
    self.assertEqual(player3, after)
    dealer.playerDiscard(40) # player 3

    after = dealer.currentTurnPlayer
    self.assertEqual(player4, after)
#    import pdb
#    pdb.set_trace()
    dealer.playerDiscard(43) # player 4

    after = dealer.currentTurnPlayer
    self.assertEqual(player3, after)


class TestCardList(unittest.TestCase):
  def test_push(self):
    cl = CardList()
    for i in range(1,10):
      cl.push(i, 1)
    self.assertEqual(4, len(cl.get()))

  def test_cardIndexToSuitWithScore(self):
    expected = (0, 14, 1)
    actual = CardList.cardIndexToSuitWithScorePlayerID(1, 1)
    self.assertEqual(expected, actual)

    expected = (0, 13, 1)
    actual = CardList.cardIndexToSuitWithScorePlayerID(13, 1)
    self.assertEqual(expected, actual)

    expected = (2, 13, 2)
    actual = CardList.cardIndexToSuitWithScorePlayerID(39, 2)
    self.assertEqual(expected, actual)

  def test_max(self):
    cl = CardList()
    cl.push(1, 0)
    cl.push(13, 1)
    cl.push(19, 2)
    cl.push(41, 3)
    expected = 0
    self.assertEqual(expected, cl.max())

class TestPlayerQueue(unittest.TestCase):
  def test_next(self):
    pq = PlayerQueue({1:'a', 2:'b', 3:'c', 4:'d'})
    self.assertEqual(1, pq.next())
    self.assertEqual(2, pq.next())
    self.assertEqual(3, pq.next())
    self.assertEqual(4, pq.next())
    self.assertEqual(1, pq.next())
    
  def test_setFirst(self):
    pq = PlayerQueue({1:'a', 2:'b', 3:'c', 4:'d'})
    pq.setFirst(3)
    self.assertEqual(3, pq.next())




class TestPlayer(unittest.TestCase):
  def test_discard(self):
    player = Player([3,4,5,6,7,8,9,10,11,12,13,14,15])
    player.discard(3)
    with self.assertRaises(GameError) as e:
      self.assertRaises(GameError, player.discard(3))
    with self.assertRaises(GameError) as e:
      self.assertRaises(GameError, player.discard(21))


# Mock 
class MockDealer(Dealer):
  def __init__(self):
    self.currentTurnPlayer = None
    self.players = None
    self._Dealer__tmpCounter = 0
    self.deal()
    self.playerQueue = PlayerQueue(self.players)
    self.determineFirstTurnPlayer()
    self.currentTurnCards = CardList()
    
  def deal(self):
    player1 = Player([5, 11, 13, 19, 25, 26, 30, 31, 32, 33, 41, 44, 52])
    player2 = Player([6, 10, 16, 17, 23, 24, 27, 28, 35, 37, 45, 50, 51])
    player3 = Player([4,  9, 12, 14, 18, 20, 22, 29, 34, 38, 40, 42, 47])
    player4 = Player([1,  2,  3,  7,  8, 15, 21, 36, 39, 43, 46, 48, 49])
    self.players = {
        player1.identity : player1
      , player2.identity : player2
      , player3.identity : player3
      , player4.identity : player4
      }


    
    
    
if __name__ == "__main__":
  unittest.main()
