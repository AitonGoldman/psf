cursor = db.challengescores.find();
while ( cursor.hasNext() ) {
    printjson( cursor.next() );
}

