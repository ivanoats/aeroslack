function ready(fn) {
  if (document.readyState != 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(function() {
   document.getElementById('slack')
     .addEventListener('submit', function(event) {
       var request = new XMLHttpRequest();
       request.open('POST', 'https://hooks.slack.com/services/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', true);
       request.setRequestHeader(
         'Content-Type',
         'application/x-www-form-urlencoded; charset=UTF-8'
       );

       request.onload = function() {
         if (this.status >= 200 && this.status < 400) {
           var data = JSON.parse(this.response);
           console.log('submitted ok');
         } else {
           alert('Error with API Endpoint\n' + this.repsonse);
         }
       };

    request.onerror = function() {
      alert('Connection Error with API Endpoint');
    };

    var data = {
      'text': document.getElementById('email')
        .value + ' asks: '
        + document.getElementById('message').value,
      'username': document.getElementById('name').value,
      'icon_emoji': ':slack:'
    };
    request.send(JSON.stringify(data));

  });
});
