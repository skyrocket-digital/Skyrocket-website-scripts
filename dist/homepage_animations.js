//Initialize required global variables
var Webflow = Webflow || [];
let sliderTitles = null;
let lottieAnimations = null;
// Return a promise that resolves to true once animation is loaded
async function animationLoaded(animation) {
    if (animation.isLoaded) return true;

    return new Promise((resolve, reject) => {
        animation.addEventListener('DOMLoaded', () => resolve(true));
    })
}

// Return a promise that resolves to true once all animations are loaded
async function waitForAnimationsLoaded(animations) {
    await Promise.all(lottieAnimations.map(animationLoaded))
}

//Initialize validation of Lottie animations in the site.
async function InitAnimations() {
    lottie = Webflow.require('lottie').lottie
    lottieAnimations = lottie.getRegisteredAnimations()
    await waitForAnimationsLoaded(lottieAnimations)
}

const IsCircleLottie = (lottie) => {
    return lottie.wrapper.className === "lottie-full";
}

const ResetAtFrame = (time, titleSlide) => {
    let _animation = lottieAnimations.find(IsCircleLottie)
    _animation.currentRawFrame = time;
    _animation.play();

    /*Extra bit to controll the titles rotating*/
    if (sliderTitles) {
        sliderTitles.style.marginLeft = `${titleSlide}%`;
        sliderTitles.style.opacity = 0;
        setTimeout(sliderTitles.style.opacity = 1, 300);
    }
}

Webflow.push(() => {
    InitAnimations()
    .then(() => {
        ResetAtFrame(0, 0)
        InitializeTabsSlider();
    })
    .catch((error) => console.error(error))
})

const rotateLeft = (_tabMenu) => {
    var $prev = _tabMenu.querySelector(".w--current").previousElementSibling;
    if ($prev) $prev.click();
    else _tabMenu.lastChild.click();
    
}

const rotateRight = (_tabMenu) => {
    var $next = _tabMenu.querySelector(".w--current").nextElementSibling;
    if ($next) $next.click();
    else _tabMenu.firstChild.click();
}

const InitializeTabsSlider = () => {
    Webflow.push(function () {
        //Allow site to load in case there's any extra integrations that require it
        setTimeout(function () {
            let tabsComponent = document.querySelector("[sr-tabslider-element='tabs']");
            sliderTitles = document.querySelector("[sr-tabslider-element='slider-titles']")
            let prevBtn = document.querySelector("[sr-tabslider-element='prev']")
            let nextBtn = document.querySelector("[sr-tabslider-element='next']")
            // Validate we have the minimum required components to continue.
            if (tabsComponent) {
                let timeout = tabsComponent.getAttribute("sr-tabslider-speed") || 5000;
                let tabBtns = tabsComponent.querySelector("[sr-tabslider-element='menu']");

                if(!tabBtns) return;

                var _tabButtons = Array.from(tabBtns.children);

                const tabLoop = (_tabMenu, timeout) => {
                    tabTimeout = setTimeout(rotateRight, timeout, _tabMenu);
                }

                // Fix for Safari
                if (navigator.userAgent.includes("Safari")) {
                    _tabButtons.forEach((t) => (t.focus = function () {
                        const x = window.scrollX, y = window.scrollY;
                        const f = () => {
                            setTimeout(() => window.scrollTo(x, y), 1);
                            t.removeEventListener("focus", f)
                        };
                        t.addEventListener("focus", f);
                        HTMLElement.prototype.focus.apply(this, arguments)
                    }));
                }

                // Reset Loops
                _tabButtons.forEach((_tabBtn, i) => {
                    _tabBtn.addEventListener('click', function (e) {
                        e.preventDefault();
                        clearTimeout(tabTimeout);
                        tabLoop(tabBtns, timeout);
                        ResetAtFrame(((i * 74) + i), (i * -100))
                    }, false);
                })

                // Start Tabs
                var tabTimeout;
                clearTimeout(tabTimeout);
                tabLoop(tabBtns, timeout);

                prevBtn.addEventListener('click', (e) => {
                    rotateLeft(tabBtns)
                }, false);
                nextBtn.addEventListener('click', () => rotateRight(tabBtns), false);

                //Animation reset when entering to the section
                var triggerSection = document.querySelector('[sr-positiontrigger-element="container"]');
                let posObserverTriggered = false;

                var iObserver = new IntersectionObserver(function (entries) {
                    entries.forEach(function (entry) {
                        if (entry.intersectionRatio > 0) {
                            //reset slider
                            posObserverTriggered = true;
                            clearTimeout(tabTimeout);
                            tabLoop(tabBtns, timeout);
                            ResetAtFrame(0, 0)
                        } else {
                            // Remove listener as it has run oncew
                            if (posObserverTriggered) {
                                iObserver.disconnect();
                            }
                        }
                    });
                });
                //initialize observer.
                iObserver.observe(triggerSection);
            }
        }, 500)
    });
}
let speed = 0;

function wrapWords(str) {
    speed += 0.025;
    return str.replace(/\w+|[^\w\s]+/g, (match) => `<span style="animation-delay:${speed}s;-webkit-animation-delay:${speed}">${match}</span>`);
}

const InitializeTextAnimation = (elem) => {
    const textAnims = (!elem) ? document.querySelectorAll('[sr-textanim-element="text"]') : elem.querySelectorAll('[sr-textanim-element="text"]')
    let wasLoaded = (!elem) ? false : elem.getAttribute('sr-textanim-loaded') || false;
    if (!wasLoaded) {
        textAnims.forEach(_elem => {
            speed = 0;
            const elemWords = _elem.innerText.split(" ");
            let elemSpanned = elemWords.map(e => {
                return wrapWords(e)
            })
            _elem.innerHTML = elemSpanned.join(" ");
        })
        if (elem) elem.setAttribute('sr-textanim-loaded', true);
    }
    if (elem) elem.classList.add("active");
}

//Reactivate for adding the text animations back
//document.addEventListener("DOMContentLoaded", InitializeTextAnimation());
