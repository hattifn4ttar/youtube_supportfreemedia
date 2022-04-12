async function startScript(nTabs) {
  // open the start page based on user preferences
  let playType = await chrome.storage.sync.get('playType');
  playType = playType.playType;

  chrome.storage.local.set({ nTabs });
  
  if (!nTabs) {
    // open default playlist
    let url = 'https://www.youtube.com/playlist?list=PLQxYKug91T31ixyCs81TwIl8wAiD9AZAH';
    let playlistURLManual = await chrome.storage.sync.get('playlistURLManual');
    playlistURLManual = playlistURLManual?.playlistURLManual || '';
    if (playlistURLManual) {
      url = playlistURLManual;
      let validUrl = url.indexOf('https://www.youtube.com/') === 0;
      validUrl = validUrl && url.includes('list=');
      if (!validUrl) {
        alert('URL is invalid. Open YouTube playlist.');
        return;
      }
    }
    window.open(url);
  }
  else if (playType === 'channels') {
    // open YT channels in multiple tabs
    window.open('https://www.youtube.com/playlist?list=PLQxYKug91T31ixyCs81TwIl8wAiD9AZAH&openNew=1&mute=1');

  } else {
    // open default playlist
    let url = 'https://www.youtube.com/playlist?list=PLQxYKug91T31ixyCs81TwIl8wAiD9AZAH';
    let playlistURLAuto = await chrome.storage.sync.get('playlistURLAuto');
    playlistURLAuto = playlistURLAuto?.playlistURLAuto || '';
    if (playlistURLAuto) {
      url = playlistURLAuto;
      let validUrl = url.indexOf('https://www.youtube.com/') === 0;
      validUrl = validUrl && url.includes('list=');
      if (!validUrl) {
        alert('URL is invalid. Open YouTube playlist.');
        return;
      }
    }

    chrome.storage.local.set({ startUrl: url, openTime: (new Date()).getTime() });
    window.open(url);

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
  // document.getElementById(promoteType).checked = true;
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
  let i, type1, type2;

  type2 = document.getElementById(tabName === 'manual' ? 'promoteDetailsAuto' : 'promoteDetailsManual');
  type1 = document.getElementById(tabName === 'manual' ? 'promoteDetailsManual' : 'promoteDetailsAuto');

  type1.style.visibility = 'visible';
  type1.style.maxHeight = 'none';
  type2.style.visibility = 'hidden';
  type2.style.maxHeight = 0;
}

document.getElementById('clickactivity1').addEventListener('click', () => startScript(1));
document.getElementById('clickactivity5').addEventListener('click', () => startScript(5));
document.getElementById('clickactivity3').addEventListener('click', () => startScript(3));
document.getElementById('clickactivity2').addEventListener('click', () => startScript(2));
document.getElementById('clickOpenPlaylist').addEventListener('click', () => startScript(0));

document.getElementById('githubLink').addEventListener('click', () => window.open('https://github.com/hattifn4ttar/youtube_supportfreemedia'));
document.getElementById('youtubeLink').addEventListener('click', () => window.open('https://www.youtube.com/watch?v=jowEf5tSSyc'));
document.getElementById('webLink').addEventListener('click', () => window.open('https://hattifn4ttar.github.io/supportfreemedia/'));
if (document.getElementById('playlistLink')) document.getElementById('playlistLink').addEventListener('click', () => window.open('https://www.youtube.com/playlist?list=PLQxYKug91T31ixyCs81TwIl8wAiD9AZAH'));
if (document.getElementById('playlistLink2')) document.getElementById('playlistLink2').addEventListener('click', () => window.open('https://www.youtube.com/playlist?list=PLQxYKug91T31ixyCs81TwIl8wAiD9AZAH'));

// for debugging
// document.getElementById('clickReset').addEventListener('click', () => { chrome.storage.sync.set({ notifiedDate: null }); });

