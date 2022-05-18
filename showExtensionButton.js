// show extension button in YouTube page, in the top bar

// in progress
/*
const btnHtml = createElementFromHTML(`
<div>
  <div id="extensionButton" title="Support Free Media extension">
    <img src="https://hattifn4ttar.github.io/supportfreemedia/images/img128_2.png" alt="Promote YouTube Playlist" class="extension-button__logo">
  </div>
</div>
`);

const popupHtml = createElementFromHTML(`
<div>

</div>
`);

function showExtensionButton() {
  const buttonExists = document.getElementById('extensionButton');

  const topBarButtons = document.querySelectorAll('#end #buttons');
  if (!buttonExists && topBarButtons?.length && topBarButtons[0].children?.length) {
    const firstButton = topBarButtons[0].children[0];
    console.log('top:', firstButton);
    topBarButtons[0].insertBefore(btnHtml, firstButton);
  }

  // show the button again when changing url
  setTimeout(() => showExtensionButton(), 400);
}

setTimeout(() => showExtensionButton(), 2000);
*/
