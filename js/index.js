// All javascript variables should be initialised ar the start
var init,    
    Carousel, 
    calculatePortraitImageAppropriateWidth,
    calculateLandscapeImageAppropriateHeight,
    closeLargeImage,
    generateClouds, 
    hideBalloon,
    hidePortfolioElementAndShowCarousel,
    isPortfolioElementShown,
    mainCarousel, 
    isImagePortrait,
    positionClouds, 
    routes,
    showBalloon,
    showCarousel,
    showPortfolioElement,
    submitContactForm,
    xhr,
    // Bind function for ease of use of the carousel. 
    //Makes sure that 'this' is the instance of the carousel
    superBind = function(fn, self){ 
        return function(){ 
            return fn.apply(self, arguments); 
        }; 
    };

// A class definition for a generic carousel
Carousel = (function() {
    Carousel.prototype.container = null;
    Carousel.prototype.rail = null;
    Carousel.prototype.slides = null;
    Carousel.prototype.currentIndex = -1;
    
    // Constructor - takes the container, which is a means to find the moving parts of the carousel which are directly inside it
    function Carousel(container) {
        // 'this' always needs to point to the instance of the carousel
        this.moveTo = superBind(this.moveTo, this);
        this.resizeSlides = superBind(this.resizeSlides, this);
        this.moveAfterResize = superBind(this.moveAfterResize, this);

        this.container = container;
        this.rail = container.getElementsByClassName('rail')[0];
        this.slides = this.rail.getElementsByClassName('slide');
        this.currentIndex = 0;
    }
    
    // Add methods to the class
    Carousel.prototype.resizeSlides = function () {
        var i, 
            slides = this.slides;

        for(i = 0; i < slides.length; i++) {
            slides[i].style.width = container.offsetWidth + 'px';
        } 
    };

    Carousel.prototype.moveAfterResize = function() {
        this.moveTo(this.currentIndex);
    };

    Carousel.prototype.moveTo = function (index) {
        var targetSlide = this.slides[index],
            amountToMove = targetSlide.offsetLeft;
        this.rail.style.left = "-" + amountToMove + "px";
        this.currentIndex = index;
    };

    Carousel.prototype.disableAnimations = function() {
        this.rail.classList.add("noTransition");
    };

    Carousel.prototype.enableAnimations = function() {
        this.rail.classList.remove("noTransition");
    };

    return Carousel;
})();

init = function (event) {
    var clouds,
        hashPath = location.hash.substr(2);

    clouds = generateClouds();
    positionClouds(clouds);

    mainCarousel = new Carousel(document.getElementById('container'));
    mainCarousel.resizeSlides();

    //bind makes sure that the value of 'this' is mainCarousel
    window.addEventListener('resize', function () {
        mainCarousel.disableAnimations();
        mainCarousel.resizeSlides();
        mainCarousel.moveAfterResize.bind(mainCarousel)();
        mainCarousel.enableAnimations.bind(mainCarousel)();
    }, false);
    
    //JSON format data
    routes = {
        'home': function () {
            hidePortfolioElementAndShowCarousel(0);
        },
        'work': function () {
            hidePortfolioElementAndShowCarousel(1);
        },
        'contact': function () {
            hidePortfolioElementAndShowCarousel(2);
        },
        'art': function () {
            showPortfolioElement("artGridWrapper", "14%");
        },
        'webDesign' : function () {
            if (window.innerWidth < 773) {
                window.location.href = "http://alicegee.com/ctec1412/01home.xhtml";
            } else {
                showPortfolioElement("webDesignFrame", "40px");
            }
        },
        'design': function () {
            showPortfolioElement("designGridWrapper", "14%");
        }
    };

    if (typeof routes[hashPath] === 'function') {
        routes[hashPath]();
    }    
};

//This is a hash value which happens to be a path. The / means it doesn't jump to IDs
window.addEventListener("hashchange", function () {
    //substr[2] cuts off the first 2 characters, which are #/
    var hashPath = location.hash.substr(2);
    
    //checking the type 
    if (typeof routes[hashPath] === 'function') {
        routes[hashPath]();
    } 
}, false);

