let defaultURL = 'https://www.youtube.com/playlist?list=PLQxYKug91T31ixyCs81TwIl8wAiD9AZAH';
let playlistsDefault = [{ id: 1, name: 'Default', url: defaultURL, default: true }];

// utils
function getUrlValid(url) {
  let validUrl = url.indexOf('https://www.youtube.com/') === 0;
  validUrl = validUrl && url.includes('list=');
  return validUrl;
}
async function getFromStorage(name) {
  const setting = await chrome.storage.sync.get(name);
  return setting && setting[name];
}

// load settings when opening a popup
const xhr = new XMLHttpRequest();
xhr.onload = () => {
  let json = xhr.responseText;
  json = json.replace(/^[^(]*\(([\S\s]+)\);?$/, '$1'); // Turn JSONP in JSON
  json = JSON.parse(json);
  console.log('json:', json);

  playlistsDefault = json;
  showSavedPlaylists();
};
xhr.open('GET', 'https://hattifn4ttar.github.io/supportfreemedia/playlists.json');
xhr.send();
setTimeout(() => setForm(), 0);
setTimeout(() => localizeHtmlPage(), 10);


// load and display playlists
function createElementFromHTML(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  return div.firstChild;
}
async function showSavedPlaylists() {
  const elem = document.getElementById('radiobuttonsPlaylist');
  if (elem) {
    let playlistsCustom = await getFromStorage('playlistsCustom') || [];
    playlistsCustom = playlistsCustom.filter(p => p.url && getUrlValid(p.url));
    const nPlaylists = playlistsCustom.length + 1;
    playlistsCustom.push({ id: nPlaylists, name: 'Custom_' + nPlaylists, url: '' });
    chrome.storage.sync.set({ playlistsCustom });

    playlistsDefault.forEach((p, i) => {
      let elemRadio = createElementFromHTML(`
        <div class="playlist-radio-default playlist-radio-item">
          <input type="radio" id="` + p.url + `" name="playType" value="` + p.url + `">
          <label for="` + p.url + `" class="playlist-radio">
            ` + p.name + `
            <a class="defaultplaylist-link" href="` + p.url + `" id="` + p.name + `_link">` + p.url.replace('https://', '') + `</a>
          </label>
        </div>
      `);
      elem.appendChild(elemRadio);
      document.getElementById(p.name + '_link').addEventListener('click', () => window.open(p.url));
    });
    playlistsCustom.forEach((p, i) => {
      let elemRadio = createElementFromHTML(`
        <div class="playlist-radio-custom playlist-radio-item">
          <input type="radio" id="` + p.url + `" name="playType" value="` + p.url + `">
          <label for="` + p.url + `" class="playlist-radio playlist-radio_custom">
            <a class="defaultplaylist-link" href="` + p.url + `" id="` + p.name + `_link">` + p.name + `</a>
            <input type="text" class="playlist-link-edit" id="` + p.name + `" name="` + p.name + `" placeholder="Edit" value="` + p.url + `">
          </label>
        </div>
      `);
      elem.appendChild(elemRadio);
      if (p.url) document.getElementById(p.name + '_link').addEventListener('click', () => window.open(p.url));
    });
  }
  let playType = await getFromStorage('playType') || defaultURL;
  if (!document.getElementById(playType)) playType = defaultURL;
  if (document.getElementById(playType)) document.getElementById(playType).checked = true;
}

// load other settings
async function setForm() {
  chrome.storage.local.set({ supportYTLike: true });

  const notifyTime = await getFromStorage('notifyTime');
  if (notifyTime) {
    document.getElementById('time').value = notifyTime;
  }
  const promoteType = await getFromStorage('promoteType') || 'manual';
  const formValue = promoteType === 'auto';
  document.getElementById('promoteType').checked = formValue;
  selectPromoteType(promoteType);
}

function localizeHtmlPage() {
  // Localize by replacing __MSG_***__ meta tags
  const objects = document.getElementsByClassName('local');
  for (let j = 0; j < objects.length; j++) {
    const obj = objects[j];
    const valStrH = obj.innerHTML.toString();
    const valNewH = valStrH.replace(/__MSG_(\w+)__/g, function(match, v1) { return v1 ? chrome.i18n.getMessage(v1) : ""; });
    if (valNewH != valStrH) { obj.innerHTML = valNewH; }
  }
}
// end load settings



// form change
const formLike = document.getElementById('formLike');
if (formLike) {
  formLike.addEventListener('change', async (event) => {
    console.log('ev:', event?.target?.name, event?.target?.value);
    // notifications time
    if (event?.target?.name === 'time') {
      chrome.storage.sync.set({ notifyTime: event?.target?.value });
      chrome.storage.sync.set({ notifiedDate: null });
    }
    // manual vs automated
    if (event?.target?.name === 'promoteType') {
      const promoteType = event.target.checked ? 'auto' : 'manual';
      chrome.storage.sync.set({ promoteType });
      selectPromoteType(promoteType);
    }

    if (event?.target?.name === 'playType') {
      chrome.storage.sync.set({ playType: event.target.value });
    }
    if (event?.target?.name?.includes('Custom_')) {
      const playlistsCustom = await getFromStorage('playlistsCustom') || [];
      playlistsCustom.forEach(p => {
        if (p.name === event.target.name) p.url = event.target.value;
      });
      chrome.storage.sync.set({ playlistsCustom });
      // show new playlsts
      const radioButtons = document.getElementsByClassName('playlist-radio-item');
      if (radioButtons?.length) [...radioButtons].forEach(d => d.remove());
      showSavedPlaylists();
    }
    event.preventDefault();
  }, false);
}

function selectPromoteType(promoteType) {
  console.log('promoteType:', promoteType);
  let type1, type2;

  type2 = document.getElementsByClassName(promoteType === 'manual' ? 'promoteDetailsAuto' : 'promoteDetailsManual');
  type1 = document.getElementsByClassName(promoteType === 'manual' ? 'promoteDetailsManual' : 'promoteDetailsAuto');

  [...type1].forEach(d => { d.style.display = 'inline-block'; d.style.maxHeight = 'none'; d.style.maxWidth = 'none'; });
  [...type2].forEach(d => { d.style.display = 'none'; d.style.maxHeight = 0; d.style.maxWidth = 0; });
}

function clearTime() {
  document.getElementById('time').value = '';
  chrome.storage.sync.set({ notifyDisabled: true });
  chrome.storage.sync.set({ notifyTime: null });
}



// open tabs
document.getElementById('clickactivity1').addEventListener('click', () => startScript(1));
document.getElementById('clickactivity3').addEventListener('click', () => startScript(3));
document.getElementById('clickactivity2').addEventListener('click', () => startScript(2));
document.getElementById('clickOpenPlaylist').addEventListener('click', () => startScript(0));
document.getElementById('timeRemoveBtn').addEventListener('click', clearTime);


document.getElementById('githubLink').addEventListener('click', () => window.open('https://github.com/hattifn4ttar/youtube_supportfreemedia'));
document.getElementById('youtubeLink').addEventListener('click', () => window.open('https://www.youtube.com/watch?v=jowEf5tSSyc'));
document.getElementById('webLink').addEventListener('click', () => window.open('https://hattifn4ttar.github.io/supportfreemedia/'));

async function startScript(nTabs) {
  // open the start page based on user preferences
  const playType = await getFromStorage('playType');

  chrome.storage.local.set({ nTabs });

  let manual = !nTabs;
  if (manual || playType !== 'channels') {
    // run playlist
    let url = playType || defaultURL;

    // validate url
    if (!getUrlValid(url)) {
      alert('URL is invalid. Open YouTube playlist.');
      return;
    }

    if (!manual) {
      // automated
      chrome.storage.local.set({ startUrl: url, openTime: (new Date()).getTime() });
    }
    window.open(url);
  }
}
