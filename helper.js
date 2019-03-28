'use strict';

const giList = require('./list.json');
const config = require('./config.json');

var prefix = config.GI_PREFIX;

module.exports = {
  list: function (vid) {
    return list(vid);
  },
  parseMsg: function (msg) {
    return parseMsg(msg);
  }
}

var list = function (vid) {
  if(typeof vid === 'undefined')
    return getMetaList();
  else
    return getIndList(vid);
}

var parseMsg = function (msg) {
  return ['Kadacha', {'files': ["https://i.imgur.com/TRq0XSz.jpg"]}]
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
  }
  else {
    string += "```\n";
    for(var vidKey in giList[vid]) {
      string += giList[vid][vidKey][0] + "\n";
    }
    string += "```\n"
            + "You don't need to type out whole command. That is, the characters between the brackets are optional\n"
            + "For example, if you want sticker of `巧[克力]`.\n"
            + "`" + prefix + "巧克力` can be shorten to: " + "`" +prefix + "巧`\n"
            + "And the following works too:\n"
            + "`" + prefix + "巧克`\n"
            + "`" + prefix + "巧克力`\n";
  }
  return string;
}


