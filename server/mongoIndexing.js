// create indexing on mongo
Student.rawCollection().createIndex({ certno: 1 });
Student.rawCollection().createIndex({ examTime: 1 });
Student.rawCollection().createIndex({ edited: 1 });
