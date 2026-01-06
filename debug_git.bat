@echo off
echo START > debug.txt
where git >> debug.txt 2>&1
echo --- >> debug.txt
git --version >> debug.txt 2>&1
echo --- >> debug.txt
git init >> debug.txt 2>&1
echo --- >> debug.txt
dir /a >> debug.txt 2>&1
echo END >> debug.txt
exit
