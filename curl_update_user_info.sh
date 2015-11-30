export USER_1=`curl -H "Content-Type: application/json" -X PUT -d '{"email":"me2229@me.com"}' http://localhost:3000/user/$USER_ID/email`
echo $USER_1
export USER_1=`curl -H "Content-Type: application/json" -X PUT -d '' http://localhost:3000/user/$USER_ID/email`
echo $USER_1
export USER_1=`curl -H "Content-Type: application/json" -X PUT -d '{"displayName":"me2223@me.com"}' http://localhost:3000/user/$USER_ID/displayname`
echo $USER_1
export USER_1=`curl -H "Content-Type: application/json" -X PUT -d '' http://localhost:3000/user/$USER_ID/displayname`
echo $USER_1
