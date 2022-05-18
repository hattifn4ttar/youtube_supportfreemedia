async function getFromStorage(name) {
  const setting = await chrome.storage.sync.get(name);
  return setting && setting[name];
}
async function getFromStorageLocal(name) {
  const setting = await chrome.storage.local.get(name);
  return setting && setting[name];
}

// load settings fromo GitHub
// it takes 1-7 days to publish a new version in Chrome Store - need some flexibility without updating the version
function sendRequest(filename, callback) {
  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    let json = xhr.responseText;
    json = json.replace(/^[^(]*\(([\S\s]+)\);?$/, '$1'); // Turn JSONP in JSON
    json = JSON.parse(json);
    console.log('[stopwar] REQUEST:', filename, json);
    callback(json);
  };
  xhr.open('GET', 'https://hattifn4ttar.github.io/supportfreemedia/' + filename);
  xhr.send();
}

// show popups and buttons
function createElementFromHTML(htmlString) {
  const div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  return div.firstChild;
}

function localizeHtmlPage() {
  // Localize by replacing __MSG_***__ meta tags
  const objects = document.getElementsByClassName('local');
  for (let j = 0; j < objects.length; j++) {
    const obj = objects[j];

    const valStrH = obj.innerHTML.toString();
    const valNewH = valStrH.replace(/__MSG_(\w+)__/g, (match, v1) => { return v1 ? chrome.i18n.getMessage(v1) : ""; });
    if (valNewH != valStrH) { obj.innerHTML = valNewH; }
  }
}
