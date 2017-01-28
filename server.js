'use strict'

// Running through first time with no comments. forgive me.

const express = require('express')
const got = require("got")
const parseString = require('xml2js').parseString

var searchURL = "https://boardgamegeek.com/xmlapi/search?exact=1&search=";
var app = express()
var port = process.env.PORT || 3000

app.get('/search', function (req, res) {
  var thisSearch = searchURL + req.query.search

  got(thisSearch)
      .then(response => {
          var xml = response.body
          parseString(xml, function (err, json) {
              var gameID = Number(json.boardgames.boardgame[0].$.objectid);
              var gameLink = "https://boardgamegeek.com/game/"+gameID
              console.log(gameLink);

              res.send("<a href='${gameLink}'>${thisSearch}</a>")
          })
      })
      .catch(error => {
          console.log(error.response.body);
      });            
})

// start http server
app.listen(port, (err) => {
  if (err) {
    return console.error(err)
  }

  console.log(`Listening on port ${port}`)
})
