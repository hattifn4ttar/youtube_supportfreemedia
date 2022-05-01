// load settings fromo GitHub
function sendRequest(filename, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
      var json = xhr.responseText;  
      json = json.replace(/^[^(]*\(([\S\s]+)\);?$/, '$1'); // Turn JSONP in JSON
      json = JSON.parse(json);
      console.log('[stopwar] REQUEST:', filename, json);
      callback(json)
  };
  xhr.open('GET', 'https://hattifn4ttar.github.io/supportfreemedia/' + filename);
  xhr.send();
}
