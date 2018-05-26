// service worker
export function initSW() {
  if ('serviceWorker' in navigator) {

    window.addEventListener('load', function () {
      navigator.serviceWorker
        .register('/sw.js', {
          scope: '/'
        })
        .then(function (registration) {
          // If registration is successful
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }).catch(function (err) {
          //If registration is failed :(
          console.log('ServiceWorker registration failed:', err);
        });
    });
  }

}