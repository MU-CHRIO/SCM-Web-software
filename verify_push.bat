@echo off
git status --no-pager > verify.txt
echo --- >> verify.txt
git branch -vv --no-pager >> verify.txt
