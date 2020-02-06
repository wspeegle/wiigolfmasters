function getData(collection, callback)
{
    var db = firebase.firestore();
    db.collection(collection).get().then(function(querySnapshot) {
        callback(querySnapshot);
    }).catch(function(error) {
        console.log(error.message);
    });
}