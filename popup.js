async function startScript(nTabs) {
  // open the start page based on user preferences
  let playType = await chrome.storage.sync.get('playType');
  playType = playType.playType;

  chrome.storage.local.set({ nTabs });

  let manual = !nTabs;
  if (manual || playType !== 'channels') {
    // run playlist
    // default url
    let url = 'https://www.youtube.com/playlist?list=PLQxYKug91T31ixyCs81TwIl8wAiD9AZAH';

    // user url
    if (manual) {
      let playlistURLManual = await chrome.storage.sync.get('playlistURLManual');
      playlistURLManual = playlistURLManual?.playlistURLManual || '';
      url = playlistURLManual || url;
    } else {
      let playlistURLAuto = await chrome.storage.sync.get('playlistURLAuto');
      playlistURLAuto = playlistURLAuto?.playlistURLAuto || '';
      url = playlistURLAuto || url;
    }
    
    // validate url
    let validUrl = url.indexOf('https://www.youtube.com/') === 0;
    validUrl = validUrl && url.includes('list=');
    if (!validUrl) {
      alert('URL is invalid. Open YouTube playlist.');
      return;
    }

    if (!manual) {
      // automated
      chrome.storage.local.set({ startUrl: url, openTime: (new Date()).getTime() });
    }
    window.open(url);
  }
  else {
    // open YT channels in multiple tabs
    window.open('https://www.youtube.com/playlist?list=PLQxYKug91T31ixyCs81TwIl8wAiD9AZAH&openNew=1&mute=1');
  }
}


async function setForm() {
  chrome.storage.local.set({ supportYTLike: true });

  let notifyTime = await chrome.storage.sync.get('notifyTime');
  notifyTime = notifyTime?.notifyTime;
  if (notifyTime) {
    document.getElementById('time').value = notifyTime;
  }

  let playType = await chrome.storage.sync.get('playType');
  playType = playType?.playType || 'playlist';
  document.getElementById(playType).checked = true;

  let playlistURLAuto = await chrome.storage.sync.get('playlistURLAuto');
  playlistURLAuto = playlistURLAuto?.playlistURLAuto || '';
  document.getElementById('playlistURLAuto').value = playlistURLAuto;

  let playlistURLManual = await chrome.storage.sync.get('playlistURLManual');
  playlistURLManual = playlistURLManual?.playlistURLManual || '';
  document.getElementById('playlistURLManual').value = playlistURLManual;

  let promoteType = await chrome.storage.sync.get('promoteType');
  promoteType = promoteType?.promoteType || 'manual';
  document.getElementById('promoteType').value = promoteType;
  selectPromoteType(promoteType);
}
setForm();

var formLike = document.getElementById("formLike");
if (formLike) {
  formLike.addEventListener("change", async function(event) {
    console.log('ev:', event?.target?.name, event?.target?.value);
    if (event?.target?.name === 'like') {
      let like = await chrome.storage.local.get('supportYTLike');
      like = like.supportYTLike;
      chrome.storage.local.set({ supportYTLike: !like });
    }
    if (event?.target?.name === 'time') {
      chrome.storage.sync.set({ notifyTime: event?.target?.value });
      chrome.storage.sync.set({ notifiedDate: null });
    }
    if (event?.target?.name === 'playType') {
      chrome.storage.sync.set({ playType: event.target.value });
    }
    if (event?.target?.name === 'promoteType') {
      chrome.storage.sync.set({ promoteType: event.target.value });
      selectPromoteType(event.target.value);
    }
    if (event?.target?.name === 'playlistURLAuto') {
      chrome.storage.sync.set({ playlistURLAuto: event.target.value });
    }
    if (event?.target?.name === 'playlistURLManual') {
      chrome.storage.sync.set({ playlistURLManual: event.target.value });
    }
    event.preventDefault();
  }, false);
}

function selectPromoteType(tabName) {
  let type1, type2;

  type2 = document.getElementById(tabName === 'manual' ? 'promoteDetailsAuto' : 'promoteDetailsManual');
  type1 = document.getElementById(tabName === 'manual' ? 'promoteDetailsManual' : 'promoteDetailsAuto');

  type1.style.visibility = 'visible';
  type1.style.maxHeight = 'none';
  type2.style.visibility = 'hidden';
  type2.style.maxHeight = 0;
}

function localizeHtmlPage() {
    //Localize by replacing __MSG_***__ meta tags
    var objects = document.getElementsByClassName('local');
    for (var j = 0; j < objects.length; j++) {
        var obj = objects[j];

        var valStrH = obj.innerHTML.toString();
        var valNewH = valStrH.replace(/__MSG_(\w+)__/g, function(match, v1) {
            return v1 ? chrome.i18n.getMessage(v1) : "";
        });
        if(valNewH != valStrH) { obj.innerHTML = valNewH; }
    }
}
localizeHtmlPage();

function clearTime() {
  document.getElementById('time').value = '';
  chrome.storage.sync.set({ notifyDisabled: true });
  chrome.storage.sync.set({ notifyTime: null });
}

document.getElementById('clickactivity1').addEventListener('click', () => startScript(1));
document.getElementById('clickactivity5').addEventListener('click', () => startScript(5));
document.getElementById('clickactivity3').addEventListener('click', () => startScript(3));
document.getElementById('clickactivity2').addEventListener('click', () => startScript(2));
document.getElementById('clickOpenPlaylist').addEventListener('click', () => startScript(0));
document.getElementById('timeRemoveBtn').addEventListener('click', clearTime);


document.getElementById('githubLink').addEventListener('click', () => window.open('https://github.com/hattifn4ttar/youtube_supportfreemedia'));
document.getElementById('youtubeLink').addEventListener('click', () => window.open('https://www.youtube.com/watch?v=jowEf5tSSyc'));
document.getElementById('webLink').addEventListener('click', () => window.open('https://hattifn4ttar.github.io/supportfreemedia/'));
if (document.getElementById('playlistLink')) document.getElementById('playlistLink').addEventListener('click', () => window.open('https://www.youtube.com/playlist?list=PLQxYKug91T31ixyCs81TwIl8wAiD9AZAH'));
if (document.getElementById('playlistLink2')) document.getElementById('playlistLink2').addEventListener('click', () => window.open('https://www.youtube.com/playlist?list=PLQxYKug91T31ixyCs81TwIl8wAiD9AZAH'));

// for debugging
// document.getElementById('clickReset').addEventListener('click', () => { chrome.storage.sync.set({ notifiedDate: null }); });

