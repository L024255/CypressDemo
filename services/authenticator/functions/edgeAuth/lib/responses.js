function errorResponse500(additionalMessage = null) {
  return {
    status: 500,
    statusDescription: 'Internal Server Error',
    headers: {
      'content-type': [{
        key: 'Content-Type',
        value: 'text/html',
      }],
    },
    body: `
<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Internal Server Error</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.4/css/bulma.min.css" />
<script defer src="https://use.fontawesome.com/releases/v5.3.1/js/all.js"></script></head>
<body><section class="hero has-text-centered is-fullheight"><div class="hero-body"><div class="container">
<!-- 500 -->
<h1 class="title">Internal Server Error</h1>
<h2 class="subtitle">${additionalMessage || '&nbsp;'}</h2>
</div></div></section></body></html>
`,
  };
}

function errorResponse401(additionalMessage = null) {
  return {
    status: 401,
    statusDescription: 'Forbidden',
    headers: {
      'content-type': [{
        key: 'Content-Type',
        value: 'text/html',
      }],
    },
    body: `
<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Forbidden</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.4/css/bulma.min.css" />
<script defer src="https://use.fontawesome.com/releases/v5.3.1/js/all.js"></script></head>
<body><section class="hero has-text-centered is-fullheight"><div class="hero-body"><div class="container">
<!-- 401 -->
<h1 class="title">Forbidden</h1>
<h2 class="subtitle">${additionalMessage || '&nbsp;'}</h2>
</div></div></section></body></html>
`,
  };
}

function redirectResponse307(redirectUrl, additionalHeaders = {}) {
  return {
    status: 307,
    statusDescription: 'Temporary Redirect',
    headers: {
      ...additionalHeaders,
      location: [{
        key: 'Location',
        value: redirectUrl,
      }],
    },
  };
}

function redirectResponse302(redirectUrl, additionalHeaders = {}) {
  return {
    status: 302,
    statusDescription: 'Found',
    headers: {
      ...additionalHeaders,
      location: [{
        key: 'Location',
        value: redirectUrl,
      }],
    },
  };
}

module.exports = {
  errorResponse401,
  errorResponse500,
  redirectResponse307,
  redirectResponse302,
};
