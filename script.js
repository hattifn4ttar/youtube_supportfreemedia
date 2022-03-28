const channelsOriginal = [
  { id: 1, url: 'https://www.youtube.com/c/MackNack', videoDurationMin: 20, subsThousand: 400, name: 'Майкл Наки (Michael Naki)' },
  { id: 2, url: 'https://www.youtube.com/c/dwrussian', videoDurationMin: 20, subsThousand: 900, name: 'DW' },
  { id: 3, url: 'https://www.youtube.com/channel/UCL1rJ0ROIw9V1qFeIN0ZTZQ', videoDurationMin: 20, subsThousand: 730, name: 'Екатерина Шульман (Ekaterina Shulman)' },
  { id: 4, url: 'https://www.youtube.com/c/%D0%92%D0%BB%D0%B0%D0%B4%D0%B8%D0%BC%D0%B8%D1%80%D0%9C%D0%B8%D0%BB%D0%BE%D0%B2%D0%A3%D1%80%D1%83%D1%80%D1%83', videoDurationMin: 20, subsThousand: 300, name: 'Владимир Милов (Vladimir Milov)' },
  { id: 5, url: 'https://www.youtube.com/c/NavalnyLiveChannel', videoDurationMin: 20, subsThousand: 2500 * 0.7, name: 'Навальный LIVE (Navalny LIVE)' },
  { id: 6, url: 'https://www.youtube.com/channel/UCzaqqlriSjVyc795m86GVyg', videoDurationMin: 20, subsThousand: 300, name: 'Yulia Latynina' },
  { id: 7, url: 'https://www.youtube.com/channel/UC7Elc-kLydl-NAV4g204pDQ', videoDurationMin: 10, subsThousand: 600, name: 'Popular Politics' },
  { id: 8, url: 'https://www.youtube.com/c/khodorkovskyru', videoDurationMin: 10, subsThousand: 1000, name: 'Михаил Ходорковский (Michail Khodorkovsky)' },
  { id: 9, url: 'https://www.youtube.com/channel/UC54SBo5_usXGEoybX1ZVETQ', videoDurationMin: 15, subsThousand: 700, name: 'Дмитрий ПОТАПЕНКО (Dimitry Potapenko)' },
  { id: 10, url: 'https://www.youtube.com/channel/UCoHH5raTevyI35tfb1YF6qA', videoDurationMin: 10, subsThousand: 950, name: 'Илья Яшин (Ilya Yashin)' },
  { id: 11, url: 'https://www.youtube.com/c/NovayagazetaRu', videoDurationMin: 5, subsThousand: 470, name: 'Новая газета (Novaya Gazeta)' },
  { id: 12, url: 'https://www.youtube.com/c/%D0%9E%D0%B1%D0%BC%D0%B0%D0%BD%D1%83%D1%82%D1%8B%D0%B9%D0%A0%D0%BE%D1%81%D1%81%D0%B8%D1%8F%D0%BD%D0%B8%D0%BD', videoDurationMin: 5, subsThousand: 600, name: 'Обманутый Россиянин' },
  { id: 13, url: 'https://www.youtube.com/c/SvobodaRadio', videoDurationMin: 2, subsThousand: 1600 * 0.5, name: 'Радио Свобода (Radio Freedon)' },
  { id: 14, url: 'https://www.youtube.com/channel/UCfD6O-n4-Sw7r3xci7YStgg', videoDurationMin: 2, subsThousand: 4, name: 'Альянс учителей (Teachers Community)' },
  { id: 15, url: 'https://www.youtube.com/c/TheInsiderVideo', videoDurationMin: 5, subsThousand: 77, name: 'The Insider' },
  { id: 16, url: 'https://www.youtube.com/channel/UC0p3rxtSGCnO-JjBz5bU5CQ', videoDurationMin: 10, subsThousand: 100, name: 'Котрикадзе Дзядко (Kotrikadze Dzyadko)' },
  // { id: 17, url: 'https://www.youtube.com/channel/UCBG57608Hukev3d0d-gvLhQ', videoDurationMin: 10, subsThousand: 2400 * 0.5, name: 'Настоящее Время (Current Time TV)' },
  // { id: 18, url: 'https://www.youtube.com/c/maxkatz1', videoDurationMin: 15, subsThousand: 990, name: 'Максим Кац (Max Katz)' },
  // { id: 19, url: 'https://www.youtube.com/c/%D0%90%D0%BB%D0%B5%D0%BA%D1%81%D0%B5%D0%B9%D0%9D%D0%B0%D0%B2%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9', videoDurationMin: 5, subsThousand: 6400 * 0.25, name: 'Алексей Навальный (Aleksey Navalny)' },
  // { id: 20, url: 'https://www.youtube.com/channel/UC1eFXmJNkjITxPFWTy6RsWg', videoDurationMin: 10, subsThousand: 2800 * 0.5, name: 'Редакция' },
];
let watchTime = 1000 * 60;
let startTime = new Date();
let loopLength = 15;
let muteFlag1 = false;



