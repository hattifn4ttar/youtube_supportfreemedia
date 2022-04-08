// -----------------------------------------------------------------
// this part of the code is responsible for "Open by channel" option
// -----------------------------------------------------------------
// list of independent channels is in config.js
let loopLength = 15; // when opening by channel, play 15 recent uploads


// -- start helpers -----------------------------------
function getLoggedIn() {
  let signInBtn = document.getElementsByClassName('style-scope ytd-button-renderer style-suggestive size-small');
  if (signInBtn.length && [...signInBtn].find(d => d.innerText === 'Sign in')) return false;
  return true;
}

async function likeVideo() {
  let like = await chrome.storage.local.get('supportYTLike');
  like = like.supportYTLike;

  console.log('[stopwar] LIKE:', like);
  if (!getLoggedIn() || !like) return;
  let videoBtns = document.getElementsByClassName('style-scope ytd-video-primary-info-renderer');
  videoBtns = videoBtns[0]?.children[5]?.children[2]?.children[0]?.children[0]?.children[0];
  const likeBtn = videoBtns?.children[0];
  if (likeBtn?.classList && !likeBtn.classList.contains('style-default-active')) {
    likeBtn.click();
  }
}

function muteVideo() {
  const muteBtn = document.getElementsByClassName('ytp-mute-button ytp-button');
  console.log('[stopwar] MUTE:', muteBtn);
  if (muteBtn?.length && muteBtn[0] && muteBtn[0].title?.indexOf('Mute') === 0) {
    muteBtn[0].click();
  }
}

function getVideoStart(video) {
  // get random watch time
  const randomMultiplier = (0.5 + Math.random() * 1);
  let watchTimeSec = Math.floor(randomMultiplier * 100 + 30, 0); // random time + adds
  // watchTimeSec = 15;

  // get video duration
  let timer = video?.children[0]?.children[1]?.children[0]?.children[0]?.children[2]?.children[1]?.children[1]?.innerHTML;
  if (!timer) return [0, watchTimeSec];
  const timeArr = timer.replaceAll(' ', '').split(':');
  if (timeArr.length === 2) timeArr.unshift(0);
  let [hours, minutes, seconds] = timeArr;
  seconds = Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);

  // get start time
  const startSeconds = seconds - watchTimeSec;
  return [watchTimeSec, startSeconds];
}
// -- end helpers -------------------------




function playNextVideo() {
  let index = (new URLSearchParams(window.location.search)).get('index');
  let offset = (new URLSearchParams(window.location.search)).get('offset');
  videoIndex = index ? Number(index) : 0;
  offset = offset ? Number(offset) : 0;
  offset = 0;

  setTimeout(() => {
    // this timeout is just to see console output
    const videos = document.getElementsByClassName('yt-simple-endpoint style-scope ytd-playlist-panel-video-renderer'); 
    let [watchTimeSec] = getVideoStart(videos[videoIndex]);
    loopLength = Math.min(loopLength, videos.length);

    // loop n videos
    let ii = videoIndex;
    ii = ii < offset ? offset : ii;
    ii = offset + ((ii - offset) % loopLength);
    ii = ii % videos.length;
    console.log('[stopwar] NEXT:', ii, watchTimeSec);

    const video = videos[ii];
    muteVideo();
    likeVideo();

    setTimeout(() => {
      // open next video with click, but it may not be reliable
      video.click();
      playNextVideo();
    }, 1000 * (watchTimeSec + 3));
  }, 2000);
}

function clickPlayAll() {
  // click "Play All" button if found on the screen
  let playBtn = document.getElementById('play-button');
  let membersOnlyContent = document.getElementsByClassName('style-scope ytd-shelf-renderer');
  membersOnlyContent = membersOnlyContent.length && [...membersOnlyContent].find(d => d.innerText === 'Members-only videos');

  if (!membersOnlyContent && playBtn && playBtn.children[0]) {
    playBtn = playBtn.children[0]?.children[0];
    if (playBtn) { playBtn.click(); }
    else { return false };

    setTimeout(() => { 
      playNextVideo();     
    }, 1000);
    return true;
  }
  return false;
}

function startPlayChannel() {
  // open channel, find a playlist button
  let videoIndex = 0;

  const hasPlayAllButtonHome = clickPlayAll(videoIndex);

  if (!hasPlayAllButtonHome)  {
    const tabsEl = document.getElementById('tabsContent');
    if (tabsEl) {
      tabsEl.children[3].click();
    }

    setTimeout(async () => {
      const hasPlayAllButtonVideos = clickPlayAll(videoIndex);
      if (!hasPlayAllButtonVideos) {

        let elem = document.getElementById('trigger');
        elem.click();
        setTimeout(() => {
          let dd = document.getElementsByClassName('yt-dropdown-menu yt-simple-endpoint');
          dd[0].click();
          
          setTimeout(() => {
            const playBtn = document.getElementById('play-button');
            playBtn.children[0].children[0].click();

            setTimeout(() => {
              playNextVideo();     
            }, 1000);
          }, 700);
        }, 500);
      }

    }, 500);
  }
}

async function openChannelPage() {
  // Open channels one by one
  let tabIndex = (new URLSearchParams(window.location.search)).get('tabIndex');
  let chOffset = (new URLSearchParams(window.location.search)).get('chOffset');
  tabIndex = isNaN(Number(tabIndex)) ? 0 : Number(tabIndex);
  chOffset = isNaN(Number(chOffset)) ? 0 : Number(chOffset);
  let nTabs = await chrome.storage.local.get('nTabs');
  nTabs = nTabs.nTabs;

  setTimeout(() => {
    const channelsToPlay = channelsOriginal.filter(d => d.play);
    const channel = channelsToPlay.find(d => d.id == tabIndex) || channelsToPlay[0];
    if (!tabIndex) {
      chOffset = Math.floor(Math.random() * (channelsToPlay.length));
    } else {
      startPlayChannel(channel);
    }

    let newTabIndex = tabIndex + 1;
    let openNewTab = newTabIndex <= nTabs;

    let newChannelID = (chOffset + tabIndex + 1) % channelsToPlay.length;
    const channelNew = channelsToPlay[newChannelID];
    if (openNewTab) {
      // console.log('openNew:', chOffset, tabIndex, newChannelID, window.location.search, channelNew);
      setTimeout(() => {
        let newUrl = channelNew.url + '?openNew=1&tabIndex=' + newTabIndex + '&loop=1&nTabs=' + nTabs + '&chOffset=' + chOffset;
        if (tabIndex == 0) {
          location.replace(newUrl);
        } else {
          window.open(newUrl);
        }
      }, 3000);
    }
  }, 4000);
}


// passing parameters through url, need to rework - sometimes parameters are lost in url
const openNewFlag = window.location.search.includes('openNew=1');
const muteFlag = window.location.search.includes('&mute=1');
if (openNewFlag) {
  openChannelPage(muteFlag);
}
const continuePlaylistFlag = window.location.search.includes('continuePromote=1');
if (continuePlaylistFlag) {
  playNextVideo();
}

