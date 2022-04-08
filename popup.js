async function startScript(nTabs) {
  // open the start page based on user preferences
  let playType = await chrome.storage.sync.get('playType');
  playType = playType.playType;

  chrome.storage.local.set({ nTabs });
  
  if (playType === 'channels') {
    // open YT channels in multiple tabs
    window.open('https://www.youtube.com/playlist?list=PLQxYKug91T31ixyCs81TwIl8wAiD9AZAH&openNew=1&mute=1');
  
  } else if (playType === 'userplaylist') {
    // open user's playlist
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
      let url = tabs[0].url;      
      let validUrl = url.indexOf('https://www.youtube.com/') === 0;
      validUrl = validUrl && url.includes('list=');

      if (!validUrl) {
        alert('URL is invalid. Open YouTube playlist.');
        return;
      }

      chrome.storage.local.set({ startUrl: url, openTime: (new Date()).getTime() });
      window.open(url);
    });
  
  } else {
    // open default playlist
    let url = 'https://www.youtube.com/playlist?list=PLQxYKug91T31ixyCs81TwIl8wAiD9AZAH';
    chrome.storage.local.set({ startUrl: url, openTime: (new Date()).getTime() });
    window.open(url);
  }
}


async function setForm() {
  chrome.storage.local.set({ supportYTLike: true });

  let notifyTime = await chrome.storage.sync.get('notifyTime');
  notifyTime = notifyTime?.notifyTime;
  console.log('time:', notifyTime);
  if (notifyTime) {
    document.getElementById('time').value = notifyTime;
  }

  let playType = await chrome.storage.sync.get('playType');
  playType = playType?.playType || 'playlist';
  console.log('type:', playType);
  document.getElementById(playType).checked = true;
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
    }
    if (event?.target?.name === 'playType') {
      chrome.storage.sync.set({ playType: event.target.value });
    }
    event.preventDefault();
  }, false);
}


document.getElementById('clickactivity10').addEventListener('click', () => startScript(10));
document.getElementById('clickactivity5').addEventListener('click', () => startScript(5));
document.getElementById('clickactivity3').addEventListener('click', () => startScript(3));
document.getElementById('clickactivity2').addEventListener('click', () => startScript(2));

document.getElementById('githubLink').addEventListener('click', () => window.open('https://github.com/hattifn4ttar/youtube_supportfreemedia'));
document.getElementById('youtubeLink').addEventListener('click', () => window.open('https://www.youtube.com/watch?v=jowEf5tSSyc'));
document.getElementById('webLink').addEventListener('click', () => window.open('https://hattifn4ttar.github.io/supportfreemedia/'));
// document.getElementById('playlistLink').addEventListener('click', () => window.open('https://www.youtube.com/playlist?list=PLQxYKug91T31ixyCs81TwIl8wAiD9AZAH'));

// for debugging
// document.getElementById('clickReset').addEventListener('click', () => { chrome.storage.sync.set({ notifiedDate: null }); });