// -- start helpers -----------------------------------
function getLoggedIn() {
  let signInBtn = document.getElementsByClassName('style-scope ytd-button-renderer style-suggestive size-small');
  if (signInBtn.length && [...signInBtn].find(d => d.innerText === 'Sign in')) return false;
  return true;
}
async function likeVideo() {
  let like = await chrome.storage.local.get('supportYTLike');
  like = like.supportYTLike;

  console.log('LIKE:', like);
  if (!getLoggedIn() || !like) return;
  let videoBtns = document.getElementsByClassName('style-scope ytd-video-primary-info-renderer');
  videoBtns = videoBtns[0]?.children[5]?.children[2]?.children[0]?.children[0]?.children[0];
  const likeBtn = videoBtns?.children[0];
  // console.log('like:', likeBtn, likeBtn?.classList);
  if (likeBtn?.classList && !likeBtn.classList.contains('style-default-active')) {
    likeBtn.click();
  }
  commentVideo();  
}
function commentVideo() {
  // in progress
}
function scrollVideo() {
  // in progress
}
function muteVideo() {
  const muteBtn = document.getElementsByClassName('ytp-mute-button ytp-button');
  console.log('MUTE', muteBtn);
  if (muteBtn?.length && muteBtn[0] && muteBtn[0].title?.indexOf('Mute') === 0) {
    muteBtn[0].click();
  }
}
function changeVideoQuality() {
  window.focus()
  const btn = document.getElementsByClassName('ytp-button ytp-settings-button');
  if (btn.length) {
    btn[0].cilck();
  }
}
function getVideoStart(video) {
  // get random length
  const randomMultiplier = (0.5 + Math.random() * 1);
  let watchTimeSec = Math.floor(randomMultiplier * 100 + 30, 0); // random time + adds
  // watchTimeSec = 10;
  // get video duration
  let timer = video?.children[0]?.children[1]?.children[0]?.children[0]?.children[2]?.children[1]?.children[1]?.innerHTML;
  if (!timer) return [0, watchTimeSec];
  const timeArr = timer.replaceAll(' ', '').split(':');
  if (timeArr.length === 2) timeArr.unshift(0);
  let [hours, minutes, seconds] = timeArr;
  seconds = Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);

  // get start time
  const startSeconds = seconds - watchTimeSec;
  return [startSeconds, watchTimeSec];
}
// -- end helpers -------------------------




function nextVideo() {
  let index = (new URLSearchParams(window.location.search)).get('index');
  let offset = (new URLSearchParams(window.location.search)).get('offset');
  videoIndex = index ? Number(index) : 0;
  offset = offset ? Number(offset) : 0;
  offset = 0;

  setTimeout(() => {
    // this timeout is just to see console output
    const videos = document.getElementsByClassName('yt-simple-endpoint style-scope ytd-playlist-panel-video-renderer'); 
    let [startTime, watchTimeSec] = getVideoStart(videos[videoIndex]);
    loopLength = Math.min(loopLength, videos.length);

    // loop n videos
    let ii = videoIndex;
    ii = ii < offset ? offset : ii;
    ii = offset + ((ii - offset) % loopLength);
    ii = ii % videos.length;

    const video = videos[ii];
    getVideoStart(video);
    muteVideo();
    likeVideo();

    setTimeout(() => {
      video.click(); // changing url is not reliable
      nextVideo();
    }, 1000 * (watchTimeSec + 3));
  }, 2000);
}

function clickPlayAll() {
  let playBtn = document.getElementById('play-button');
  let membersOnlyContent = document.getElementsByClassName('style-scope ytd-shelf-renderer');
  membersOnlyContent = membersOnlyContent.length && [...membersOnlyContent].find(d => d.innerText === 'Members-only videos');

  if (!membersOnlyContent && playBtn && playBtn.children[0]) {
    playBtn = playBtn.children[0]?.children[0];
    if (playBtn) { playBtn.click(); }
    else { return false };

    setTimeout(() => { 
      nextVideo();     
    }, 1000);
    return true;
  } else {
    return false;
  }
}

function openChannel(channel) {
  // Open channel's playlist
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
              const videos = document.getElementsByClassName('yt-simple-endpoint style-scope ytd-playlist-panel-video-renderer'); 
              nextVideo();     
            }, 1000);
          }, 700);
        }, 500);
      }

    }, 500);
  }
}

function goToChannel() {
  // Open channels one by one
  let tabIndex = (new URLSearchParams(window.location.search)).get('tabIndex');
  let chOffset = (new URLSearchParams(window.location.search)).get('chOffset');
  let nTabs = (new URLSearchParams(window.location.search)).get('nTabs');
  tabIndex = isNaN(Number(tabIndex)) ? 0 : Number(tabIndex);
  chOffset = isNaN(Number(chOffset)) ? 0 : Number(chOffset);
  nTabs = isNaN(Number(nTabs)) ? 3 : Number(nTabs);

  setTimeout(() => {
    const channel = channelsOriginal.find(d => d.id == tabIndex) || channelsOriginal[0];
    if (!tabIndex) {
      chOffset = Math.floor(Math.random() * (channelsOriginal.length));
      // chOffset = 0;
    } else {
      openChannel(channel);
    }

    let newTabIndex = tabIndex + 1;
    let openNewTab = newTabIndex <= nTabs;

    let newChannelID = (chOffset + tabIndex + 1) % channelsOriginal.length;
    const channelNew = channelsOriginal[newChannelID];
    if (openNewTab) {
      console.log('openNew:', chOffset, tabIndex, newChannelID, window.location.search, channelNew);
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



const openNew = window.location.search.includes('openNew=1');
muteFlag1 = window.location.search.includes('&mute=1');
if (openNew) {
  goToChannel(muteFlag1);
}
const urlContinuePlylist = window.location.search.includes('continuePromote=1');
if (urlContinuePlylist) {
  nextVideo();
}
