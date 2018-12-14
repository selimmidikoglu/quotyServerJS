const express = require ('express');
const router = express.Router ();
const mongoose = require ('mongoose');
const fs = require ('fs');

let rawdata = fs.readFileSync ('quotes.json');
let quotes = JSON.parse (rawdata);
let rawdata1 = fs.readFileSync ('keywords.json');
let keywords = JSON.parse (rawdata1);

var TwoDArray = [];
var foundQuotes = [];
//there will be only one http method which is get method decided by keyword.js
router.get ('/:keyword', (req, res, next) => {
  const keyword = req.params.keyword;

  var keywordsList = keyword.split (' ');
  for (var i = keywordsList.length - 1; i >= 0; i--) {
    if (keywordsList[i] === '') {
      keywordsList.splice (i, 1);
    } else
      keywordsList[i] =
        keywordsList[i].charAt (0).toUpperCase () + keywordsList[i].slice (1);
  }

  for (var j = 0; j < keywordsList.length; j++) {
    TwoDArray = TwoDArray.concat (keywords[`${keywordsList[j]}`]);
  }

  TwoDArray.sort ();
  var count = 0;
  for (let index = 0; index < TwoDArray.length; index++) {
    count = 0;
    for (let i = 0; i < keywordsList.length - 1; i++) {
      if (TwoDArray[index + i] == TwoDArray[index + i + 1]) {
        count++;
      }
    }

    if (count == keywordsList.length - 1) {
      foundQuotes.push (TwoDArray[index]);
      index = index + keywordsList.length - 1;
    }
  }
  if (foundQuotes.length == 0) {
    keywordsList = [];
    TwoDArray = [];
    foundQuotes = [];
    res.status (500).json ({
      message: 'Quote can not be found with given keywords!',
    });
  } else {
    const randomer = Math.floor (Math.random () * foundQuotes.length);

    const quote = quotes[foundQuotes[randomer]];

    keywordsList = [];
    TwoDArray = [];
    foundQuotes = [];
    res.status (200).json ({
      author: quote.author,
      quote: quote.quote,
      id: quote.id,
    });
  }
});
router.get ('/', (req, res, next) => {
  res.status (200).json ({
    message: 'nice root',
  });
});
module.exports = router;
