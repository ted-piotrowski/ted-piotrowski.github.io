#!/bin/bash

scp server.ts package.json sacalerts:~/moonlite
ssh -t sacalerts 'cd ~/moonlite && ./update.sh'
