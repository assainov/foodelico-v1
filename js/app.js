const Animation = (function() {

    //  Selecting elements
    const logoHeight = document.querySelector('.logotype').offsetHeight;
    const header = document.querySelector('.sticky-header');
    const logoPosition = document.querySelector('.logotype').getBoundingClientRect().top - logoHeight;

    //  Listen to scroll and hide the Order Now btn
    window.onscroll = function() {
        currentScroll = window.pageYOffset;

        if (currentScroll < logoPosition) {
            header.style.top = 0;
        } else {
            header.style.top = '-300px';
        }
    }


    function currentYPosition() {
        // Firefox, Chrome, Opera, Safari
        if (self.pageYOffset) return self.pageYOffset;
        // Internet Explorer 6 - standards mode
        if (document.documentElement && document.documentElement.scrollTop)
            return document.documentElement.scrollTop;
        // Internet Explorer 6, 7 and 8
        if (document.body.scrollTop) return document.body.scrollTop;
        return 0;
    }
    
    
    function elmYPosition(eID) {
        var elm = document.getElementById(eID);
        var y = elm.offsetTop - 15;
        var node = elm;
        while (node.offsetParent && node.offsetParent != document.body) {
            node = node.offsetParent;
            y += node.offsetTop;
        } return y;
    }
    
    return {
        smoothScroll : function(eID) {
            var startY = currentYPosition();
            var stopY = elmYPosition(eID);
            var distance = stopY > startY ? stopY - startY : startY - stopY;
            if (distance < 100) {
                scrollTo(0, stopY); return;
            }
            var speed = Math.round(distance / 100);
            if (speed >= 20) speed = 20;
            var step = Math.round(distance / 25);
            var leapY = stopY > startY ? startY + step : startY - step;
            var timer = 0;
            if (stopY > startY) {
                for ( var i=startY; i<stopY; i+=step ) {
                    setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
                    leapY += step; if (leapY > stopY) leapY = stopY; timer++;
                } return;
            }
            for ( var i=startY; i>stopY; i-=step ) {
                setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
                leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
            }
        }
    }
})();


document.querySelector('.watch-menu').addEventListener('click', function (e) {
    Animation.smoothScroll('menu');

    e.preventDefault();
});


document.querySelector('#order-btn').addEventListener('click', function (e) {
    Animation.smoothScroll('order');

    e.preventDefault();
});


document.querySelector('.i-btn').firstElementChild.addEventListener('click', function(e) {
    const info = document.querySelector('.info-body');
    const close = document.querySelector('.close-btn');
    const i = document.querySelector('.i-btn');

    info.classList.add('show-info');
    close.classList.add('show-btn');
    i.firstElementChild.style.visibility = 'hidden';

    e.preventDefault();
});

document.querySelector('.close-btn').firstElementChild.addEventListener('click', function(e) {
    const info = document.querySelector('.info-body');
    const close = document.querySelector('.close-btn');
    const i = document.querySelector('.i-btn');

    info.classList.remove('show-info');
    close.classList.remove('show-btn');
    i.firstElementChild.style.visibility = 'visible';

    e.preventDefault();
});


//  MENU APP
const MenuApp = (function() {
    //  Private
    const showToday = function() {
        const today = new Date();
        $(document).ready(function(){
            $('.daily-menu').slick({
                nextArrow:$('.next'),
                prevArrow:$('.prev'),
                //  Set the initial slide to today's weekday
                initialSlide: today.getDay(),
            });
        });
    }

    const getTodayName = function() {
        const today = new Date();

        const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][today.getDay()];
        
        return weekday;
    }

    const displayMenu = function(days) {
        const menu = document.querySelector('.daily-menu');
        
        days.forEach(function(day, index){
            menu.firstElementChild.firstElementChild.children[index+1].innerHTML = `
            <h1 class="weekday">${day.name}</h1>
            <h5 class="menu-title">Soup</h5>
            <p class="soup">${day.soup}</p>
            <h5 class="menu-title">Main Option 1</h5>
            <p class="option1">${day.option1}</p>
            <h5 class="menu-title">Main Option 2</h5>
            <p class="option2">${day.option2}</p>
            <h5 class="menu-title">Main Option 3</h5>
            <p class="option3">${day.option3}</p>
            <h5 class="menu-title">Salat</h5>
            <p class="salad">${day.salad}</p>
            <h5 class="menu-title">Nachspeise</h5>
            <p class="dessert">${day.dessert}</p>
            `;
        });
    }

    //  Public
    return {
        init : function() {
            //  Scroll to the current day of week
            showToday();

            

            // Get a reference to the database service
            let daysRef = firebase.database().ref();

            //  Read the data and put it in the days array
            daysRef.child('days').once('value').then(function(snapshot) {
                const days = snapshot.val();
                displayMenu(days);

            });

        }
    }
})();

MenuApp.init();