const KEYAKI_GREEN = 0xa0d468;
const Discord = require("discord.js");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const NBA_LOGOS = {
  'ATLANTA' : '509821851636072478',
  'BOSTON' : '509821852890169353',
  'BROOKLYN' : '509830148808245264',
  'CHICAGO' : '509821851669757952',
  'CLEVELAND' : '509830148644929547',
  'DALLAS' : '509821852558950450',
  'DENVER' : '509821852433252352',
  'DETROIT' : '509821851900313613',
  'GOLDEN STATE' : '509821852600762408',
  'HOUSTON' : '509830148733009930',
  'INDIANA' : '509821852336652289',
  'LA CLIPPERS' : '509821852189982743',
  'LA LAKERS' : '509821852244508673',
  'MEMPHIS' : '509830148443340852',
  'MIAMI' : '509830149076680704',
  'MILWAUKEE' : '509821852550692884',
  'MINNESOTA' : '509830148988600346',
  'NEW ORLEANS' : '509821852500361216',
  'NEW YORK' : '509821852416344124',
  'OKLAHOMA CITY' : '509830148812439553',
  'ORLANDO' : '509821852009627649',
  'PHOENIX' : '509821852428926996',
  'PORTLAND' : '509830148892131348',
  'SACRAMENTO' : '509821851900313638',
  'SAN ANTONIO' : '509830148808376326',
  'TORONTO' : '509821852156166147',
  'UTAH' : '509821851933999114',
  'WASHINGTON' : '509830148657381407'
};

