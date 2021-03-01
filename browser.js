//TODO

// save image, copy image, view in new tab etc

// Change this to "true" if you are developing locally
const isDev = "true";

// Query the elements we need from the DOM
const submitButton = document.querySelector("[data-button]");
const urlInput = document.querySelector("[data-url-input]");
const imageHolder = document.querySelector("[data-image-holder]");
const imageHolderTitle = document.querySelector("[data-image-holder-title]");
const loader = document.querySelector("[data-loader]");

function buildImageElement(url) {
  const imageEl = document.createElement("img");
  imageEl.setAttribute("src", url);
  imageEl.setAttribute("id", "generatedImage");
  return imageEl;
}

function clearImageHolder() {
  const imageEl = document.getElementById("generatedImage");
  if (imageEl) {
    imageHolderTitle.style.display = "none";
    imageEl.remove();
  }
}

function showLoader() {
  loader.style.display = "block";
}

function hideLoader() {
  loader.style.display = "none";
}

// Call out to the serverless function on click of the button
submitButton.addEventListener("click", async (event) => {
  clearImageHolder();
  showLoader();

  await fetch(`/api/screenshot?page=${urlInput.value}&isDev=${isDev}`)
    .then((response) => response.blob())
    .then((blob) => {
      const url = URL.createObjectURL(blob);

      // build up the image element with the url
      const newImageEl = buildImageElement(url);
      imageHolderTitle.style.display = "block";

      // add the new element to the DOM
      imageHolder.appendChild(newImageEl);
      hideLoader();
    });
});
