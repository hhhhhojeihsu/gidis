'use strict';

const giList = require('./list.json');
const config = require('./config.json');

const prefix = config.GI_PREFIX;
const linkPrefix = './resources/stickers/';

// Extract all content to list
var giArr = [];

for(let vidKey in giList) {
  for(let item in giList[vidKey]) {
    giArr.push([
      item,
      giList[vidKey][item][1],
      giList[vidKey][item][2],
    ]);
  }
}

giArr = giArr.sort(function (a, b) {
  return a[0].localeCompare(b[0]);
});

module.exports = {
  list: function (vid) {
    return list(vid);
  },
  parseMsg: function (msg) {
    return parseMsg(msg);
  }
}

var list = function (vid) {
  if(typeof vid === 'undefined') {
    return getMetaList();
  } else {
    return getIndList(vid);
  }
}

var parseMsg = function (msg) {
  // Filter based on first word
  var possibleArr;
  // Filter by each character
  possibleArr = giArr.filter(function (item) {
    if(msg[0] === item[0][0]) {
      return true;
    } else {
      return false;
    }
  });

  // Find matched
  for(let idxPosAr = 0; idxPosAr < possibleArr.length; ++idxPosAr) {
    // Whole match
    if(possibleArr[idxPosAr][1] === 1) {
      if(msg === possibleArr[idxPosAr][0]) {
        return ["", {'files': [linkPrefix + possibleArr[idxPosAr][0] + ".png"]}];
      } else {
        continue;
      }
    }
    if((possibleArr[idxPosAr][0].substring(0 ,possibleArr[idxPosAr][2][1]))    // Partial match
      === msg.substring(0, possibleArr[idxPosAr][2][1])) {
      return ["", {'files': [linkPrefix + possibleArr[idxPosAr][0] + ".png"]}];
    }
  }

  // Ambigious command
  return ["Cannot find the sticker you're looking for. Please DM the bot `!!list` to find the sticker you desire.", ""];
}

var getMetaList = function () {
  var string = "Use `" + prefix + "list <vid>` to list supported command\n"
             + "Supported commands:\n"
             + "```\n";
  for(var vidKey in giList) {
    string += vidKey + '\n';
  }
  // Access the first item in json for example
  for(var vidKey in giList) {
    string += "```\n"
            + "For example: `" + prefix + "list " + vidKey +  "`";
    break;
  }
  return string;
}

var getIndList = function (vid) {
  var string = "";
  if(typeof giList[vid] === 'undefined') {
    string += "Cannot find list " + vid + ". "
            + "Please use `" + prefix + "list` to show availible lists.";
    return string;
  }

  string += "```\n";
  for(var vidKey in giList[vid]) {
    string += giList[vid][vidKey][0] + "\n";
  }
  string += "```\n"
          + "You don't need to type out whole command. That is, the characters between the brackets are optional\n"
          + "For example, if you want sticker `巧[克力]`\n"
          + "`" + prefix + "巧克力` can be shorten to " + "`" +prefix + "巧`\n"
          + "And the following works too:\n"
          + "`" + prefix + "巧克`\n"
          + "`" + prefix + "巧克力`\n";
  return string;
}

