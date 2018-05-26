import  {fetchRestaurantFromURL, fillBreadcrumb, addMapMakers} from './js/restaurant_info'
import { initSW } from './js/sw';


/**
 * Initialize Google map, called from HTML.
 */

 document.addEventListener('DOMContentLoaded', (event) => {
    window.initMap = () => {
        fetchRestaurantFromURL((error, restaurant) => {
          if (error) { // Got an error!
            console.error(error);
          } else {
            self.map = new google.maps.Map(document.getElementById('map'), {
              zoom: 16,
              center: restaurant.latlng,
              scrollwheel: false
            });
            fillBreadcrumb();
            addMapMakers();
          }
        });
      }

    initSW();
    
 });

