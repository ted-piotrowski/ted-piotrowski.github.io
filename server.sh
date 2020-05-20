#!/bin/bash

scp server.ts package.json sacalerts:~/vidmo
ssh -t sacalerts 'cd ~/vidmo && ./update.sh'