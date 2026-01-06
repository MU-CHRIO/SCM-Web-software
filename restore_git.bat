@echo off
echo STARTING > restore_log.txt
git remote add origin git@github.com:MU-CHRIO/SCM-Web-software.git >> restore_log.txt 2>&1
echo REMOTE_ADD_ATTEMPTED >> restore_log.txt
git fetch origin >> restore_log.txt 2>&1
echo FETCH_ATTEMPTED >> restore_log.txt

git checkout -b main >> restore_log.txt 2>&1
rem Try to reset to remote state but keep files
git reset --mixed origin/main >> restore_log.txt 2>&1

git add . >> restore_log.txt 2>&1
git commit -m "Subhan's files" >> restore_log.txt 2>&1
echo COMMITTED >> restore_log.txt

git push -u origin main >> restore_log.txt 2>&1
echo PUSHED >> restore_log.txt
exit
