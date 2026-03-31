// the remarkjs callback is called with the slideshow as parameter
function add_copy_buttons(_slideshow) {
  const BUTTON = '<i class="fa-regular fa-clipboard"></i>';
  // console.log("adding copy buttons");
  document.querySelectorAll("code.remark-code").forEach((code) => {
      // console.log("adding copy button for code block");
      // Create the button
      let button = document.createElement("button");
      button.innerHTML = BUTTON;
      button.classList.add("copy-button");
      button.title = "copy to clipboard";

      // Wrap pre in a relative div for positioning
      let wrapper = document.createElement("div");
      wrapper.style.position = "relative";
      code.parentNode.insertBefore(wrapper, code);
      wrapper.appendChild(code);
      wrapper.appendChild(button);

      // Copy function
      button.addEventListener("click", () => {
          let contents = code.innerText;
          navigator.clipboard.writeText(contents).then(() => {
              button.innerHTML = "✔️ Copied!";
              setTimeout(() => button.innerHTML = BUTTON, 2000);
          });
      });
  });
}

function define_keybindings(slideshow) {

  // shift-space = previous slide
  document.addEventListener("keydown", function (event) {
    if (event.shiftKey && event.code === "Space") {
      event.preventDefault();
      event.stopImmediatePropagation();
      slideshow.gotoPreviousSlide();
    }
  });

  // command -> = last slide
  document.addEventListener("keydown", function (event) {
    if (event.metaKey && event.code === "ArrowRight") {
      event.preventDefault();
      event.stopImmediatePropagation();
      slideshow.gotoLastSlide();
    }
  });

  // command <- = first slide
  document.addEventListener("keydown", function (event) {
    if (event.metaKey && event.code === "ArrowLeft") {
      event.preventDefault();
      event.stopImmediatePropagation();
      slideshow.gotoFirstSlide();
    }
  });
}

function run_slideshow(md_file) {

  console.log(`running slideshow ${md_file}`);
  const slideshow = remark.create({
      ratio: "16:9",
      countIncrementalSlides: false,
      highlightLines: true,
      navigation: {
        scroll: false,
      },
      sourceUrl: md_file,
    },
    // this callback is called with slideshow as a parameter
    // once it is ready - or so I guess
    add_copy_buttons
  );

  define_keybindings(slideshow);
}

// expose globally so we can use it in the global context (e.g. from the HTML)
console.log("exposing run_slideshow globally");
window.run_slideshow = run_slideshow;
