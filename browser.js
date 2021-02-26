//TODO

// save image, copy image, view in new tab etc



// Change this to "true" if you are developing locally
const isDev = "false";

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

submitButton.addEventListener("click", async (event) => {
  clearImageHolder();
  showLoader();
  event.preventDefault();

  await fetch(`/api/screenshot?page=${urlInput.value}&isDev=${isDev}`)
    .then((response) => response.blob())
    .then((blob) => {
      const url = URL.createObjectURL(blob);
      const newImageEl = buildImageElement(url);
      imageHolderTitle.style.display = "block";
      imageHolder.appendChild(newImageEl);
      hideLoader();
    });
});
