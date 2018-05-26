import idb from 'idb';
/**
 * Common database helper functions.
 */
export default class DBHelper {

  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
    return 'http://localhost:1337/restaurants';
  }



  static openDatabase() {
    if (!navigator.serviceWorker) {
      return Promise.resolve();
    }

    return idb.open('restaurantDb', 1, function (upgradeDb) {
      let store = upgradeDb.createObjectStore('restaurantDb', {
        keyPath: 'id'
      });
      store.createIndex('by-id', 'id');
    });
  }

  static saveToIdb(data) {
    return DBHelper.openDatabase().then(function (db) {
      if (!db) return;

      let transaction = db.transaction('restaurantDb', 'readwrite');
      let store = transaction.objectStore('restaurantDb');
      
      data.forEach(function (restaurant) {
        store.put(restaurant);
      });
      return transaction.complete;
    });
  }

  static fetchFromServer() {
    return fetch(DBHelper.DATABASE_URL)
      .then(function (response) {
        return response.json();
      }).then(restaurants => {
        DBHelper.saveToIdb(restaurants);
        return restaurants;
      });
  }

  static fetchFromCache() {
    return DBHelper.openDatabase().then(function (db) {
      if (!db) return;

      var store = db.transaction('restaurantDb').objectStore('restaurantDb');
      return store.getAll();
    });
  }

  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants(callback) {
    return DBHelper.fetchFromCache().then(restaurants => {
        if (restaurants.length) {
          return Promise.resolve(restaurants);
        } else {
          return DBHelper.fetchFromServer();
        }
      })
      .then(restaurants => {
        callback(null, restaurants);
      })
      .catch(error => {
        callback(error, null);
      })
  }
  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        const restaurant = restaurants.find(r => r.id == id);
        if (restaurant) { // Got the restaurant
          callback(null, restaurant);
        } else { // Restaurant does not exist in the database
          callback('Restaurant does not exist', null);
        }
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants;
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood);
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i);
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type);
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i);
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    return (`/images/sm-img/${restaurant.photograph}`);
  }

  static bigImageUrlForRestaurant(restaurant) {
    return (`/images/lg-img/${restaurant.photograph}`);
  }

  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP
    });
    return marker;
  }

  static removeTabbing() {
    document.querySelectorAll('#map iframe').forEach((item) => {
      item.setAttribute('tabindex', '-1');
      // adds title attirbute
      item.setAttribute('title', 'Google Maps iframe');
    });
  }
  static addAriaTable() {
    document.querySelectorAll('#map [tabindex="0"]').forEach((item) => {
      item.setAttribute('aria-label', 'Marked restaurants');
    });
  }
}