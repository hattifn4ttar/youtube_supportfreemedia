// show messages from content creators, if any

async function toggleMessagesVisible() {
  const messagesVisible = await getFromStorage('messagesVisible');
  const newVisible = !messagesVisible;
  chrome.storage.sync.set({ messagesVisible: newVisible });
  const elemContainer = document.getElementById('popupMessages');
  if (elemContainer) elemContainer.style.display = newVisible ? 'block' : 'none';
  if (newVisible) {
    const elemMessages = document.getElementById('popupMessages');
    if (!elemMessages) { showMessages(); }
  }
}

// show popups and buttons
function createElementFromText(htmlString) {
  const div = document.createElement('div');
  div.textContent = htmlString.trim();
  return div.firstChild;
}

async function addMessages(messages) {
  const elemContainer = document.getElementById('popupMessagesSection');

  if (elemContainer && !messages?.length) {
    const message = createElementFromHTML('<div class="popup-messages" id="popupMessages"><div>No messages found</div></div>');
    elemContainer.appendChild(message);
  }
  if (elemContainer && messages.length) {
    const elemContainerWrap = createElementFromHTML('<div class="popup-messages" id="popupMessages"></div>');
    elemContainer.appendChild(elemContainerWrap);
    messages.sort((a, b) => a.date < b.date ? 1 : (a.date == b.date ? 0 : -1));
    // const messages = [{ author: 'default', date: '2022-05-21T20:31:41.976Z', message: 'Hi there, see this pic -<br /> <img src="https://hattifn4ttar.github.io/supportfreemedia/images/img128_2.png" alt="test">' }];
    messages.forEach((d, ii) => {
      const date = new Date(d.date);
      const now = new Date();
      const sameDay = date && date.toLocaleDateString() == now.toLocaleDateString();
      // if (date) date.setSeconds(0, 0);
      const messageDate = date ? ((sameDay ? '' : date.toLocaleDateString()) + ' ' + date.toLocaleTimeString()) : '';
      const elemMessage = createElementFromHTML(`
        <div class="popup-message">
          <div><b>` + (d.author_name || d.author) + '</b> &middot; ' + messageDate + `</div>
          <div id="message_text_` + ii + `"></div>
          <div id="message_img_` + ii + `"></div>
        </div>
      `);
      elemContainerWrap.appendChild(elemMessage);
      const messageText = document.getElementById('message_text_' + ii);
      if (messageText) messageText.appendChild(createElementFromText(d.message_text));
      const messageImg = document.getElementById('message_img_' + ii);
      if (messageImg && d.message_img_url) {
        const img = createElementFromHTML('<img alt="">');
        img.src = d.message_img_url;
        messageImg.appendChild(img);
      }
    });
  }
}

// show messages from content creators
async function showMessages() {
  sendRequest('messages_default.json', async (json) => {
    const messages = json;
    const elemContainer = document.getElementById('popupMessagesSection');
    const toggleLink = document.getElementById('messagesLink');

    if (toggleLink && messages?.length) {
      toggleLink.style.visibility = 'visible';
      toggleLink.addEventListener('click', toggleMessagesVisible);
    }

    const messagesVisible = await getFromStorage('messagesVisible');

    if (!messagesVisible) {
      const elemMessages = document.getElementById('popupMessages');
      if (elemMessages) elemMessages.style.display = 'none';
    }
    if (messagesVisible) {
      addMessages(messages);
    }
  });
}
