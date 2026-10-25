

const burger = document.querySelector(".burger");
const navLinks = document.querySelector(".nav-links");

burger.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("active");

    burger.setAttribute("aria-expanded", isOpen);

    burger.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
    );
});

/* Close the menu after a navigation link is clicked */
navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        burger.setAttribute("aria-expanded", "false");
        burger.setAttribute("aria-label", "Open navigation menu");
    });
});

/* Theme toggle button placeholder */
const themeToggle = document.querySelector(".theme-toggle");

themeToggle.addEventListener("click", () => {
    // We will add the actual dark/light mode functionality later.
    console.log("Dark/light mode toggle clicked.");
});




const images = document.querySelectorAll(".right img");

const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("fade-visible");
        } else {
            entry.target.classList.remove("fade-visible");
        }
    });
}, {
    threshold: 0,
    rootMargin: "100px 0px 100px 0px"
});

images.forEach((img) => {
    imageObserver.observe(img);
});


const testimonialSlider = document.querySelector(".testimonial-slider");
const testimonialTrack = document.querySelector(".testimonial-track");
const testimonialCards = document.querySelectorAll(".testimonial-card");
const prevButton = document.querySelector(".testimonial-arrow.prev");
const nextButton = document.querySelector(".testimonial-arrow.next");
const dotsContainer = document.querySelector(".testimonial-dots");

if (
    testimonialSlider &&
    testimonialTrack &&
    testimonialCards.length &&
    prevButton &&
    nextButton &&
    dotsContainer
) {
    let currentIndex = 0;
    let autoplay;

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    // Create navigation dots.
    testimonialCards.forEach((card, index) => {
        const dot = document.createElement("button");

        dot.type = "button";
        dot.className = "testimonial-dot";
        dot.setAttribute("aria-label", `Show testimonial ${index + 1}`);

        dot.addEventListener("click", () => {
            showTestimonial(index);
            restartAutoplay();
        });

        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll(".testimonial-dot");

    function showTestimonial(index) {
        currentIndex =
            (index + testimonialCards.length) % testimonialCards.length;

        testimonialTrack.style.transform =
            `translateX(-${currentIndex * 100}%)`;

        dots.forEach((dot, dotIndex) => {
            const isActive = dotIndex === currentIndex;

            dot.classList.toggle("active", isActive);

            if (isActive) {
                dot.setAttribute("aria-current", "true");
            } else {
                dot.removeAttribute("aria-current");
            }
        });
    }

    function nextTestimonial() {
        showTestimonial(currentIndex + 1);
    }

    function previousTestimonial() {
        showTestimonial(currentIndex - 1);
    }

    function stopAutoplay() {
        clearInterval(autoplay);
    }

    function startAutoplay() {
        stopAutoplay();

        if (!reducedMotion.matches && !document.hidden) {
            autoplay = setInterval(nextTestimonial, 5000);
        }
    }

    function restartAutoplay() {
        startAutoplay();
    }

    nextButton.addEventListener("click", () => {
        nextTestimonial();
        restartAutoplay();
    });

    prevButton.addEventListener("click", () => {
        previousTestimonial();
        restartAutoplay();
    });

    // Pause automatic sliding while the visitor interacts.
    testimonialSlider.addEventListener("mouseenter", stopAutoplay);
    testimonialSlider.addEventListener("mouseleave", startAutoplay);
    testimonialSlider.addEventListener("focusin", stopAutoplay);
    testimonialSlider.addEventListener("focusout", startAutoplay);

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            stopAutoplay();
        } else {
            startAutoplay();
        }
    });

    // Allow touch swiping on mobile.
    let touchStartX = 0;
    let touchStartY = 0;

    testimonialSlider.addEventListener("touchstart", event => {
        touchStartX = event.changedTouches[0].clientX;
        touchStartY = event.changedTouches[0].clientY;
    }, { passive: true });

    testimonialSlider.addEventListener("touchend", event => {
        const deltaX = event.changedTouches[0].clientX - touchStartX;
        const deltaY = event.changedTouches[0].clientY - touchStartY;

        if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX < 0) {
                nextTestimonial();
            } else {
                previousTestimonial();
            }

            restartAutoplay();
        }
    }, { passive: true });

    reducedMotion.addEventListener?.("change", startAutoplay);

    // Display the first review.
    showTestimonial(0);
    startAutoplay();
}



const whyImage = document.querySelector(".why-image");

if (whyImage) {
    const imageObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    whyImage.classList.add("fade-visible");
                } else {
                    whyImage.classList.remove("fade-visible");
                }
            });
        },
        {
            threshold: 0,
            rootMargin: "0px 0px 0px 0px"
        }
    );

    imageObserver.observe(whyImage);
}


(() => {
    function initThemeToggle() {
        const themeToggle = document.querySelector(".theme-toggle");

        if (!themeToggle) {
            return;
        }

        // Load the saved theme safely
        let savedTheme = "dark";

        try {
            savedTheme = localStorage.getItem("cryptovest-theme") || "dark";
        } catch (error) {
            console.warn("Could not access saved theme:", error);
        }

        document.body.classList.toggle(
            "light-mode",
            savedTheme === "light"
        );

        // Update the button icon and accessibility label
        function updateThemeButton() {
            const isLightMode =
                document.body.classList.contains("light-mode");

            themeToggle.textContent = isLightMode ? "☾" : "☀";

            themeToggle.setAttribute(
                "aria-label",
                isLightMode
                    ? "Switch to dark mode"
                    : "Switch to light mode"
            );
        }

        updateThemeButton();

        // Prevent duplicate event listeners
        if (themeToggle.dataset.themeInitialized === "true") {
            return;
        }

        themeToggle.dataset.themeInitialized = "true";

        // Switch themes when clicked
        themeToggle.addEventListener("click", () => {
            const isLightMode =
                document.body.classList.toggle("light-mode");

            try {
                localStorage.setItem(
                    "cryptovest-theme",
                    isLightMode ? "light" : "dark"
                );
            } catch (error) {
                console.warn("Could not save theme:", error);
            }

            updateThemeButton();
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initThemeToggle,
            { once: true }
        );
    } else {
        initThemeToggle();
    }
})();
