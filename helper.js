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
    return vid;
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

