// ----------------------------------------------------------
// this part of the code is responsible for "Playlist" option
// ----------------------------------------------------------


// -- start helpers -----------------------------------------
function getVideoStartB(video) {
  // get random length
  const randomMultiplier = (0.5 + Math.random() * 1);
  let watchTimeSec = Math.floor(randomMultiplier * 60 + 100, 0); // random time + ads
  // watchTimeSec = 10; // for debugging

  // get video duration
  let timer1 = video?.children[0]?.children[1]?.children[0]?.children[0]?.children[2]?.children[1]?.children[1];
  let timer2 = video?.children[0]?.children[0]?.children[0]?.children[2]?.children[2]?.children[1];
  let timer3 = video?.children[1]?.children[0]?.children[0]?.children[0]?.children[2]?.children[2]?.children[1];
  let timer = timer1?.innerHTML || timer2?.innerHTML || timer3?.innerHTML;
  if (!timer) return [watchTimeSec, 0, 0];
  const timeArr = timer.replaceAll(' ', '').replaceAll('\n', '').split(':');
  if (timeArr.length === 2) timeArr.unshift(0);
  let [hours, minutes, seconds] = timeArr;
  seconds = Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);

  // get start time
  watchTimeSec = Math.min(watchTimeSec, seconds);
  const startSeconds = seconds - watchTimeSec;
  return [watchTimeSec, startSeconds, seconds];
}
function muteVideoOnce() {
  console.log('MUTEONCE');
  // trying secong version of mute, the first one doesn't work for some users
  // need to clean unused props
  document.dispatchEvent(new KeyboardEvent('keydown', {
    altKey: false,
    bubbles: true,
    cancelBubble: false,
    cancelable: true,
    charCode: 0,
    code: "KeyM",
    composed: true,
    ctrlKey: false,
    currentTarget: null,
    defaultPrevented: false,
    detail: 0,
    eventPhase: 0,
    isComposing: false,
    key: "m",
    keyCode: 77,
    location: 0,
    metaKey: false,
    repeat: false,
    returnValue: true,
    shiftKey: false
  }));
}
// -- end helpers ------------------------------



async function playNextVideoB(openTab, muteFlag) {
  // ply next video in a tab
  // video is open through url instead of click, to be able to set start time
  // also there is a concern about event.isTrusted, shoul we avoid using e.click()?

  let tabIndex = (new URLSearchParams(window.location.search)).get('ti');
  let videoIndex = (new URLSearchParams(window.location.search)).get('vi');
  let offset = (new URLSearchParams(window.location.search)).get('offset');
  let nTabs = (new URLSearchParams(window.location.search)).get('nTabs');
  let loopLength = (new URLSearchParams(window.location.search)).get('ll');
  tabIndex = isNaN(Number(tabIndex)) ? 0 : Number(tabIndex);
  videoIndex = isNaN(Number(videoIndex)) ? 0 : Number(videoIndex);
  offset = isNaN(Number(offset)) ? 0 : Number(offset);
  nTabs = isNaN(Number(nTabs)) ? 3 : Number(nTabs);
  loopLength = isNaN(Number(loopLength)) ? 3 : Number(loopLength);

  setTimeout(() => {
    console.log('nextTab:', tabIndex, muteFlag);
    if (muteFlag) muteVideoOnce();
    setTimeout(() => muteVideo(), 500);
    likeVideo();
  }, 2000);

  setTimeout(async () => {
    let tabs = await chrome.storage.local.get('tabs');
    tabs = tabs.tabs;
    console.log('tabs:', tabIndex, tabs);

    // loop videos in the save tab
    const newVideoIndex = (videoIndex + 1) % loopLength;
    const watchTime = tabs[tabIndex][newVideoIndex]?.watchTime || 40;
    let newUrl = tabs[tabIndex][newVideoIndex].url;
    newUrl = newUrl.replace('&openPTab=1', '');
    setTimeout(() => { location.replace(newUrl); }, 1000 * watchTime);

    // open new tab if not all of them were opened yet
    if (openTab && tabIndex + 1 < tabs.length) {
      window.open(tabs[tabIndex + 1][0].url);
    }
  }, 4000);
}



function openPlaylist() {
  // open playlist again and wait to load videos, then generate videos list for all tabs
  let nTabs = (new URLSearchParams(window.location.search)).get('nTabs');
  nTabs = isNaN(Number(nTabs)) ? 3 : Number(nTabs);

  setTimeout(async () => {
    // grap elements from the playlist
    const videos1 = document.getElementsByClassName('yt-simple-endpoint style-scope ytd-playlist-panel-video-renderer'); 
    const videos2 = document.querySelectorAll("ytd-playlist-video-renderer.style-scope.ytd-playlist-video-list-renderer");
    let videos = videos1.length ? [...videos1] : [...videos2];
    if (!videos.length) {
      chrome.storage.local.set({ playlistType: null });
      chrome.storage.local.set({ videos: [] });
      return;
    }

    const urls = [...videos].map((v, i) => {
      const [watchTime, startTime, duration] = getVideoStartB(v);
      // get video start from storage, othersize calculate random time
      const randomMultiplier = (0.5 + Math.random() * 1);
      const validWatchTime = (isNaN(watchTime) || !watchTime) ? Math.floor(randomMultiplier * 60 + 100, 0) : watchTime;
      const validStartTime = isNaN(startTime) ? 0 : startTime;
      let url = v.href || v?.children[1]?.children[0]?.children[0]?.children[0]?.href;
      return { url: url + '&t=' + validStartTime + 's', watchTime: validWatchTime, duration };
    });

    if (!urls.length) {
      alert('Cannot find videos. Open YouTube playlist.');
      return;
    }

    let maxN = Math.min(urls.length, 300);
    loopLength = Math.floor(maxN / nTabs, 0) || 1;

    // generate list of videos for each tab and save to storage
    let tabs = [];
    for (let tIndex = 0; tIndex < nTabs; tIndex += 1) {
      let offset = tIndex * loopLength;
      let tabUrls = urls.slice(offset, offset + loopLength);
      tabUrls = tabUrls.map((v, vIndex) => {
        return {
          duration: v.duration,
          watchTime: v.watchTime,
          url: v.url + '&promotePlaylist=1&offset=' + offset + '&ll=' + loopLength + ('&ti=' + tIndex) + (!vIndex ? '&openPTab=1' : '') + '&vi=' + vIndex,
          };
      });
      tabs.push(tabUrls);
    }
    chrome.storage.local.set({ tabs });

    // open first tab
    setTimeout(() => {
      console.log('open:', tabs[0][0].url);
      window.open(tabs[0][0].url + '&mute=1');
    }, 100);

  }, 5000);
}


if (window.location.href.includes('&openPlaylistFirstTab=1')) {
  openPlaylist();
}


// passing parameters through url, may need to rework - sometimes parameters are lost
const openTabFlag = window.location.search.includes('&openPTab=1');
const playFlag = window.location.search.includes('&promotePlaylist=1');
const muteFlagB = window.location.search.includes('&mute=1');
if (playFlag) {
  setTimeout(() => { playNextVideoB(openTabFlag, muteFlagB); }, 100);
}