function getFries(bot, channel) {
  JSDOM.fromURL("https://www.thescore.com/nba/teams/5", { includeNodeLocations:'true', runScripts: "outside-only" }).then(dom => {
    var link = "https://www.thescore.com" + dom.window.document.querySelectorAll(".TeamMiniSchedule__eventCard--140-Y span span a")[0].getAttribute("href");
    //checks if game is live or not, if live; parse live game for CURRENT 3 stat.
    var live = dom.window.document.querySelectorAll(".LiveNowChip__liveNowText--1kGXv");
    if (live.length>0) {
      //parse for the current quarter and time
      var time = dom.window.document.querySelectorAll(".EventCard__clockColumn--3lEPz")[0].innerHTML;
      dom.window.close();
      JSDOM.fromURL(link, {includeNodeLocations: 'true', runScripts: "outside-only"}).then(dom => {
        var teams = dom.window.document.querySelectorAll(".Matchup__teamName--vqpde");
        for (i=0;i<teams.length;i++) {
          //checks to see if Toronto is left side or right side and who the away team is.
          if(teams[i].innerHTML === "Toronto") {
            if(i === 0) {
              var away = teams[1].innerHTML;
              var threes = dom.window.document.querySelectorAll(".StatBar__seasonStatInfo--5taTS, .StatBar__team2StatInfo--1_8Nm")[1].innerHTML;
              dom.window.close();
            } else {
              var away = teams[0].innerHTML;
              var threes = dom.window.document.getElementsByClassName("StatBar__team1StatInfo--l0wea")[1].innerHTML;
              dom.window.close();
            }
          }
        }
        return channel.send({embed: {
          color: KEYAKI_GREEN,
          description: "THERE IS CURRENTLY A GAME GOING ON AGAINST **" + away.toUpperCase() + "**. \nWE ARE CURRENTLY AT **" + threes + "** THREES RIGHT NOW."
        }});
      })
    } else {
      //parse for the date and time for the next Raptors game.
      var date = dom.window.document.querySelectorAll(".TeamMiniSchedule__header--2G7Fq, .TeamMiniSchedule__nextGameHeader--ogTJZ")[0].innerHTML.split(">")[3];
      var next_game = dom.window.document.querySelectorAll(".TeamMiniSchedule__header--2G7Fq, .TeamMiniSchedule__nextGameHeader--ogTJZ")[1].innerHTML.split(">")[3].split(" ");
      var next_time = dom.window.document.querySelectorAll(".EventCard__clockColumn--3lEPz")[1].innerHTML;
      var next_link = "https://www.thescore.com" + dom.window.document.querySelectorAll(".TeamMiniSchedule__eventCard--140-Y span span a")[1].getAttribute("href");
      dom.window.close();
      //cleans up the string so it matches the date format.
      next_game[1] = next_game[1].slice(0,3);
      next_game.push("2019");
      let todayDate = new Date();
      let today = todayDate.getDate();
      if ((parseInt(date.split(" ")[2]) === 30 && today === 1) || (parseInt(date.split(" ")[2]) === 31 && today === 1) || (parseInt(date.split(" ")[2]) === 28 && today === 1) || (parseInt(date.split(" ")[2]) === today-1)) {
        JSDOM.fromURL(link, {includeNodeLocations: 'true', runScripts: "outside-only"}).then(dom => {
          var teams = dom.window.document.querySelectorAll(".Matchup__teamName--vqpde");
          for (i=0;i<teams.length;i++) {
            //again, checks to see if Toronto is home or away.
            if(teams[i].innerHTML === "Toronto") {
              if(i === 0) {
                var away = teams[1].innerHTML;
                var threes = dom.window.document.querySelectorAll(".StatBar__seasonStatInfo--5taTS, .StatBar__team2StatInfo--1_8Nm")[1].innerHTML;
                var string = bot.emojis.get(NBA_LOGOS['TORONTO']) + " @ " + bot.emojis.get(NBA_LOGOS[away.toUpperCase()]);
                dom.window.close();
              } else {
                var away = teams[0].innerHTML;
                var threes = dom.window.document.getElementsByClassName("StatBar__team1StatInfo--l0wea")[1].innerHTML;
                var string = bot.emojis.get(NBA_LOGOS[away.toUpperCase()]) + " @ " + bot.emojis.get(NBA_LOGOS['TORONTO']);
                dom.window.close();
              }
            }
          }
          if (threes.split('/')[0] >= 12) {
            return channel.send({embed: {
              color: KEYAKI_GREEN,
              description: "TODAY IS: **" + todayDate.toDateString().toUpperCase() + "**, AND YES WE GOT FRIES: **" + threes + "**\nNEXT GAME: **" + string + " - " + next_game.join(" ") + ", " + next_time + " EST**."
            }});
          } else {
            return channel.send({embed: {
              color: KEYAKI_GREEN,
              description: "TODAY IS: **" + todayDate.toDateString().toUpperCase() + "**, AND NO WE DID NOT GET FRIES: **" + threes + "**\nNEXT GAME: **" + string + " - " + next_game.join(" ") + ", " + next_time + " EST**."
            }});
          }
        })
      } else {
        JSDOM.fromURL(next_link, {includeNodeLocations: 'true', runScripts: "outside-only"}).then(dom => {
          var teams = dom.window.document.querySelectorAll(".Matchup__teamName--vqpde");
          for (i=0;i<teams.length;i++) {
            //again, checks to see if Toronto is home or away.
            if(teams[i].innerHTML === "Toronto") {
              if(i === 0) {
                var away = teams[1].innerHTML;
                dom.window.close();
                return channel.send({embed: {
                  color: KEYAKI_GREEN,
                  description: "TODAY IS: **" + todayDate.toDateString().toUpperCase() + "**, AND THERE WAS NO GAME YESTERDAY. \nNEXT GAME: **" + bot.emojis.get(NBA_LOGOS['TORONTO']) + " @ " + bot.emojis.get(NBA_LOGOS[away.toUpperCase()]) + " - " + next_game.join(" ") + ", " + next_time + " EST**."
                }});
              } else {
                var away = teams[0].innerHTML;
                dom.window.close();
                return channel.send({embed: {
                  color: KEYAKI_GREEN,
                  description: "TODAY IS: **" + todayDate.toDateString().toUpperCase() + "**, AND THERE WAS NO GAME YESTERDAY. \nNEXT GAME: **" + bot.emojis.get(NBA_LOGOS[away.toUpperCase()]) + " @ " + bot.emojis.get(NBA_LOGOS['TORONTO']) + " - " + next_game.join(" ") + ", " + next_time + " EST**."
                }});
              }
            }
          }
        })
      }
    }
  })
}

module.exports.getFries = getFries;
