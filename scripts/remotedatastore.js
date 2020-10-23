(function (window) {
    'use strict';
    var App = window.App || {};
    var $ = window.jQuery;

    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
      apiKey: "AIzaSyA_nQoMJCo9y5EIL5ekHqLdxK7-bHpU6eM",
      authDomain: "coffeerunfirebase-a1f1a.firebaseapp.com",
      databaseURL: "https://coffeerunfirebase-a1f1a.firebaseio.com",
      projectId: "coffeerunfirebase-a1f1a",
      storageBucket: "coffeerunfirebase-a1f1a.appspot.com",
      messagingSenderId: "961026582036",
      appId: "1:961026582036:web:57513cdd8c15e3ffe9a901",
      measurementId: "G-4PHJJSMB6X"
    };

    firebase.initializeApp(firebaseConfig);
    firebase.analytics();

    function RemoteDataStore(url) {
      if (!url) {
        throw new Error('No remote URL supplied.');
      }

      this.serverUrl = url;
    }

    // RemoteDataStore.prototype.add = function (key, val) {
    //     $.post(this.serverUrl, val, function (serverResponse) {
    //         console.log(serverResponse);
    //     });
    // };

    RemoteDataStore.prototype.add = function (data) {
      var collection = firebase.firestore().collection('coffeeorders');
      return collection.add(data);
    };

    // RemoteDataStore.prototype.getAll = function (cb) {
    //     $.get(this.serverUrl, function (serverResponse) {
    //         console.log(serverResponse);
    //     });
    //     cb(serverResponse);
    // };

    RemoteDataStore.prototype.getAll = function (renderer) {
      var query = firebase.firestore()
          .collection('cofeeorders')
          .orderBy('coffee')
          .limit(50);
  
      this.getDocumentsInQuery(query, renderer);
    };

    RemoteDataStore.prototype.getDocumentsInQuery = function (query, renderer) {
      query.onSnapshot(function (snapshot) {
        if (!snapshot.size) return renderer.empty(); // Display "There are no coffees".
    
        snapshot.docChanges().forEach(function (change) {
          if (change.type === 'removed') {
            renderer.remove(change.doc);
          } else {
            renderer.display(change.doc);
          }
        });
      });
    };

    // RemoteDataStore.prototype.get = function (key, cb) {
    //     $.get(this.serverUrl + '/' + key, function (serverResponse) {
    //       console.log(serverResponse);
    //       cb(serverResponse);
    //     });
    // };

    RemoteDataStore.prototype.get = function (key) {
      return firebase.firestore().collection('coffeeorders').doc(key).get();
    };

    // RemoteDataStore.prototype.remove = function (key) {
    //     $.ajax(this.serverUrl + '/' + key, {
    //       type: 'DELETE'
    //     });
    // };

    RemoteDataStore.prototype.remove = function (key) {
      // key = email address
      console.log(key);
      var collection = firestore.collection('coffeeorders');
      var query = collection.where("emailAddress", "==", key);
      query.get().then(function (querySnapshot) {
          querySnapshot.forEach(function(doc) {
              doc.ref.delete();
              console.log("order delted");
          });
      }).catch(function(error) {
          console.log("error retrieving object");
      });
    };

    App.RemoteDataStore = RemoteDataStore;
    window.App = App;

})(window);