const DayCtrl = (function() {
    //Private variables
    //  Day object
    const Day = function(name, soup, option1, option2, option3, salad, dessert){
        this.name = name;
        this.soup = soup;
        this.option1 = option1;
        this.option2 = option2;
        this.option3 = option3;
        this.salad = salad;
        this.dessert = dessert;
    };

    //  Data Structure / State
    const state = {
        days: [
            // {name: 'Sunday', soup: 'Lentil', option1: 'Mango', option2: 'Apple', option3: 'Orange', salad: 'Caesar Salad', dessert: 'Cheesecake'},
            // {name: 'Monday', soup: 'Lentil', option1: 'Mango', option2: 'Apple', option3: 'Orange', salad: 'Caesar Salad', dessert: 'Cheesecake'},
            // {name: 'Tuesday', soup: 'Lentil', option1: 'Mango', option2: 'Apple', option3: 'Orange', salad: 'Caesar Salad', dessert: 'Cheesecake'},
            // {name: 'Wednesday', soup: 'Lentil', option1: 'Mango', option2: 'Apple', option3: 'Orange', salad: 'Caesar Salad', dessert: 'Cheesecake'},
            // {name: 'Thursday', soup: 'Lentil', option1: 'Mango', option2: 'Apple', option3: 'Orange', salad: 'Caesar Salad', dessert: 'Cheesecake'},
            // {name: 'Friday', soup: 'Lentil', option1: 'Mango', option2: 'Apple', option3: 'Orange', salad: 'Caesar Salad', dessert: 'Cheesecake'},
            // {name: 'Saturday', soup: 'Lentil', option1: 'Mango', option2: 'Apple', option3: 'Orange', salad: 'Caesar Salad', dessert: 'Cheesecake'},
        ],
        currentDay: null
    }


    //Public variables
    return {
        logData : function() {
            return state.days;
        },
        getCurrentDay : function() {
            return state.currentDay;
        },
        setCurrentDay : function(name) {
            state.days.forEach(function(day) {
                if (day.name === name) {
                    state.currentDay = day;
                }
            });
        },
        updateDayMenu : function(name, soup, option1, option2, option3, salad, dessert) {
            const newDay = new Day(name, soup, option1, option2, option3, salad, dessert);
            
            state.days.forEach(function(day, index) {
                if (day.name === newDay.name) {
                    state.days[index] = newDay;
                }
            });
        },
        setData : function(days) {
            state.days = days;
        },
        state : state,
    }
})();


const UICtrl = (function() {
    //Private variables


    //Public variables
    return {
        clearInputs: function() {
            document.querySelector('#soup').value = '';
            document.querySelector('#option1').value = '';
            document.querySelector('#option2').value = '';
            document.querySelector('#option3').value = '';
            document.querySelector('#salad').value = '';
            document.querySelector('#dessert').value = '';

            //  Materialize: Update input fields
            M.updateTextFields();
        },
        displayDayTitle : function() {
            const selector = document.querySelector('#day-selector');
            const day = selector.options[selector.selectedIndex].text;

            document.querySelector('#weekday').textContent = day;
        },
        getDay : function() {
            const selector = document.querySelector('#day-selector');
            const day = selector.options[selector.selectedIndex].text;
            
            return day;
        },
        loadInputs : function(day) {
            document.querySelector('#soup').value = day.soup;
            document.querySelector('#option1').value = day.option1;
            document.querySelector('#option2').value = day.option2;
            document.querySelector('#option3').value = day.option3;
            document.querySelector('#salad').value = day.salad;
            document.querySelector('#dessert').value = day.dessert;

            //  Materialize: Update input fields
            M.updateTextFields();
        },
        getInputs : function() {
            const soup = document.querySelector('#soup').value,
                option1 = document.querySelector('#option1').value,
                option2 = document.querySelector('#option2').value,
                option3 = document.querySelector('#option3').value,
                salad = document.querySelector('#salad').value,
                dessert = document.querySelector('#dessert').value;

                return {
                    soup: soup,
                    option1: option1,
                    option2: option2,
                    option3: option3,
                    salad: salad,
                    dessert: dessert
                }
        },
        showAlert : function(message) {
            document.querySelector('.sign-alert').style.color = 'red';
            document.querySelector('.sign-alert').innerHTML = message;

            setTimeout(function(){
                document.querySelector('.sign-alert').innerHTML = '';
            }, 3000);
        }

    }
})();

