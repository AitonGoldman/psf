cursor = db.challengeuserlogins.find();
while ( cursor.hasNext() ) {
    printjson( cursor.next() );
}

