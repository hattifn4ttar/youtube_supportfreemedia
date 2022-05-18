// load settings from GitHub
// liset of channels, playlists, comments suggestions, etc
// it takes 1-7 days to publish a new version in Chrome Store - need some flexibility without updating the version

async function updateSettings() {
  let now = new Date();

  sendRequest('playlistSettings.json', async (json) => {
    console.log('[stopwar] UPDATE SETTINS:', json);
    if (json?.comments?.length > 2) chrome.storage.local.set({ commentsSuggestions: json.comments });
    chrome.storage.local.set({ lastUpdDateSettings: now.toISOString() });
  });

  sendRequest('channels.json', async (json) => {
    console.log('[stopwar] UPDATE CHANNELS:', json);
    if (json?.length) chrome.storage.local.set({ channels: json });
    chrome.storage.local.set({ lastUpdDateSettings: now.toISOString() });
  });
}

// update settings every hour when YT is open
async function checkUpdateSettings() {
  let now = new Date();
  const lastUpdDate = await getFromStorageLocal('lastUpdDateSettings') || null;
  // console.log('last update:', lastUpdDate);

  if (!lastUpdDate || (lastUpdDate && (new Date(lastUpdDate)) && (now.getTime() - (new Date(lastUpdDate)).getTime()) > 1000 * 3600)) {
    updateSettings();
  }
  setTimeout(() => checkUpdateSettings(), 20 * 1000);
}

checkUpdateSettings();
