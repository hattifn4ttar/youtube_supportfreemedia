// show notifications

async function startScript(nTabs) {
  // open the start page based on user preferences
  let playType = await chrome.storage.sync.get('playType');
  playType = playType.playType;

  chrome.storage.local.set({ nTabs });
  chrome.storage.sync.set({ notifiedDate: (new Date().toISOString()).substring(0, 10) });
  
  if (!nTabs) {
    // promote manually
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
  } else if (playType === 'channels') {
    // promote automatically, channels
    window.open('https://www.youtube.com/playlist?list=PLQxYKug91T31ixyCs81TwIl8wAiD9AZAH&openNew=1&mute=1');

  } else {
    // promote automatically, playlist
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

async function closePopup() {
  chrome.storage.sync.set({ notifiedDate: (new Date().toISOString()).substring(0, 10) });
  console.log('CLOSE');

  let notifyTime = await chrome.storage.sync.get('notifyTime');
  notifyTime = notifyTime?.notifyTime;

  if (!notifyTime) {
    chrome.storage.sync.set({ notifyDisabled: true });
  }
  let popupElem = document.getElementById('notifyPopup');
  popupElem.remove();
}


function createElementFromHTML(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  return div.firstChild;
}
async function showNotificationPopup() {
  let promoteType = await chrome.storage.sync.get('promoteType');
  promoteType = promoteType?.promoteType || 'manual';

  console.log('[stopwar] NOTIFY:');
  let elemPopup = createElementFromHTML(`
    <div class="notify-popup" id="notifyPopup">
        <div class="notify-popup-descr">
          Extension "Stop war - support free media on YouTube"<br />
          You can change notification time in the extension settings.
        </div>
        <img src="https://hattifn4ttar.github.io/supportfreemedia/images/img128_2.png" alt="Promote YouTube Playlist" class="logo">
        <div class="notify-popup-title">Reminder:<br />Run YouTube playlist, fight propaganda.</div>

        <div class="notify-popup-buttons">
          <button id="notifyOpen5" class="open-tabs-btn">5 tabs</button>
          <button id="notifyOpen3" class="open-tabs-btn">3 tabs</button>  
          <button id="notifyOpen2" class="open-tabs-btn">2 tabs</button>  
          <button id="notifyOpen1" class="open-tabs-btn">1 tab</button>

          <button id="notifyClose" class="open-tabs-btn notify-close">Close</button>
        </div>
        <!--
        <br />
        <div class="notify-popup-descr float-right">
          Applying recently used configuration
        </div>
        -->
      </div>
  `);
  if (promoteType === 'manual') {
    elemPopup = createElementFromHTML(`
    <div class="notify-popup" id="notifyPopup">
        <div class="notify-popup-descr">
          Extension "Stop war - support free media on YouTube"<br />
          You can change notification time in the extension settings.
        </div>
        <img src="https://hattifn4ttar.github.io/supportfreemedia/images/img128_2.png" alt="Promote YouTube Playlist" class="logo">
        <div class="notify-popup-title">Reminder:<br />Run YouTube playlist, fight propaganda.</div>

        <div class="notify-popup-buttons">
          <button id="notifyOpenManual" class="open-tabs-btn">Open saved playlist</button>
          <button id="notifyClose" class="open-tabs-btn notify-close">Close</button>
        </div>
      </div>
  `);
  }
  document.body.appendChild(elemPopup);

  setTimeout(() => {
    if (promoteType === 'manual') {
      document.getElementById('notifyOpenManual').addEventListener('click', () => startScript(0));
      document.getElementById('notifyClose').addEventListener('click', () => closePopup());
    } else {
      document.getElementById('notifyOpen1').addEventListener('click', () => startScript(1));
      document.getElementById('notifyOpen5').addEventListener('click', () => startScript(5));
      document.getElementById('notifyOpen3').addEventListener('click', () => startScript(3));
      document.getElementById('notifyOpen2').addEventListener('click', () => startScript(2));
      document.getElementById('notifyClose').addEventListener('click', () => closePopup());
    }
  }, 1000);
}




setTimeout(() => checkNotify(), 2000);

async function checkNotify() {

  let notifyTime = await chrome.storage.sync.get('notifyTime');
  notifyTime = notifyTime?.notifyTime;
  let notifiedDate = await chrome.storage.sync.get('notifiedDate');
  notifiedDate = notifiedDate?.notifiedDate || '';
  let notifyDisabled = await chrome.storage.sync.get('notifyDisabled');
  notifyDisabled = notifyDisabled?.notifyDisabled;


  const currentTime = new Date().toLocaleTimeString();
  const currentDate = (new Date().toISOString()).substring(0, 10);

  if (notifyTime || (!notifyTime && !notifyDisabled)) {
    let [hrSaved, minutesSaved] = notifyTime.split(':');
    hrSaved = Number(hrSaved);
    hrSaved = hrSaved == 12 ? 0 : hrSaved;
    minutesSaved = Number(minutesSaved);
    console.log('hr:', hrSaved, minutesSaved);

    let [hrCurrent, minutesCurrent, rest] = currentTime.split(':');
    hrCurrent = rest.includes('PM') ? Number(hrCurrent) + 12 : Number(hrCurrent);
    hrCurrent = hrCurrent == 12 ? 0 : hrCurrent;
    minutesCurrent = Number(minutesCurrent);

    console.log('notify:', hrCurrent, hrSaved, minutesCurrent, minutesSaved, notifiedDate, currentDate);
    if (currentDate > notifiedDate && (hrCurrent > hrSaved || minutesCurrent >= minutesSaved && hrCurrent >= hrSaved)) {
      showNotificationPopup();
    }
  }
}