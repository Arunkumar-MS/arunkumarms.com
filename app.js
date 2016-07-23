
if ('serviceWorker' in navigator) {
  let sw = '/arunkumarms.com/sw.js';
  navigator.serviceWorker.register(sw , { scope: '/arunkumarms.com/stylesheets/' }).then(function(reg) {
    
    if(reg.installing) {
      console.log('Service worker installing');
    } else if(reg.waiting) {
      console.log('Service worker installed');
    } else if(reg.active) {
      console.log('Service worker active');
    }
    
  }).catch(function(error) {
    // registration failed
    console.log('Registration failed with ' + error);
  });
}; 
