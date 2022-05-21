// show extension button in YouTube page, in the top bar
// mostly a duplicate of popup.js + popup.html
// in progress

// show a button in the top bar --------------------------------------------------
const btnHtml = `
  <div id="extensionButtonWrap">
    <div id="extensionButton" title="Support Free Media extension">
      <img src="https://hattifn4ttar.github.io/supportfreemedia/images/img128_2.png" alt="Promote YouTube Playlist" class="extension-button__logo">
    </div>
  </div>
`;

function showExtensionButton() {
  const buttonExists = document.getElementById('extensionButton');

  const topBarButtons = document.querySelectorAll('#end #buttons');
  if (!buttonExists && topBarButtons?.length && topBarButtons[0].children?.length) {
    const firstButton = topBarButtons[0].children[0];
    const newButton = createElementFromHTML(btnHtml);
    topBarButtons[0].insertBefore(newButton, firstButton);
    newButton.addEventListener('click', showExtensionPopup);
  }
  // show the button again when changing url
  setTimeout(() => showExtensionButton(), 500);
}

setTimeout(() => showExtensionButton(), 400);
// end show button



// show a popup with settings --------------------------------------------------------
const popupHtml = `
  <div class="extension-popup" id="extentionPopupWrap">
    <div class="openchannels-popup">
      <div>
        <div class="ytsupport-top">
          <div class="ytsupport-title local">__MSG_popupTitle__</div>
          <div class="ytsupport-descr local">__MSG_popupTitleDescr__</div>
        </div>
        <div class="logo_settings">
          <img src="https://hattifn4ttar.github.io/supportfreemedia/images/img128_2.png" alt="Promote YouTube Playlist">
        </div>
        <div class="extension-popup-close" id="extensionPopupClose">
          x
        </div>
      </div>
      <br />

      <form id="formLike">
        <p>
          <input type="time" id="time" name="time" min="00:00" max="24:00" class="timepicker">
          <span class="time-remove" id="timeRemoveBtn">x</span>
          <label for="time" class="local">__MSG_popupSchedule__</label><br />
        </p>
        <br />
        <br />
        <p class="promote-type-checkbox">
          <label for="promoteType" class="local">__MSG_popupAutoplayCheckbox__</label>
          <input type="checkbox" id="promoteType" name="promoteType">
        </p>

        <div class="promoteDetailsAuto">
          <div class="local promote-instructions">__MSG_popupPlaytypeLabel__</div>
        </div>
        <div class="promoteDetailsManual">
          <div class="promote-details-li local">__MSG_popupManual1__</div>
        </div>
        <div class="playlist-radiobuttons-container">
          <!--
          <div class="promoteDetailsAuto">
            <input type="radio" id="channels" name="playType" value="channels">
            <label for="channels" class="local">__MSG_popupPlaytypeOptChannel__</label><br />
          </div>
          -->
          <div id="radiobuttonsPlaylist"></div>
        </div>

        <div class="promoteDetailsAuto">
          <div class="buttons2">
            <div id="clickopentabs3" class="open-tabs-btn local">__MSG_popupBtnTabs3__</div>
            <div id="clickopentabs2" class="open-tabs-btn local">__MSG_popupBtnTabs2__</div>  
            <div id="clickopentabs1" class="open-tabs-btn local">__MSG_popupBtnTabs1__</div>
          </div>
        </div>
        <div class="promoteDetailsManual">
          <div class="promote-details-li local">__MSG_popupManual2__</div>
          <div class="promote-details-li local">__MSG_popupManual3__</div>
          <div class="buttons">
            <div id="clickOpenPlaylist" class="open-tabs-btn local">__MSG_popupManualBtn__</div>
          </div>
        </div>
      </form>
      <br />
      <!--<button id="clickReset" class="open-tabs-btn">Reset</button>  -->

      <div class="links-bottom">
        <a id="messagesLink"><span class="local">__MSG_popupMessagesLink__</span> <span class="expand-icon">^</span></a>&nbsp; &nbsp; &nbsp;
        <a target="_blank" href="https://hattifn4ttar.github.io/supportfreemedia/" id="webLink">About</a>&nbsp; &nbsp; &nbsp;
        <a target="_blank" href="https://github.com/hattifn4ttar/youtube_supportfreemedia" id="githubLink">GitHub</a>
      </div>
      <script src="popup.js"></script> 
    </div>
    <div id="popupMessagesSection" class="popup-messages-container"></div>
  </div>
`;

async function closeSettingsPopup() {
  let popupElem = document.getElementsByClassName('extension-popup');
  if (popupElem?.length) [...popupElem].forEach(e => e.remove());
}

