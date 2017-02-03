# Aerobatic Announces API Request Proxy for Bitbucket Hosting Plugin

## Do You Have the Time to Be a Full-Stack Developer?
Like many of you, I have followed the trend and moved from server generated web pages in Java, PHP, or Rails, to Single Page App (SPA) development. And there is only one choice for the language: JavaScript. This has simplified things a bit, but there is still a lot to keep track of.

This makes me a full-stack developer, capable of creating a virtual server, docker image, database setup, server API, or whatever I need. And now, I can add in the JavaScript flavor of the month, from Backbone to Angular to React.

But lately, I have been asking the question, do I really need to know all this? Do I even have the time? What do I enjoy the most? When I answer those questions, the answer is definitely: I love to create online products that are beautiful, useable, and technically well-crafted. The front-end is big enough world for me to do that.

I don't want to completely lose control of the back-end, or need to team up with others to get simple apps done. But realistically, my back-end needs can be simple, and similar to many other people.

Many of you may host your static sites on Amazon S3, and manually configuring CloudFront CDN via the Amazon Web Services interface. But this gives you no chance at a back-end, and lots of configuration. Others may be coding a simple node or ruby server and publishing it to a PaaS provider, but this means you are usually writing boilerplate back-end code, or fiddling around with creating a basic REST API yet again. Maybe you even have a puppet/ansible/chef/docker script to spin up your own virtual server, but then you're stuck upgrading it whenever a security patch is released. What if you didn't have to worry about all this non programming stuff?

I have been working with a company called Aerobatic that has a plug in for Bitbucket, and moving many of my sites to it. The plugin allows you to publish your web sites with a simple 'git push' command. Whether you have a Jekyll blog, a static site documenting your open-source project, or a full-featured web app built with a framework such as AngularJS, Ember, or React, you can now now edit your code, push your changes to Bitbucket, and your site will be deployed automatically. Assets will be automatically hosted on a content delivery network (CDN) so that your site visitors will see the site faster. You can have a custom domain point to your aerobatic site with a DNS CNAME record.

## Announcing Express Request Proxy Add-On
Today, Aerobatic is happy to introduce a custom web hook add-on for static site apps called Express Request Proxy. This means that you can call APIs on the internet without worrying about cross origin resource sharing (CORS) policies. You can even contribute your own add-ons to the [4Front](http://4front.io) open-source project, which powers our back-end.

The express-request-proxy add-on is a high performance, intelligent proxy that supports proxying AJAX requests to remote http endpoints. In addition to simple pass-through proxying, it also supports caching, parameter injection (to querystring, path, and body), as well as response transforms. In the package.json virtual router setup, you can define one or more instances of the proxy add-on.

This is just the first of many add-ons that will be integrated into the Aerobatic bitbucket plugin. Others in the pipeline include custom error pages, form processing, authentication, and more.

## Post to Slack From Your Web App with Aerobatic
I'll walk you through using the express-request-proxy add-on to set up an integration with [Slack](http://slack.com) (a popular chat app). We will create a simple web app. It has a form that posts a message to a Slack channel using the Slack API.

## HTML page - index.html

Below I set up a basic index.html with a form, include main.js, and the simple[Skeleton](http://getskeleton.com) CSS framework.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Send a Support Message to a Slack Channel</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/skeleton/2.0.4/skeleton.css">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
  <div class="container">
    <h1>Send a message</h1>
    <p>
      Use the form below to send a message to our Slack channel. Include your
      email and someone will contact you as soon as possible.
    </p>
    <p>This form sends directly to the webhook</p>
    <form id="slack" action="#">
      <div class="row">
        <div class="twelve columns">
          <label for="name">Name:</label>
          <input class="u-full-width" type="text" id="name" placeholder="Your Name">
          <label for="email">Email:</label>
          <input class="u-full-width" type="text" id="email" placeholder="you@yoursite.com">
          <label for="message">Message:</label>
          <input class="u-full-width" type="text" id="message" placeholder="your message to the chat channel">
          <button id="submit-button" type="submit" class="button button-primary">Send</button>
        </div>
      </div>
    </form>
    <div style="display: none" id="confirm">
      <button>Your request was sent to the Slack channel successfully</button>
    </div>
  </div>
  <script charset="utf-8" src="main.js"></script>
</body>
</html>

```

## Main.js
Here's the meat of the app - It processes the form and sends the data via AJAX. I decided to use vanilla JS , and not to use jQuery, because what I'm doing does not need the whole library.

```javascript
var ready = function(fn) {
  if (document.readyState != 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
};

var checkLoad = function() {
  if (this.status >= 200 && this.status < 400) {
    // hide the form on success
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

  request.open('POST', '/slack', true);

  request.setRequestHeader(
    'Content-Type',
    'application/json; charset=UTF-8'
  );

  // let the server know it's an XHR request
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
```

### Configuring the Express-Request-Proxy Add-on
You might have noticed that I posted to a local endpoint '/slack'. Where does that come from? Here, in package.json, you can specify the add-on options. It's all in the `_virtualApp` section:

```json
{
  "name": "aeroslacker",
  "version": "0.0.1",
  "description": "Demo of using middleware on Aerobatic.com hosted apps",
  "main": "index.html",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node ./node_modules/live-server/live-server.js"
  },
  "repository": {
    "type": "git",
    "url": "git+ssh://git@bitbucket.org/ivanoats/aeroslack.git"
  },
  "keywords": [
    "aerobatic",
    "slack"
  ],
  "author": "Ivan Storck",
  "license": "ISC",
  "homepage": "https://bitbucket.org/ivanoats/aeroslack#readme",
  "_virtualApp": {
    "router": [
      {
        "module": "express-request-proxy",
        "options": {
          "url": "env:SLACK_WEBHOOK_URL"
        },
        "method": "post",
        "path": "/slack"
      },
      {
        "module": "webpage"
      }
    ]
  },
  "devDependencies": {
    "live-server": "^0.7.1"
  }
}
```

### Configuring the Environment Variables for Secrets
(screenshot of Aerobatic Bitbucket settings)
