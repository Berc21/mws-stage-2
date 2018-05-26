import  {fetchNeighborhoods, fetchCuisines, updateRestaurants} from './js/main'
import { initSW } from './js/sw';


/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  fetchNeighborhoods();
  fetchCuisines();
  initSW();
});

document.getElementById('cuisines-select').addEventListener('change', function(){
  updateRestaurants();
});

document.getElementById('neighborhoods-select').addEventListener('change', function(){
  updateRestaurants();
});