// The 'init' function given above is passed as an argument to the event listener for the loading of the DOM content i.e. the page
document.addEventListener("DOMContentLoaded", init); 

/* Javascript converted from Jquery given here:
http://jsfiddle.net/fZtdt/498/ 
*/
generateClouds = function () {
    var i, 
        cloud, 
        clouds = new Array(20);

    for (i = 0; i < 20; i++) {
        cloud = document.createElement("div");
        cloud.classList.add("cloud");
        cloud.innerHTML = '<div class="cloudBase"></div><div class="cloudPart1"></div><div class="cloudPart2"></div><div class="cloudPart3"></div><div class="cloudPart4"></div>';
        document.body.appendChild(cloud);
        clouds[i] = cloud;
    }
    return clouds;
};

positionClouds = function (clouds) {
    var min_x, max_x, min_y, max_y, filled_areas=[], i, rand_x, rand_y, area;

    min_x = 0;
    max_x = window.innerWidth - 100; //minus width of cloud
    min_y = 0;
    max_y = window.innerHeight - 59; //minus height of cloud

    for (i = 0; i < clouds.length; i++) {
        rand_x=0;
        rand_y=0;
        area;

        rand_x = Math.round(min_x + ((max_x - min_x)*(Math.random() % 1)));
        rand_y = Math.round(min_y + ((max_y - min_y)*(Math.random() % 1)));
        area = {x: rand_x, y: rand_y, width: clouds[i].offsetWidth, height: clouds[i].offsetHeight};
    
        filled_areas.push(area);
        
        clouds[i].style.left=rand_x + "px"; 
        clouds[i].style.top=rand_y + "px";
    }
};

/*------Art & Design/Dev-------*/

showPortfolioElement = function(element, top) {
    document.getElementById("rail").style.top="-100%";
    document.getElementById("linksBanner").style.top="0%";
    document.getElementById("linksBanner").style.width="100%";
    document.getElementById(element).style.display="block";
    document.getElementById(element).style.top=top;
    hideBalloon();
}

// Get height of screen - use 80% of it
// Actual width of image
// Actual height of image
calculatePortraitImageAppropriateWidth = function (image) {
    var actualHeight = image.naturalHeight,
        actualWidth = image.naturalWidth,
        targetHeight = window.innerHeight * 0.8;

    return actualWidth * targetHeight / actualHeight;
};

calculateLandscapeImageAppropriateWidth = function (image) {
    var actualHeight = image.naturalHeight,
        actualWidth = image.naturalWidth,
        targetWidth = window.innerWidth * 0.6;

    return actualHeight * targetWidth / actualWidth;
};

Array.prototype.slice.call(document.getElementsByClassName('portfolioImageWrapper')).forEach(function(block){
    block.addEventListener('click', function(e) {
        e.preventDefault();
        var largeImageWrapper,
            largeImage,
            imageAlt,
            imageOverlay,
            imageSrc;

        imageAlt = (block.querySelector('.regular').getAttribute('alt'));
        imageSrc = (block.querySelector('.portfolioImage').getAttribute('href'));
        largeImageWrapper = document.createElement("div");
        largeImageWrapper.classList.add("portfolioImageLargeWrapper");
        largeImageWrapper.id = "portfolioImageLargeWrapper";

        largeImage = document.createElement("img");
        largeImage.classList.add("fullScreen");
        largeImage.src = imageSrc;
        largeImage.alt = imageAlt;

        largeImageWrapper.appendChild(largeImage);
        block.parentNode.appendChild(largeImageWrapper);
        
        imageOverlay = document.createElement("div");
        imageOverlay.classList.add("portfolioImageOverlay");
        imageOverlay.id = "portfolioImageOverlay";
        block.parentNode.appendChild(imageOverlay);

        largeImage.addEventListener('load', function () {
            if (isImagePortrait(largeImage)) {
                largeImageWrapper.style.width = calculatePortraitImageAppropriateWidth(largeImage) + 'px';
                largeImageWrapper.style.height = "80%";
            } else {
                largeImageWrapper.style.width = calculateLandscapeImageAppropriateWidth(largeImage) + "px";
                largeImage.style.height = "50%";
            }
        });
 
        largeImageWrapper.addEventListener('click', closeLargeImage.bind(this, block, largeImageWrapper, imageOverlay), true);
        document.addEventListener('keydown', function(e){
            var evt = e || window.event;
            var isEscape = false;
            if ("key" in evt) {
                isEscape = (evt.key === "Escape" || evt.key === "Esc");
            } else {
                isEscape = (evt.keyCode === 27);
            }
            if (isEscape) {
                closeLargeImage(block, largeImageWrapper, imageOverlay, evt);
            }
        }, true);
         
    });
});

