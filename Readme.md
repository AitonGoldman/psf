#Keep track of
* Shit - for Mockgoose, need to
** need to git clone mongodb-download - modify it to allow for ubuntu 15
** need to git clone mongodb-prebuilt and make it use our modified mongodb-download
** need to git clone mockgoose and make it use our modified mongodb-prebuilt
** need to npm install our modified mockgoose 
** had to install newest mongodb manully ( see mongodb ubuntu install instructions )
** had to copy it to mockoose/mongodb-prebuilt/blah/blah/blah
** can we just point mongodb-prebuilt to installed binaries?

* Need to run tests as root ( sudo )
* Need to make sure mongodb is running ( no service with community mongodb )

# Model
These are the logical groupings for models/collections 
* User Login info
* User Statistics/Info/Settings
* Score
* Machine List
* Objects shared between two people (i.e. challenge list)

## Score - done
* design model
** score date
** winner_id
** machine played on
*** sub doc - player_id
*** sub doc - player_name
*** sub doc - win/lose
*** sub doc - losses (after match)
*** sub doc - wins (after match)
*** sub doc - player points ( after match )

## User Login Info Model
* Use passport login model - done
* Add validators on model - done
* Add mocha tests on model - done
* Add mocked tests on model - done
* Add controller tests - done

## REST for user
* create new user - done
* get user info - see User Statistics/Info/Settings
* get list of users (with limited info)

## REST User Statistics/Info/Settings
* save new user - done
* get user info
** login_info
*** login name 
*** display name
*** email address
*** region
** user_info_match_results
*** wins (calculate)
*** losses (calculate)
*** rank (calculate)
*** matches played (calculate)
*** points (or record in score info?)
** badges
** settings