function addEventListeners() {
  document.getElementById('clickopentabs1').addEventListener('click', () => startScript(1));
  document.getElementById('clickopentabs3').addEventListener('click', () => startScript(3));
  document.getElementById('clickopentabs2').addEventListener('click', () => startScript(2));
  document.getElementById('clickOpenPlaylist').addEventListener('click', () => startScript(0));
  document.getElementById('timeRemoveBtn').addEventListener('click', clearTime);
  document.getElementById('extensionPopupClose').addEventListener('click', closeSettingsPopup);

  // form change
  let formLike = document.getElementById('formLike');
  if (formLike) {
    formLike.addEventListener('change', async (event) => {
      console.log('ev:', event?.target?.name, event?.target?.value);
      // notifications time
      if (event?.target?.name === 'time') {
        chrome.storage.sync.set({ notifyTime: event?.target?.value });
        chrome.storage.sync.set({ notifiedDate: null });
      }
      if (event?.target?.name === 'promoteType') {
        const promoteType = event.target.checked ? 'auto' : 'manual';
        chrome.storage.sync.set({ promoteType });
        selectPromoteType(promoteType);
      }
      // radio buttons
      if (event?.target?.name === 'playType') {
        chrome.storage.sync.set({ playType: event.target.value });
      }
      // edit playlist url
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
}

async function showExtensionPopup() {
  const topBarButtons = document.querySelectorAll('#end #buttons');
  const popupExists = document.getElementById('extentionPopupWrap');

  if (popupExists) {
    closeSettingsPopup();
  }

  if (!popupExists && topBarButtons?.length) {
    // update recommented playlists
    sendRequest('playlists.json', async (json) => {
      if (json?.length) chrome.storage.sync.set({ playlists: json });
    });

    // get button position
    const buttonExists = document.getElementById('extensionButton');
    const pos = buttonExists.getBoundingClientRect();

    const popupElem = createElementFromHTML(popupHtml);
    if (pos?.x > 500) popupElem.style.left = (pos.x - 448) + 'px';
    topBarButtons[0]?.parentElement?.appendChild(popupElem);
    showSavedPlaylists();
    setTimeout(() => setForm(), 0);

    setTimeout(() => localizeHtmlPage(), 10);
    setTimeout(() => addEventListeners(), 500);
    setTimeout(() => showMessages(), 1000);
  }
}




// copy from popup.js ---------------------------------------------------------------------
// update playlists in popup
async function showSavedPlaylists() {
  let playlists = await getFromStorage('playlists');
  playlists = playlists?.length ? playlists : playlistsDefault;

  const elem = document.getElementById('radiobuttonsPlaylist');
  if (elem) {
    let playlistsCustom = await getFromStorage('playlistsCustom') || [];
    playlistsCustom = playlistsCustom.filter(p => p.url && getUrlValid(p.url));
    const nPlaylists = playlistsCustom.length + 1;
    playlistsCustom.push({ id: nPlaylists, name: 'Custom_' + nPlaylists, url: '' });
    chrome.storage.sync.set({ playlistsCustom });

    playlists.forEach((p, i) => {
      let elemRadio = createElementFromHTML(`
        <div class="playlist-radio-default playlist-radio-item">
          <input type="radio" id="` + p.url + '" name="playType" value="' + p.url + `">
          <label for="` + p.url + `" class="playlist-radio">
            ` + p.name + `:
            <a class="defaultplaylist-link" target="_blank" href="` + p.url + '" id="' + p.name + '_link">' + p.url.replace('https://', '') + `</a>
          </label>
        </div>
      `);
      elem.appendChild(elemRadio);
    });
    playlistsCustom.forEach((p, i) => {
      let elemRadio = createElementFromHTML(`
        <div class="playlist-radio-custom playlist-radio-item">
          <input type="radio" id="` + p.url + '" name="playType" value="' + p.url + `">
          <label for="` + p.url + `" class="playlist-radio playlist-radio_custom">
            <a class="defaultplaylist-link" target="_blank" id="` + p.name + '_link">' + p.name + `:</a>
            <input type="text" class="playlist-link-edit" id="` + p.name + '" name="' + p.name + '" placeholder="Edit" value="' + p.url.replace('https://', '') + `">
          </label>
        </div>
      `);
      elem.appendChild(elemRadio);
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


function selectPromoteType(tabName) {
  let type1, type2;

  type2 = document.getElementsByClassName(tabName === 'manual' ? 'promoteDetailsAuto' : 'promoteDetailsManual');
  type1 = document.getElementsByClassName(tabName === 'manual' ? 'promoteDetailsManual' : 'promoteDetailsAuto');

  [...type1].forEach(d => { d.style.display = 'inline-block'; d.style.maxHeight = 'none'; d.style.maxWidth = 'none'; });
  [...type2].forEach(d => { d.style.display = 'none'; d.style.maxHeight = 0; d.style.maxWidth = 0; });
}

function clearTime() {
  document.getElementById('time').value = '';
  chrome.storage.sync.set({ notifyDisabled: true });
  chrome.storage.sync.set({ notifyTime: null });
}

async function startScript(nTabs) {
  // open the start page based on user preferences
  const playType = await getFromStorage('playType');
  console.log('selected:', nTabs, playType);
  // return;

  chrome.storage.local.set({ nTabs });
  let manual = !nTabs;

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
  window.open(url, '_blank');
}

