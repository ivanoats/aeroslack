$(document).ready(function() {
  $('slack').submit(function(event) {
    $.ajax({
      type: 'POST',
      url: '/slack',
      data: {
        'text': $('input#email').val() + ' asks: ' + $('input#message').val(),
        'username': $('input#name').val()
      },
      dataType: 'json',
      encode: true
    })
      .done(function(data) {
        alert('Your message was posted to our Slack channel.'
            + ' Check your email for a response');
      });
    event.preventDefault();
  });
});
