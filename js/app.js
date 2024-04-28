(() => {
    "use strict";
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(webP.height == 2);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = support === true ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    let bodyLockStatus = true;
    let bodyLockToggle = (delay = 500) => {
        if (document.documentElement.classList.contains("lock")) bodyUnlock(delay); else bodyLock(delay);
    };
    let bodyUnlock = (delay = 500) => {
        if (bodyLockStatus) {
            const lockPaddingElements = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                lockPaddingElements.forEach((lockPaddingElement => {
                    lockPaddingElement.style.paddingRight = "";
                }));
                document.body.style.paddingRight = "";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 500) => {
        if (bodyLockStatus) {
            const lockPaddingElements = document.querySelectorAll("[data-lp]");
            const lockPaddingValue = window.innerWidth - document.body.offsetWidth + "px";
            lockPaddingElements.forEach((lockPaddingElement => {
                lockPaddingElement.style.paddingRight = lockPaddingValue;
            }));
            document.body.style.paddingRight = lockPaddingValue;
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function menuInit() {
        if (document.querySelector(".icon-menu")) document.addEventListener("click", (function(e) {
            if (bodyLockStatus && e.target.closest(".icon-menu")) {
                bodyLockToggle();
                document.documentElement.classList.toggle("menu-open");
            }
        }));
    }
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    class DynamicAdapt {
        constructor(type) {
            this.type = type;
        }
        init() {
            this.оbjects = [];
            this.daClassname = "_dynamic_adapt_";
            this.nodes = [ ...document.querySelectorAll("[data-da]") ];
            this.nodes.forEach((node => {
                const data = node.dataset.da.trim();
                const dataArray = data.split(",");
                const оbject = {};
                оbject.element = node;
                оbject.parent = node.parentNode;
                оbject.destination = document.querySelector(`${dataArray[0].trim()}`);
                оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
                оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
                оbject.index = this.indexInParent(оbject.parent, оbject.element);
                this.оbjects.push(оbject);
            }));
            this.arraySort(this.оbjects);
            this.mediaQueries = this.оbjects.map((({breakpoint}) => `(${this.type}-width: ${breakpoint}px),${breakpoint}`)).filter(((item, index, self) => self.indexOf(item) === index));
            this.mediaQueries.forEach((media => {
                const mediaSplit = media.split(",");
                const matchMedia = window.matchMedia(mediaSplit[0]);
                const mediaBreakpoint = mediaSplit[1];
                const оbjectsFilter = this.оbjects.filter((({breakpoint}) => breakpoint === mediaBreakpoint));
                matchMedia.addEventListener("change", (() => {
                    this.mediaHandler(matchMedia, оbjectsFilter);
                }));
                this.mediaHandler(matchMedia, оbjectsFilter);
            }));
        }
        mediaHandler(matchMedia, оbjects) {
            if (matchMedia.matches) оbjects.forEach((оbject => {
                this.moveTo(оbject.place, оbject.element, оbject.destination);
            })); else оbjects.forEach((({parent, element, index}) => {
                if (element.classList.contains(this.daClassname)) this.moveBack(parent, element, index);
            }));
        }
        moveTo(place, element, destination) {
            element.classList.add(this.daClassname);
            if (place === "last" || place >= destination.children.length) {
                destination.append(element);
                return;
            }
            if (place === "first") {
                destination.prepend(element);
                return;
            }
            destination.children[place].before(element);
        }
        moveBack(parent, element, index) {
            element.classList.remove(this.daClassname);
            if (parent.children[index] !== void 0) parent.children[index].before(element); else parent.append(element);
        }
        indexInParent(parent, element) {
            return [ ...parent.children ].indexOf(element);
        }
        arraySort(arr) {
            if (this.type === "min") arr.sort(((a, b) => {
                if (a.breakpoint === b.breakpoint) {
                    if (a.place === b.place) return 0;
                    if (a.place === "first" || b.place === "last") return -1;
                    if (a.place === "last" || b.place === "first") return 1;
                    return 0;
                }
                return a.breakpoint - b.breakpoint;
            })); else {
                arr.sort(((a, b) => {
                    if (a.breakpoint === b.breakpoint) {
                        if (a.place === b.place) return 0;
                        if (a.place === "first" || b.place === "last") return 1;
                        if (a.place === "last" || b.place === "first") return -1;
                        return 0;
                    }
                    return b.breakpoint - a.breakpoint;
                }));
                return;
            }
        }
    }
    const da = new DynamicAdapt("max");
    da.init();
    blockForm();
    function blockForm() {
        let footerButton = document.querySelector(".footer__button");
        footerButton.addEventListener("click", block);
        function block(e) {
            e.preventDefault();
        }
    }
    cardContentEqualizer(".galery__room-name");
    cutHeader();
    realPreloader();
    if (window.innerWidth > 450) cardContentEqualizer(".info-card__title");
    document.addEventListener("touchstart", touchHover);
    document.addEventListener("touchend", touchHover);
    window.addEventListener("resize", globalResizer);
    function realPreloader() {
        let images = document.images;
        let imagesCount = images.length;
        let loadCount = 0;
        let percent;
        let loadDisplay = document.getElementById("loader");
        for (let i = 0; i < imagesCount; i++) {
            let imageClone = new Image;
            imageClone.onload = imageLoaded;
            imageClone.onerror = imageLoaded;
            imageClone.src = images[i].src;
        }
        function imageLoaded() {
            loadCount++;
            percent = 100 / imagesCount * loadCount << 0;
            loadDisplay.innerText = `${percent}%`;
            if (loadCount >= imagesCount) {
                setTimeout(addload, 1e3);
                function addload() {
                    document.body.classList.add("loaded");
                }
            }
        }
    }
    function touchHover(e) {
        if (e.type == "touchstart") {
            addHover("a");
            addHover("button");
            function addHover(x) {
                if (e.target.closest(x)) {
                    let hoverTarget = e.target.closest(x);
                    hoverTarget.classList.add("hover");
                }
            }
        }
        if (e.type == "touchend") {
            let beforeHoverList = document.querySelectorAll(".hover");
            if (beforeHoverList.length > 0) beforeHoverList.forEach((beforeHover => {
                beforeHover.classList.remove("hover");
            }));
        }
    }
    function globalResizer(e) {
        cardContentEqualizer(".galery__room-name");
        if (window.innerWidth > 450) cardContentEqualizer(".info-card__title");
    }
    function cardContentEqualizer(eqselector) {
        let eqList = document.querySelectorAll(eqselector);
        if (eqList.length > 0) {
            eqList = Array.from(eqList);
            let eqHeightList = [];
            let maxEqHeigh;
            eqList.forEach((eqIten => {
                eqIten.style.minHeight = "0px";
                eqHeightList.push(eqIten.getBoundingClientRect().height);
            }));
            maxEqHeigh = Math.max.apply(null, eqHeightList);
            eqList.forEach((item => {
                item.style.minHeight = `${maxEqHeigh}px`;
            }));
        }
    }
    function cutHeader() {
        let cuttingBlock = document.querySelector(".titlepage__body");
        let header = document.querySelector(".header");
        let options = {
            root: null,
            threshold: .7
        };
        let callback = function(entries, observer) {
            entries.forEach((entry => {
                if (entry.isIntersecting) header.classList.add("header-top");
                if (!entry.isIntersecting) {
                    let headerTop = document.querySelector(".header-top");
                    if (headerTop) header.classList.remove("header-top");
                }
            }));
        };
        let observer = new IntersectionObserver(callback, options);
        observer.observe(cuttingBlock);
    }
    window["FLS"] = true;
    isWebp();
    menuInit();
})();