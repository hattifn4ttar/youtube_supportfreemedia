// -- start helpers -----------------------------------
function getVideoStart2(video) {
  // get random length
  const randomMultiplier = (0.5 + Math.random() * 1);
  let watchTimeSec = Math.floor(randomMultiplier * 60 + 100, 0); // random time + ads
  // watchTimeSec = 10; // for testing

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
// -- end helpers -------------------------



// loop videos in one tab
async function continuePlaylist(openTab) {
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
    console.log('nextTab:', tabIndex);
    muteVideo();
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

    // open new tab
    if (openTab && tabIndex + 1 < tabs.length) {
      window.open(tabs[tabIndex + 1][0].url);
    }
  }, 2000);
}



// first tab only
function openFirstTab() {
  let nTabs = (new URLSearchParams(window.location.search)).get('nTabs');
  nTabs = isNaN(Number(nTabs)) ? 3 : Number(nTabs);

  setTimeout(async () => {
    // get video url and start time
    // works for these urls:
    // #1 https://www.youtube.com/playlist?list=PL55RiY5tL51rrgq6xi67Mc6cwOHXw_nB1 someone else's playlist
    // #2 https://www.youtube.com/playlist?list=PLQxYKug91T31ixyCs81TwIl8wAiD9AZAH created by me
    // #3 https://www.youtube.com/watch?v=70RmF0rPj9o&list=PLQxYKug91T31ixyCs81TwIl8wAiD9AZAH when video is open
    // #4 https://www.youtube.com/watch?v=B7_17cbaBKM&list=UUUGfDbfRIx51kJGGHIFo8Rw playlist from channel
    // doesn't work for 
    // #5 https://www.youtube.com/playlist?list=PLbZIPy20-1pN7mqjckepWF78ndb6ci_qi same as #1? second tab doesn't open
    // #6 https://www.youtube.com/watch?v=hT_nvWreIhg&list=PLbZIPy20-1pN7mqjckepWF78ndb6ci_qi same as #3? even first tab doesn't open
    const videos1 = document.getElementsByClassName('yt-simple-endpoint style-scope ytd-playlist-panel-video-renderer'); 
    const videos2 = document.querySelectorAll("ytd-playlist-video-renderer.style-scope.ytd-playlist-video-list-renderer");

    let videos = videos1.length ? [...videos1] : [...videos2];
    // videos = videos.slice(0, 12);
    if (!videos.length) {
      chrome.storage.local.set({ playlistType: null });
      chrome.storage.local.set({ videos: [] });
      return;
    }

    const urls = [...videos].map((v, i) => {
      const [watchTime, startTime, duration] = getVideoStart2(v);
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
    console.log('tabsFirstLoad:', tabs);

    setTimeout(() => {
      console.log('open:', tabs[0][0].url);
      window.open(tabs[0][0].url); // for debugging
      // location.replace(tabs[0][0].url);
    }, 100);

  }, 5000);
}

// &openFirstTab=1 is lost in url for https://www.youtube.com/watch?v=hT_nvWreIhg&list=PLbZIPy20-1pN7mqjckepWF78ndb6ci_qi&t=125s
// &openTab=1 is lost in url for https://www.youtube.com/playlist?list=PLbZIPy20-1pN7mqjckepWF78ndb6ci_qi
const loc = window.location.href;
setTimeout(() => console.log('href:', loc), 3000);

if (window.location.href.includes('&openPlaylistFirstTab=1')) {
  openFirstTab();
}
// end first tab


const openTab = window.location.search.includes('&openPTab=1');
const play = window.location.search.includes('&promotePlaylist=1');
if (play) {
  setTimeout(() => { continuePlaylist(openTab); }, 100);
}
