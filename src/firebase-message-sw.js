import {getMessaging, getToken} from 'firebase/messaging';

console.log('blahhhhhhhhhhhhhhh');
// Get registration token. Initially this makes a network call, once retrieved
// subsequent calls to getToken will return from cache.
const messaging = getMessaging();
getToken(messaging, {
  vapidKey:
    'BBQhTsEjC-MEKQ098ERpix-smOvSMBITBSdopupTpe9pZ4F5TajnwfpCCpjblfRLbkmhcSzSbI_3KO1F1lv_K40',
})
  .then((currentToken) => {
    if (currentToken) {
      console.log('currentToken', currentToken);
      // Send the token to your server and update the UI if necessary
      // ...
    } else {
      // Show permission request UI
      console.log(
        'No registration token available. Request permission to generate one.',
      );
      // ...
    }
  })
  .catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
    // ...
  });
