'use strict';

const giList = require('./list.json');
const config = require('./config.json');
const Fuse = require('fuse.js')

const prefix = config.GI_PREFIX;
const linkPrefix = './resources/stickers/';
const soundPrefix = './resources/audio/';

const ambigious = "Cannot find the sticker you're looking for. Please DM the bot `!!list` to find the sticker you desire.";

// Extract all content to list
var giChapters = giList["Chapters"];
var giArr = [];

for(let chapterIdx in giChapters) {
  var chapter = giList[giChapters[chapterIdx]];
  for(let itemIdx in chapter) {
    giArr.push(
      {
        'name': chapter[itemIdx][0],
        'fuzzy': chapter[itemIdx][1],
        'required_range': chapter[itemIdx][2],
        'chapter': giChapters[chapterIdx]
      });
  }
}

module.exports = {
  ambigious: ambigious,
  list: function (vid) {
    return list(vid);
  },
  parseMsg: function (msg) {
    return parseMsg(msg);
  },
  fuzzyResult: function (input) {
    return fuzzyResult(input);
  },
  getStickerPath: function (sticker_name) {
    return getStickerPath(sticker_name);
  },
  getChapters: function (include_meta) {
    return getChapters(include_meta);
  },
  getSoundPath: function(sticker_name) {
    return getSoundPath(sticker_name);
  }
}

var list = function (vid) {
  if(typeof vid === 'undefined' ||
     vid == null ||
     vid.length === 0) {
    return getMetaList();
  } else {
    return getIndList(vid);
  }
}

var parseMsg = function (msg) {
  // Filter by each character
  var possibleArr = giArr.filter(function (item) {
    if(msg[0] === item['name'][0]) {
      return true;
    } else {
      return false;
    }
  });

  // Find matched
  for(let idxPosAr = 0; idxPosAr < possibleArr.length; ++idxPosAr) {
    var item = possibleArr[idxPosAr];
    // Whole match
    if(item['fuzzy'] === 1) {
      if(msg === item['name']) {
        return {'files': [linkPrefix + item['chapter'] + "/" + item['name'] + ".png"]};
      } else {
        continue;
      }
    }
    if((item['name'].substring(item['required_range'][0] ,item['required_range'][1]))    // Partial match
      === msg.substring(item['required_range'][0], item['required_range'][1])) {
      return {'files': [linkPrefix + item['chapter'] + "/" + item['name'] + ".png"]};
    }
  }

  return ambigious;
}

var getMetaList = function () {
  var string = "Use `" + prefix + "list <vid>` to list supported command\n"
             + "Supported commands:\n"
             + "```\n";
  for(var chapterIdx in giChapters) {
    string += giChapters[chapterIdx] + '\n';
  }
  // Access the first item in json for example
  for(var chapterIdx in giChapters) {
    string += "```\n"
            + "For example: `" + prefix + "list " + giChapters[chapterIdx] +  "`";
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
    if(giList[vid][vidKey][1]) {
      string += giList[vid][vidKey][0] + "\n";
    } else {
      var optional_str =
        giList[vid][vidKey][0].substring(0, giList[vid][vidKey][2][1]) +
        "[" +
        giList[vid][vidKey][0].substring(giList[vid][vidKey][2][1]) +
        "]"

      string += optional_str + "\n";
    }
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

var fuzzyResult = function (input) {
  const fuse = new Fuse(giArr, {
    keys: ['name']
  });
  const fuzzy_result = fuse.search(input, {limit: 10});

  var result = [];
  for(let item_idx in fuzzy_result) {
    var chapter = fuzzy_result[item_idx]['item']['chapter'];
    var value = fuzzy_result[item_idx]['item']['name'];
    result.push({'name': chapter + '/' + value, 'value': value});
  }
  return result;
}

var getStickerPath = function (sticker_name) {
  var possibleArr = giArr.filter(function (item) {
    if(sticker_name === item['name']) {
      return true;
    } else {
      return false;
    }
  });

  if (possibleArr.length == 1) {
    return {'files': [linkPrefix + possibleArr[0]['chapter'] + "/" + possibleArr[0]['name'] + ".png"]};
  } else {
    return "";
  }
}

var getChapters = function (include_meta) {
  var giChapters = giList["Chapters"];
  var arr = []
  if (include_meta) {
    arr.push({'name': 'meta', 'value': 'meta'});
  }
  for (let chapterIdx in giChapters) {
    arr.push({'name': giChapters[chapterIdx], 'value': giChapters[chapterIdx]});
  }
  return arr;
}

var getSoundPath = function (sticker_name) {
  var possibleArr = giArr.filter(function (item) {
    if(sticker_name === item['name']) {
      return true;
    } else {
      return false;
    }
  });

  if (possibleArr.length == 1) {
    return soundPrefix + possibleArr[0]['chapter'] + "/" + possibleArr[0]['name'] + ".ogg";
  } else {
    return "";
  }
}
