var ready = function(fn) {
  if (document.readyState != 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
};

var checkLoad = function() {
  if (this.status >= 200 && this.status < 400) {
    document.getElementById('slack').style.display = 'none';
    document.getElementById('confirm').style.display = 'block';
  } else {
    alert('Error with API Endpoint\n' + this.repsonse);
  }
};

var ajaxError = function() {
  alert('Connection Error with API Endpoint');
};

var processFormData = function() {
  var text = document.getElementById('email').value +
    ' asks ' +
    document.getElementById('message').value;

  return JSON.stringify({
    text: text,
    username: document.getElementById('name').value,
    icon_emoji: ':ghost:'
  });
};

var submitter = function(event) {
  var request = new XMLHttpRequest();

  request.open('POST',
    '/slack',
    true);

  request.setRequestHeader(
    'Content-Type',
    'application/json; charset=UTF-8'
  );

  request.setRequestHeader(
    'X-Requested-With',
    'XMLHttpRequest'
  );

  request.onload = checkLoad;
  request.onerror = ajaxError;
  request.send(processFormData());
  event.preventDefault();
};

ready(function() {
   document.getElementById('slack')
     .addEventListener('submit', submitter);
});
