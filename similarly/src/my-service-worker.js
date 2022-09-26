importScripts('./ngsw-worker.js')
self.addEventListener('push', (event) => {
  console.log('push notification received', event);
  let data = { title: 'Test', content: 'Fallback message'};
  if(event.data){
    data = JSON.parse(event.data.text());
  }

  let options = {
    body: data.content
  }

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});
