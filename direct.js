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
  return JSON.stringify({
    'text': document.getElementById('email')
    .value + ' asks: ' + document.getElementById('message').value,
    'username': document.getElementById('name').value,
    'icon_emoji': ':slack:'
  });
};

var submitter = function(event) {
  var request = new XMLHttpRequest();

  request.open('POST',
    'https://hooks.slack.com/services/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',
    true);

  request.setRequestHeader(
    'Content-Type',
    'application/x-www-form-urlencoded; charset=UTF-8'
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
