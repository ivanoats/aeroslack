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
       console.log('submitted');
       var request = new XMLHttpRequest();
       request.open('POST', '/slack', true);
       request.setRequestHeader(
         'Content-Type',
         'application/x-www-form-urlencoded; charset=UTF-8'
       );

       request.onload = function() {
         if (this.status >= 200 && this.status < 400) {
           var data = JSON.parse(this.response);
         } else {
           alert('Error with API Endpoint' + this.repsonse);
         }
       };

       request.onerror = function() {
         alert('Connection Error with API Endpoint')
       };

       var data = {
         'text': $('input#email').val() + ' asks: ' + $('input#message').val(),
         'username': $('input#name').val()
       };
       request.send(data);
     }, false);
});
