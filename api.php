<?php
  // required headers
  header("Access-Control-Allow-Origin: *");
  header("Content-Type: application/json; charset=UTF-8");
  header("Access-Control-Allow-Methods: GET");
  header("Access-Control-Max-Age: 3600");
  header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

  echo json_encode(array("cards" => initDeck()));

  function initDeck() {
    $spades = initCards('S');
    $hearts = initCards('H');
    $clubs = initCards('C');
    $diamonds = initCards('D');

    $cards = array_merge($spades, $hearts, $clubs, $diamonds);
    shuffle($cards);
    return $cards;
  }

  function convertToNumbersSuit($suit, $numbers) {
    for($n = 0; $n < count($numbers); $n++) {
      $numbers[$n] = $suit . '-' . $numbers[$n];
    }
    return $numbers;
  }

  function initCards($suit) {
    $numbers = range(2, 9);
    $cards = array_merge(['A'] , $numbers, ['X', 'J', 'Q', 'K']);
    $cards = convertToNumbersSuit($suit, $cards);
    return $cards;
  }
?>