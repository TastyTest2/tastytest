var timestamp
timestamp = +new Date()
console.log(timestamp)
var crypto = require('crypto'),
  text = `_api_key=3805114c6d8f3b9879a679d77ed42da0&_timestamp=${timestamp}&_user_id=20293111`,
  key = process.env.akey,
  hash

hash = crypto
  .createHmac('sha256', key)
  .update(text)
  .digest('hex')

var authedurl = `http://api.adf.ly/v1/publisherStats?_api_key=3805114c6d8f3b9879a679d77ed42da0&_timestamp=${timestamp}&_user_id=20293111&_hash=${hash}`
// var authedurl = `http://api.adf.ly/v1/popadStats?_api_key=3805114c6d8f3b9879a679d77ed42da0&_timestamp=${timestamp}&_user_id=20293111&_hash=${hash}&start=2018-05-01`

var request = require('minimal-request')
var fs = require('fs')

request(
  {
    url: authedurl,
    method: 'get',
    headers: { 'accept-language': 'en-GB' },
    timeout: 5 // seconds
  },
  function(err, res, details) {
    console.log(err)
    // -> something like 404 or null

    console.log(res)
    // -> Something like {hi: 1234}
    var obj = JSON.parse(res)

    var str = JSON.stringify(obj.data.earned, null, 2)
    var date = new Date()
    fs.writeFile(
      'index.html',
      `<html><body>It works very well from ide too
      <a href="#" id="show" onClick="document.getElementById('count').classList.remove('hidden');document.getElementById('show').classList.add('hidden');">Show Now</a>;
      <style>.hidden {display:none}</style>
      <div id="count" class="hidden">${str}</div>
      <script type="text/javascript">
      var adfly_id = 20293111;
      var popunder_frequency_delay = 0;
      var adfly_protocol = 'https';
  </script>
  <script src="https://cdn.adf.ly/js/display.js"></script>

      </body></html>`,
      function(err) {
        if (err) {
          return console.log(err)
        }

        console.log('The file was saved!')
      }
    )

    console.log(str)

    console.log(details)
    // -> Something like { statusCode: 200, headers: { ... }}
  }
)
