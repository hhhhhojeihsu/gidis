#!/usr/bin/env python3

import json

with open('list.json') as json_f:
    list_json = json.load(json_f)

sticker_array = list()

for chapter in list_json['Chapters']:
    for sticker in list_json[chapter]:
        if sticker[1]:
            sticker_array.append(sticker[0])
        else:
            sticker_name = sticker[0][sticker[2][0]:sticker[2][1]] + "[" + sticker[0][sticker[2][1]:] + "]"
            sticker_array.append(sticker_name)

sticker_array.sort()

for sticker in sticker_array:
    print(sticker)
