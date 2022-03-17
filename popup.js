async function startScript(nTabs) {
  // Open the start page
  
  console.log('click:', nTabs);
  let playType = await chrome.storage.local.get('playType');
  playType = playType.playType;

  if (playType === 'channels') {
    window.open('https://www.youtube.com/playlist?list=PLQxYKug91T31ixyCs81TwIl8wAiD9AZAH&openNew=1&channelIndex=none&channelUrl=none&nTabs=' + nTabs);
  } else {
    window.open('https://www.youtube.com/playlist?list=PLQxYKug91T31ixyCs81TwIl8wAiD9AZAH&openPlaylistFirstTab=1&nTabs=' + nTabs);
  }
}

document.getElementById('clickactivity20').addEventListener('click', () => startScript(20));
document.getElementById('clickactivity15').addEventListener('click', () => startScript(15));
document.getElementById('clickactivity10').addEventListener('click', () => startScript(10));
document.getElementById('clickactivity5').addEventListener('click', () => startScript(5));
document.getElementById('clickactivity3').addEventListener('click', () => startScript(3));
document.getElementById('clickactivity2').addEventListener('click', () => startScript(2));

// document.getElementById('githubLink').addEventListener('click', () => window.open('https://github.com/hattifn4ttar/youtube_openchannels'));
document.getElementById('youtubeLink').addEventListener('click', () => window.open('https://www.youtube.com/watch?v=jowEf5tSSyc'));
document.getElementById('webLink').addEventListener('click', () => window.open('https://hattifn4ttar.github.io/supportfreemedia/'));

chrome.storage.local.set({ playType: 'playlist' });
chrome.storage.local.set({ like: true });

var form = document.querySelector("form");
form.addEventListener("change", async function(event) {
  console.log('change:', event.target.name, event.target.value);
  if (event.target.name === 'playType') {
    chrome.storage.local.set({ playType: event.target.value });
  } else if (event.target.name === 'like') {
    let like = await chrome.storage.local.get('like');
    like = like.like;
    chrome.storage.local.set({ like: !like });
  }
  event.preventDefault();
}, false);


function getChecked(v) {
  console.log(v);
}