async function startScript(nTabs) {
  // open the start page based on user preferences
  let playType = await chrome.storage.sync.get('playType');
  playType = playType.playType;

  if (typeof browser === "undefined") {
    var browser = chrome;
  }
  if (playType === 'channels') {
    window.open('https://www.youtube.com/playlist?list=PLQxYKug91T31ixyCs81TwIl8wAiD9AZAH&openNew=1&nTabs=' + nTabs + '&mute=1');
  } else {
    window.open('https://www.youtube.com/playlist?list=PLQxYKug91T31ixyCs81TwIl8wAiD9AZAH&openPlaylistFirstTab=1&nTabs=' + nTabs);
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