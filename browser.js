// Change this to "true" if you are developing locally
const isDev = "false";

// Query the elements we need from the DOM
const form = document.querySelector("form");
const urlInput = document.querySelector("[data-url-input]");
const imageHolder = document.querySelector("[data-image-holder]");
const imageHolderTitle = document.querySelector("[data-image-holder-title]");
const loader = document.querySelector("[data-loader]");
const error = document.querySelector("[data-error]");

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

function showError() {
  error.style.display = "block";
}

function hideError() {
  error.style.display = "none";
}

// Get a possible page param to prefill the urlInput field
const urlParams = new URLSearchParams(window.location.search);

if (urlParams.has("page")) {
  urlInput.value = urlParams.get("page");
}

// Call out to the serverless function on form submit
form.addEventListener("submit", async (event) => {
  // prevent usual HTML form submit
  event.preventDefault();

  hideError();

  // update the page url param to reflect the form submission
  const newUrlParams = new URLSearchParams(window.location.search);
  newUrlParams.set("page", urlInput.value);

  // update the push state so we can navigate back / forwards between
  // different URLs
  window.history.pushState(
    {},
    "",
    `${window.location.pathname}?${decodeURIComponent(newUrlParams)}`
  );

  clearImageHolder();
  showLoader();

  try {
    await fetch(`/api/screenshot?page=${urlInput.value}&isDev=${isDev}`)
      .then((response) => {
        if (response.status === 500) {
          hideLoader();
          showError();
          return;
        }

        return response.blob();
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob);

        // build up the image element with the url
        const newImageEl = buildImageElement(url);
        imageHolderTitle.style.display = "block";

        // add the new element to the DOM
        imageHolder.appendChild(newImageEl);
        hideLoader();
      });
  } catch (error) {
    showError();
  }
});
