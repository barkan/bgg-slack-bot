// Running through first time with no comments. forgive me.

var express = require('express')
var got = require("got")
var parseString = require('xml2js').parseString

var searchURL = "https://boardgamegeek.com/xmlapi/search?exact=1&search=";
var app = express()
var port = process.env.PORT || 3000

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, command, text");
  next();
});

app.post('/slack/command', function (req, res) {
  console.log(req.body);
  return;

 var thisSearch = searchURL + req.headers["text"];

  got(thisSearch)
      .then(response => {
          var xml = response.body
          parseString(xml, function (err, json) {
              var gameID = Number(json.boardgames.boardgame[0].$.objectid);
              var gameName = json.boardgames.boardgame[0].name[0]._ ;
              var gameLink = "https://boardgamegeek.com/game/"+gameID

              var linkResponse = {
                 "response_type": "in_channel",
                 "text": "*" + gameName +":* " + gameLink
              }

              res.send(linkResponse);
          })
      })
      .catch(error => {
          console.log(error);
      });            
})

// start http server
app.listen(port, (err) => {
  if (err) {
    return console.error(err)
  }

  console.log(`Listening on port ${port}`)
})
