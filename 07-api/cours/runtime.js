function addCopyButtons(_slideshow) {
    const ICON = '<i class="fa-regular fa-clipboard"></i>';
    document.querySelectorAll("code.remark-code").forEach((code) => {
        const button = document.createElement("button");
        button.innerHTML = ICON;
        button.classList.add("copy-button");
        button.title = "Copier dans le presse-papier";

        const wrapper = document.createElement("div");
        wrapper.style.position = "relative";
        code.parentNode.insertBefore(wrapper, code);
        wrapper.appendChild(code);
        wrapper.appendChild(button);

        button.addEventListener("click", () => {
            navigator.clipboard.writeText(code.innerText).then(() => {
                button.innerHTML = "✔️ Copié !";
                setTimeout(() => { button.innerHTML = ICON; }, 2000);
            });
        });
    });
}

function defineKeybindings(slideshow) {
    document.addEventListener("keydown", (event) => {
        // Shift+Space = previous slide
        if (event.shiftKey && event.code === "Space") {
            event.preventDefault();
            event.stopImmediatePropagation();
            slideshow.gotoPreviousSlide();
        }
        // Cmd+Right = last slide
        if (event.metaKey && event.code === "ArrowRight") {
            event.preventDefault();
            event.stopImmediatePropagation();
            slideshow.gotoLastSlide();
        }
        // Cmd+Left = first slide
        if (event.metaKey && event.code === "ArrowLeft") {
            event.preventDefault();
            event.stopImmediatePropagation();
            slideshow.gotoFirstSlide();
        }
    });
}

function runSlideshow(mdFile) {
    console.log(`Running slideshow: ${mdFile}`);
    const slideshow = remark.create(
        {
            ratio: "16:9",
            countIncrementalSlides: false,
            highlightLines: true,
            navigation: { scroll: false },
            sourceUrl: mdFile,
        },
        addCopyButtons,
    );
    defineKeybindings(slideshow);
}

window.runSlideshow = runSlideshow;