closeLargeImage = function(block, largeImageWrapper, imageOverlay, e) {
    e && e.preventDefault();
    try {
        block.parentNode.removeChild(largeImageWrapper);
        block.parentNode.removeChild(imageOverlay);
    } catch (ex) {
        // Do nothing; this is actually fine
    }
}

isImagePortrait = function(largeImage) {
    return largeImage.offsetWidth < largeImage.offsetHeight;
}

isPortfolioElementShown = function(element) {
    return document.getElementById(element).style.display==="block";
}

hidePortfolioElement = function(element) {
    if (window.matchMedia("screen and (min-width: 773px)").matches) {
        document.getElementById(element).style.top="100%";
        document.getElementById(element).style.display="none";
    } else {
        document.getElementById(element).style.opacity="0%";
        document.getElementById(element).style.display="none";
    }
    showCarousel();
}

showCarousel = function() {
    if (window.matchMedia("screen and (min-width: 773px)").matches) {
        document.getElementById("linksBanner").style.width="50%";
        document.getElementById("linksBanner").style.top="75%";
        document.getElementById("rail").style.top="12%";
    } else {
        document.getElementById("rail").style.top="12%";
    }
}

hidePortfolioElementAndShowCarousel = function(moveTo) {
    if (isPortfolioElementShown("artGridWrapper")) {
        hidePortfolioElement("artGridWrapper");
    } else if (isPortfolioElementShown("designGridWrapper")) {
        hidePortfolioElement("designGridWrapper");
    } else if (isPortfolioElementShown("webDesignFrame")) {
        hidePortfolioElement("webDesignFrame");
    }
    mainCarousel.moveTo(moveTo);
    showBalloon();
}

/*--------Balloon---------*/

document.getElementById('artBtn').addEventListener('click', function(e) {
    document.getElementById("balloonFade").classList.remove("fadeIn");
    document.getElementById("balloonFade").classList.add("fadeOut");
});

hideBalloon = function() {
    document.getElementById("balloonWrapper").style.display="none";     
}

showBalloon = function() {
    if (window.matchMedia("screen and (min-width: 773px)").matches) {
        document.getElementById("balloonFade").classList.remove("fadeOut");
        document.getElementById("balloonFade").classList.add("fadeIn");
        document.getElementById("balloonWrapper").style.opacity="100%";
        document.getElementById("balloonWrapper").style.display="block";   
    } else {
       // Do nothing
    }
}

/*-------Contact form-------*/

submitContactForm = function () {
    xhr = new XMLHttpRequest();
    xhr.responseType = 'text';

    xhr.onreadystatechange = function () {
        var DONE = 4; // readyState 4 means the request is done.
        var OK = 200; // status 200 is a successful return.
        if (xhr.readyState === DONE) {
            if (xhr.status === OK) {
                // var data = xhr.responseText;
                // var jsonResponse = JSON.parse(data);
                // console.log(jsonResponse["Data"]);
                console.log(xhr.response);
                console.log(xhr.responseText); // 'This is the returned text.'

                // Take JSON data and display it on screen 
                var obj = JSON.parse(xhr.responseText);
                var response = "<p>" + obj.statusMsg + "</p>";
                document.getElementById("replyMessage").style.display="block";
                document.getElementById("replyMessage").innerHTML = response;
                
            } else {
                console.log('Error: ' + xhr.status); // An error occurred during the request.
            }
        }
    };
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var message = document.getElementById("message").value;
    
    xhr.open('POST', 'contact.php');
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
    xhr.send(JSON.stringify({name: name, email: email, message: message}));
};

document.getElementById('submit').addEventListener('click', function(e) {
    e.preventDefault();
    submitContactForm();
})
