#!/usr/bin/env sh
if [ "$HUSKY" = "0" ]; then
  exit 0
fi

if [ -f ~/.huskyrc ]; then
  . ~/.huskyrc
fi

set -e
