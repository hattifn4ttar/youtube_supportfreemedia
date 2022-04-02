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


chrome.storage.sync.set({ playType: 'playlist' });
chrome.storage.local.set({ supportYTLike: true });

var formLike = document.getElementById("formLike");
if (formLike) {
  formLike.addEventListener("change", async function(event) {
    let like = await chrome.storage.local.get('supportYTLike');
    like = like.supportYTLike;
    chrome.storage.local.set({ supportYTLike: !like });
    event.preventDefault();
  }, false);
}

var form1 = document.getElementById("form1");
form1.addEventListener("change", async function(event) {
  chrome.storage.sync.set({ playType: event.target.value });
  event.preventDefault();
}, false);




document.getElementById('clickactivity20').addEventListener('click', () => startScript(20));
document.getElementById('clickactivity15').addEventListener('click', () => startScript(15));
document.getElementById('clickactivity10').addEventListener('click', () => startScript(10));
document.getElementById('clickactivity5').addEventListener('click', () => startScript(5));
document.getElementById('clickactivity3').addEventListener('click', () => startScript(3));
document.getElementById('clickactivity2').addEventListener('click', () => startScript(2));

document.getElementById('githubLink').addEventListener('click', () => window.open('https://github.com/hattifn4ttar/youtube_supportfreemedia'));
document.getElementById('youtubeLink').addEventListener('click', () => window.open('https://www.youtube.com/watch?v=jowEf5tSSyc'));
document.getElementById('webLink').addEventListener('click', () => window.open('https://hattifn4ttar.github.io/supportfreemedia/'));
document.getElementById('playlistLink').addEventListener('click', () => window.open('https://www.youtube.com/playlist?list=PLQxYKug91T31ixyCs81TwIl8wAiD9AZAH'));