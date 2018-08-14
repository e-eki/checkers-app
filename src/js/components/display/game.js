

  self.addEventListener('message', function(e) {
    //console.log('Posting message back to main script');
    self.postMessage(e.data);
  }, false);