# -*- coding: utf-8 -*-

import sys
import re
import os.path

OUT_DIR=sys.argv[2]+'/' if len(sys.argv)==3 else '.'
FILENAME0 = os.path.basename(sys.argv[1])

re_name = re.compile(r'^\s*//!include (.+?)\s*$',)

def build(fileName):
    res = ''
    try:
        with open(fileName, 'r') as f:
            for line in f:
                m = re_name.match(line)
                if m:
                    res+=build(os.path.join(os.path.dirname(fileName), m.group(1)));
                    print m.group(1)
                else:
                    res+=line
        f.close()
    except:
        return '\n'

    return res+'\n'

# end build


res = build(sys.argv[1])

if not os.path.exists(OUT_DIR):
    os.makedirs(OUT_DIR)
with open(OUT_DIR+FILENAME0, 'w') as f:
    f.write(res)
    f.close()