// show notifications
let defaultURL = 'https://www.youtube.com/playlist?list=PLQxYKug91T31ixyCs81TwIl8wAiD9AZAH';

async function startScript(nTabs) {
   // open the start page based on user preferences
   let playType = await chrome.storage.sync.get('playType');
   playType = playType.playType;
 
   chrome.storage.local.set({ nTabs });
   chrome.storage.sync.set({ notifiedDate: (new Date().toISOString()).substring(0, 10) });
 
   let manual = !nTabs;
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
  let playType = await chrome.storage.sync.get('playType');
  playType = playType.playType;

  console.log('[stopwar] NOTIFY:');
  let elemPopup = createElementFromHTML(`
      <div class="notify-popup" id="notifyPopup">
        <div class="notify-popup-descr local">__MSG_notifyTopDescription__</div>
        <img src="https://hattifn4ttar.github.io/supportfreemedia/images/img128_2.png" alt="Promote YouTube Playlist" class="logo">
        <div class="notify-popup-text">
          <div class="notify-popup-title local">__MSG_notifyTitle__</div>
        </div>
        <div class="notify-popup-playlist local">__MSG_notifyPlaylist__  ` + playType?.replace('https://', '') + `</div>

        <div class="notify-popup-buttons">
          <button id="notifyOpen3" class="open-tabs-btn"><span class="local">__MSG_notifyBtnTabs3__</span></button>  
          <button id="notifyOpen2" class="open-tabs-btn"><span class="local">__MSG_notifyBtnTabs2__</span></button>  
          <button id="notifyOpen1" class="open-tabs-btn"><span class="local">__MSG_notifyBtnTabs1__</span></button>
          <button id="notifyClose" class="open-tabs-btn notify-close"><span class="local">__MSG_notifyBtnClose__</span></button>
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
        <div class="notify-popup-playlist local">__MSG_notifyPlaylist__ ` + playType?.replace('https://', '') + `</div>

        <div class="notify-popup-buttons">
          <button id="notifyOpenManual" class="open-tabs-btn"><span class="local">__MSG_notifyBtnManual__</span></button>
          <button id="notifyClose" class="open-tabs-btn notify-close"><span class="local">__MSG_notifyBtnClose__</span></button>
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
    let [hrSaved, minutesSaved] = notifyTime?.split(':') || [0,0];
    hrSaved = Number(hrSaved);
    hrSaved = hrSaved == 12 ? 0 : hrSaved;
    minutesSaved = Number(minutesSaved);

    let [hrCurrent, minutesCurrent, rest] = currentTime.split(':');
    hrCurrent = rest.includes('PM') ? Number(hrCurrent) + 12 : Number(hrCurrent);
    hrCurrent = hrCurrent == 12 ? 0 : hrCurrent;
    minutesCurrent = Number(minutesCurrent);

    if (currentDate > notifiedDate && (hrCurrent > hrSaved || minutesCurrent >= minutesSaved && hrCurrent >= hrSaved)) {
      showNotificationPopup();
    }
  }
}