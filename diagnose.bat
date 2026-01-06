@echo off
git status --no-pager > git_info.txt
git log -1 --no-pager >> git_info.txt
git remote -v >> git_info.txt
exit
