curl --cookie /tmp/cookie_jar --cookie-jar /tmp/cookie_jar -X POST -d 'username=mememe&password=hithere' http://localhost:3000/login
curl -v --cookie /tmp/cookie_jar2 --cookie-jar /tmp/cookie_jar http://localhost:3000/user
