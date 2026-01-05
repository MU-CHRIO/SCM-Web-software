#!/usr/bin/env bash
set -euo pipefail
BASE=http://localhost:5000
TS=$(date +%s)
ADMIN=admin_${TS}
FAC=faculty_${TS}
STU=student_${TS}
PW=pass123
# register users
curl -sS -H 'Content-Type: application/json' -d "{\"name\":\"$ADMIN\",\"password\":\"$PW\",\"role\":\"admin\"}" $BASE/api/auth/register | jq -c .
curl -sS -H 'Content-Type: application/json' -d "{\"name\":\"$FAC\",\"password\":\"$PW\",\"role\":\"faculty\"}" $BASE/api/auth/register | jq -c .
curl -sS -H 'Content-Type: application/json' -d "{\"name\":\"$STU\",\"password\":\"$PW\",\"role\":\"student\"}" $BASE/api/auth/register | jq -c .
# get ids
FAC_ID=$(curl -sS -H 'Content-Type: application/json' -d "{\"name\":\"$FAC\",\"password\":\"$PW\"}" $BASE/api/auth/login | jq -r .id)
STU_ID=$(curl -sS -H 'Content-Type: application/json' -d "{\"name\":\"$STU\",\"password\":\"$PW\"}" $BASE/api/auth/login | jq -r .id)
# admin creates club
CLUB_ID=$(curl -sS -H 'Content-Type: application/json' -d "{\"name\":\"Club_${TS}\",\"description\":\"desc\",\"created_by\":$FAC_ID}" $BASE/api/clubs | jq -r .id)
# student tries to create club (should fail)
curl -sS -H 'Content-Type: application/json' -d "{\"name\":\"ClubBad_${TS}\",\"description\":\"desc\",\"created_by\":$STU_ID}" $BASE/api/clubs -w '\n%{http_code}\n'
# admin creates event linked to club
EVENT_ID=$(curl -sS -H 'Content-Type: application/json' -d "{\"title\":\"Event_${TS}\",\"description\":\"ev\",\"club_id\":$CLUB_ID,\"created_by\":$FAC_ID}" $BASE/api/events | jq -r .id)
# student joins club and event
curl -sS -H 'Content-Type: application/json' -d "{\"user_id\":$STU_ID}" $BASE/api/clubs/$CLUB_ID/join | jq -c .
curl -sS -H 'Content-Type: application/json' -d "{\"user_id\":$STU_ID}" $BASE/api/events/$EVENT_ID/join | jq -c .
# verify membership
curl -sS $BASE/api/clubs/$CLUB_ID/members | jq -c .
curl -sS $BASE/api/events/$EVENT_ID/participants | jq -c .
echo "E2E clubs/events OK"