const FirebaseCtrl = (function(DayCtrl) {
    //Private variables
    

    //Public variables
    return {
        getLoginInputs : function() {
            return { 
                email : document.querySelector('#userEmail').value,
                password : document.querySelector('#userPassword').value
            }
        },
        loadNewData : function() {
            // Get a reference to the database service
            let daysRef = firebase.database().ref();

            //  Read the data and put it in the days array
            daysRef.child('days').once('value').then(function(snapshot) {
                const days = snapshot.val();
                DayCtrl.setData(days);

                //  Set Monday as a current day
                DayCtrl.setCurrentDay('Monday');

            });
        }

    }
})(DayCtrl);

const AppCtrl = (function(DayCtrl, UICtrl) {
    //Private variables
    const loadEventListeners = function() {
        //  JQuery for modals
        $(document).ready(function(){
            $('.modal').modal();
        });

        //  Listen to Sign In button
        document.querySelector('#sign-in-btn').addEventListener('click', userLogin);

        //  Listen to Select day
        document.querySelector('#day-selector').addEventListener('change', (e) => {
            UICtrl.displayDayTitle();
            UICtrl.clearInputs();

            const currentDay = UICtrl.getDay();
            DayCtrl.setCurrentDay(currentDay);

            e.preventDefault();
        });

        //  Listen to LOAD MENU
        document.querySelector('.load-btn').addEventListener('click', loadCurrentDay);

        //  Listen to Update day
        document.querySelector('.update-btn').addEventListener('click', updateCurrentDay);
    }

    const loadCurrentDay = function(e) {
        const currentDay = DayCtrl.getCurrentDay();

        UICtrl.loadInputs(currentDay);


        e.preventDefault();
    }

    const updateCurrentDay = function(e) {
        const dayMenu = UICtrl.getInputs();
        const name = UICtrl.getDay();

        if (dayMenu.soup !== '' && dayMenu.option1 !== '' && dayMenu.option2 !== '' && dayMenu.option3 !== '' && dayMenu.salad !== '' && dayMenu.dessert !== '' ) {

            let user = firebase.auth().currentUser;

            if (user) {
                DayCtrl.updateDayMenu(name, dayMenu.soup, dayMenu.option1, dayMenu.option2, dayMenu.option3, dayMenu.salad, dayMenu.dessert);

                let database = firebase.database().ref();

                database.child('days').set(DayCtrl.state.days);
            } else {
                alert('User is not signed in');
            }

        } else {
            alert('Fill in all the inputs!');
        }
        
        e.preventDefault();
    }

    const userLogin = function(e) {
        const login = FirebaseCtrl.getLoginInputs();

        if (login.email !== '' && login.password !== '') {
            firebase.auth(). signInWithEmailAndPassword(login.email, login.password).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                UICtrl.showAlert('Error signing in: '+ errorMessage);
            })
        }

        e.preventDefault();
    }


    //Public variables
    return {
        init : function() {
            //  Load data from the database
            FirebaseCtrl.loadNewData();

            //load all event listeners
            loadEventListeners();

            

        }

    }
})(DayCtrl, UICtrl);

//  Initialize application
AppCtrl.init();

//  Initialize MaterializeCSS components
M.AutoInit();


//  Check if user is signed in
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        document.querySelector('.sign-in-option').style.display = 'none';
        document.querySelector('.user-option').style.display = 'block';
        document.querySelector('.user-option').textContent = `${user.email}`;

        //  Close the modal
        $('#sign-in-modal').modal('close');

    } else {
        document.querySelector('.sign-in-option').style.display = 'block';
        document.querySelector('.user-option').style.display = 'none';
        document.querySelector('.user-option').textContent = '';
    }
  });


  //    Changed the user authentication state change to session
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
  .then(function() {
    // Existing and future Auth states are now persisted in the current
    // session only. Closing the window would clear any existing state even
    // if a user forgets to sign out.
    // ...
    // New sign-in will be persisted with session persistence.
    return firebase.auth().signInWithEmailAndPassword(email, password);
  })
  .catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
  });