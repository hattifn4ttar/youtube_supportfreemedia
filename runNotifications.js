// show notifications

async function startScript(nTabs) {
  // open the start page based on user preferences
  const playType = await getFromStorage('playType');

  chrome.storage.local.set({ nTabs });
  chrome.storage.sync.set({ notifiedDate: (new Date().toISOString()).substring(0, 10) });

  const manual = !nTabs;
  if (manual || playType !== 'channels') {
    // run playlist
    let url = playType || defaultURL;

    // validate url
    let validUrl = url.indexOf('https://www.youtube.com/') === 0;
    validUrl = validUrl && url.includes('list=');
    if (!validUrl) { url = defaultURL; }

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

async function closePopup() {
  chrome.storage.sync.set({ notifiedDate: (new Date().toISOString()).substring(0, 10) });
  const notifyTime = await getFromStorage('notifyTime');

  if (!notifyTime) {
    chrome.storage.sync.set({ notifyDisabled: true });
  }
  let popupElem = document.getElementById('notifyPopup');
  popupElem.remove();
}

async function showNotificationPopup() {
  const promoteType = await getFromStorage('promoteType') || 'manual';
  const playType = await getFromStorage('playType');
  const playlistUrl = playType ? playType?.replace('https://', '') : 'Default';

  console.log('[stopwar] NOTIFY:');
  let elemPopup = createElementFromHTML(`
      <div class="notify-popup" id="notifyPopup">
        <div class="notify-popup-descr local">__MSG_notifyTopDescription__</div>
        <img src="https://hattifn4ttar.github.io/supportfreemedia/images/img128_2.png" alt="Promote YouTube Playlist" class="logo">
        <div class="notify-popup-text">
          <div class="notify-popup-title local">__MSG_notifyTitle__</div>
        </div>
        <div class="notify-popup-playlist local">__MSG_notifyPlaylist__  ` + playlistUrl + `</div>

        <div class="notify-popup-buttons">
          <div id="notifyOpen3" class="open-tabs-btn"><span class="local">__MSG_notifyBtnTabs3__</span></div>  
          <div id="notifyOpen2" class="open-tabs-btn"><span class="local">__MSG_notifyBtnTabs2__</span></div>  
          <div id="notifyOpen1" class="open-tabs-btn"><span class="local">__MSG_notifyBtnTabs1__</span></div>
          <div id="notifyClose" class="open-tabs-btn notify-close"><span class="local">__MSG_notifyBtnClose__</span></div>
        </div>
      </div>
  `);
  if (promoteType === 'manual') {
    elemPopup = createElementFromHTML(`
    <div class="notify-popup" id="notifyPopup">
      <div class="notify-popup-descr local">__MSG_notifyTopDescription__</div>
        <img src="https://hattifn4ttar.github.io/supportfreemedia/images/img128_2.png" alt="Promote YouTube Playlist" class="logo">
        <div class="notify-popup-text">
          <div class="notify-popup-title local">__MSG_notifyTitle__</div>
        </div>
        <div class="notify-popup-playlist local">__MSG_notifyPlaylist__ ` + playlistUrl + `</div>

        <div class="notify-popup-buttons">
          <div id="notifyOpenManual" class="open-tabs-btn"><span class="local">__MSG_notifyBtnManual__</span></div>
          <div id="notifyClose" class="open-tabs-btn notify-close"><span class="local">__MSG_notifyBtnClose__</span></div>
        </div>
      </div>
  `);
  }
  document.body.appendChild(elemPopup);
  setTimeout(() => localizeHtmlPage(), 10);

  setTimeout(() => {
    if (promoteType === 'manual') {
      document.getElementById('notifyOpenManual').addEventListener('click', () => startScript(0));
      document.getElementById('notifyClose').addEventListener('click', () => closePopup());
    } else {
      document.getElementById('notifyOpen1').addEventListener('click', () => startScript(1));
      document.getElementById('notifyOpen3').addEventListener('click', () => startScript(3));
      document.getElementById('notifyOpen2').addEventListener('click', () => startScript(2));
      document.getElementById('notifyClose').addEventListener('click', () => closePopup());
    }
  }, 1000);
}




setTimeout(() => checkNotify(), 3000);

async function checkNotify() {

  const notifyTime = await getFromStorage('notifyTime');
  const notifiedDate = await getFromStorage('notifiedDate') || '';
  const notifyDisabled = await getFromStorage('notifyDisabled');

  const currentTime = new Date().toLocaleTimeString();
  const currentDate = (new Date().toISOString()).substring(0, 10);

  if (notifyTime || (!notifyTime && !notifyDisabled)) {
    let [hrSaved, minutesSaved] = notifyTime?.split(':') || [0,0];
    hrSaved = Number(hrSaved);
    hrSaved = hrSaved == 12 ? 0 : hrSaved;
    minutesSaved = Number(minutesSaved);

    let [hrCurrent, minutesCurrent, rest] = currentTime.split(':');
    hrCurrent = rest.includes('PM') ? Number(hrCurrent) + 12 : Number(hrCurrent);
    hrCurrent = hrCurrent == 12 ? 0 : hrCurrent;
    minutesCurrent = Number(minutesCurrent);

    if (currentDate > notifiedDate && (hrCurrent > hrSaved || minutesCurrent >= minutesSaved && hrCurrent >= hrSaved)) {
      // update settings before opening notifications popup
      updateSettings();
      //  would be better to detect page change instead of timeout
      setTimeout(() => showNotificationPopup(), 2000);
    }
  }
}
