// Table structure
// Position - Player - Today - Thru - Total - R1 - R2 - R3 - Total
// 1        - Dale   - -2    -  13   - -10   - 70 - 66 - 50 - 186
// 2        - Wills   - -1   -  13   - -9   - 70 - 66 - 51 - 187

// Grab each player id
let playersNameAndId = db
    .collection('players')
    .get()
    .then(querySnapshot => {
        querySnapshot.forEach(doc => console.log(doc.id, ' => ', doc.data()));
    });
// Import all player data using id
// Insert data into table
// Sort by TOTAL
