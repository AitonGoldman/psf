#Keep track of
* Shit - for Mockgoose, need to do the following (or just install ubuntu 14)
** need to git clone mongodb-download - modify it to allow for ubuntu 15
** need to git clone mongodb-prebuilt and make it use our modified mongodb-download
** need to git clone mockgoose and make it use our modified mongodb-prebuilt
** need to npm install our modified mockgoose 
** had to install newest mongodb manully ( see mongodb ubuntu install instructions )
** had to copy it to mockoose/mongodb-prebuilt/blah/blah/blah
** can we just point mongodb-prebuilt to installed binaries?

* Need to run tests as root ( sudo )
* Need to make sure mongodb is running ( no service with community mongodb )

* secrets file

```
module.exports = {
    'google_account_password' : '<password>',
    'cookie_secret':'<cookiesecret>',
    'password_generator_list' : [
      '<possiblepasswordfragment>'
    ]
  }
```

# Model - overview
These are the logical groupings for models/collections 
* User Login info - done
* User Statistics/Info/Settings
* Score - done
* Machine List
* Objects shared between two people (i.e. challenge list)

# REST
## /user
* POST - create new user - done
## /user/<userid>
* GET - get logged in user info 
## /user/<userid>/email
* PUT - updating email
## /user/<userid>/displayname
* PUT - updating displayname
## /score
* POST - add a score
## /score/<userid>
* GET - get most recent score for player
## /scores/<userid>
* GET - get all scores for player
## /score/<userid>/<userid>
* GET - get most recent score for 2 players

Todo
----
* add tests for all rest calls
* login
* change scores to allow for challenges
* get list of challenges
* update match - set challenge bit and/or winner
* authorization needed for certain REST calls
* add ability for both players to "approve" match
* badges
* settings

# REST - /user
## returned json
** login_info
*** login name 
*** display name
*** email address
*** region
** user_info_match_results
*** wins (calculate)
*** losses (calculate)
*** points (or record in score info?)
** badges
** settings
