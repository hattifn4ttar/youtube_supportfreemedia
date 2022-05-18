// highlight like button for selected channels (config.js)

highlightLikeButton();

function removeHighlightLike() {
  const likeBtnBkg = document.getElementsByClassName('like-btn-highlight');
  const likeBtnClose = document.getElementsByClassName('like-btn-close');
  if (likeBtnClose?.length) [...likeBtnClose].forEach(e => { e.remove(); });
  if (likeBtnBkg?.length) [...likeBtnBkg].forEach(e => { e.remove(); });
}

function highlightLikeButton() {
  setTimeout(async () => {
    const channel = document.querySelector(".ytd-video-secondary-info-renderer .ytd-channel-name > .ytd-channel-name > a.yt-formatted-string");
    const likeBtnAdded = document.getElementsByClassName('like-btn-highlight');
    const highlightLike = channelsOriginal.find(d => d.url === channel?.href);

    const likeUrl = await getFromStorageLocal('likeUrl');
    const likeUrlSkip = await getFromStorageLocal('likeUrlSkip');
    if (likeUrl === window.location.href && !(highlightLike && !likeBtnAdded?.length && likeUrlSkip !== window.location.href)) {
      setTimeout(() => highlightLikeButton(), 100);
      return;
    }

    // remove if already added
    removeHighlightLike();

    // add element to highlight like btn
    if (highlightLike) {
      const likeBtn = document.querySelector('.ytd-video-primary-info-renderer .ytd-menu-renderer.force-icon-button.style-text:first-child');
      console.log('[stopwar] HIGHLIGHT:', channel?.href, likeBtn?.onClick);
      if (likeBtn) likeBtn.addEventListener('click', () => { highlightComment(); }, false);

      if (likeBtn?.children?.length) {
        let elem = likeBtn?.children[0]?.children[0];
        let elemAdd = document.createElement('div');
        elemAdd.setAttribute('id', 'likeBtnHighlight');
        elemAdd.classList.add('like-btn-highlight');
        let elemClose = document.createElement('div');
        elemClose.classList.add('like-btn-close');
        elemClose.innerText = 'x';
        elemClose.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          let elemAdd2 = document.getElementById('likeBtnHighlight');
          if (elemAdd2) elemAdd2.remove();
          chrome.storage.local.set({ likeUrlSkip: window.location.href });
        });
        elemAdd.appendChild(elemClose);
        elem.appendChild(elemAdd);
        chrome.storage.local.set({ likeUrl: window.location.href });
      }
    }
    setTimeout(() => highlightLikeButton(), 100);
  }, 2000);
}

const defaultComments = [
  { "ru": "Нет войне", "en": "" },
  { "ru": "Cпасибо за правду!", "en": "" },
  { "ru": "Cпасибо за вашу работу", "en": "" },
  { "ru": "Cвободу политзаключенным!", "en": "" },
];

// highlightComment();
async function highlightComment() {
  const commentBtn = document.getElementById('commentHighlight');
  if (commentBtn) return;

  // load comments suggestions
  const comments = await getFromStorageLocal('commentsSuggestions') || defaultComments;
  const commentsText = comments.map(d => d.ru).join(' \n');

  setTimeout(async () => {
    const channel = document.querySelector(".ytd-video-secondary-info-renderer .ytd-channel-name > .ytd-channel-name > a.yt-formatted-string");

    // add element to highlight like btn
    let highlightElem = document.getElementById('commentHighlight');
    if (!highlightElem) {
      console.log('[stopwar] COMMENT:', channel.href);

      let actionBtn = document.querySelector('.ytd-watch-flexy #meta-contents');
      if (actionBtn) {
        let elem = actionBtn;
        let elemAdd = document.createElement('div');
        elemAdd.setAttribute('id', 'commentHighlight');
        elemAdd.classList.add('comment-highlight');
        let elemText = document.createElement('div');
        elemText.classList.add('comment-highlight-text');
        elemText.innerText = 'Примеры комментариев: \n' + commentsText;

        let elemClose = document.createElement('div');
        elemClose.classList.add('comment-close');
        elemClose.innerText = 'x';
        elemClose.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          let elemAdd2 = document.getElementsByClassName('comment-highlight');
          if (elemAdd2?.length) [...elemAdd2].forEach(d => d.remove());
          chrome.storage.local.set({ likeUrlSkip: window.location.href });
        });
        elemAdd.appendChild(elemClose);
        elemAdd.appendChild(elemText);
        elem.after(elemAdd);
        chrome.storage.local.set({ likeUrl: window.location.href });
      }
    }
    setTimeout(() => highlightLikeButton(), 100);
  }, 10);
}
