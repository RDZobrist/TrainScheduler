// Global Variables \\
var anotherTrain = 0;
var hoursWaiting;

$("#edit-train-panel, #update-data-show-panel-btn").hide();

// Initialize Firebase
var config = {
    apiKey: "AIzaSyCNYgtHwHFhn_OTGyIHRE5vtUbxY_f3JW4",
    authDomain: "chimericalxpresstrainscheduler.firebaseapp.com",
    databaseURL: "https://chimericalxpresstrainscheduler.firebaseio.com",
    projectId: "chimericalxpresstrainscheduler",
    storageBucket: "chimericalxpresstrainscheduler.appspot.com",
    messagingSenderId: "563861524983"
};
firebase.initializeApp(config);
// set local variable to firebase.database() \\
var database = firebase.database();


// when user clicks add train button \\
$("#add-train-btn").on("click", function() {
    anotherTrain++;
    // prevent page refresh \\ 
    event.preventDefault();

    // store user input to local variable \\
    var trainName = $("#train-name-input").val().trim();
    var trainDestination = $("#destination-input").val().trim();
    var trainFirstArrival = $("#first-train-input").val().trim();
    var trainFrequency = $("#frequency-input").val().trim();

    // store related variables in object \\
    var newTrain = {
        name: trainName,
        destination: trainDestination,
        firstArrival: trainFirstArrival,
        frequency: trainFrequency
    }

    database.ref().push(newTrain);

    // Alert
    alert("train added");
    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frequency-input").val("");
});

// Upon new entry to databse, update html with new data \\
database.ref().on("child_added", function(childSnapshot, prevChildKey) {
    console.log(childSnapshot.val());
    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var trainFirstArrival = childSnapshot.val().firstArrival;
    var trainFrequency = childSnapshot.val().frequency;



    var trainFirstArrivalAdjusted = moment(trainFirstArrival, "HH:mm").subtract(1, "year");
    // storing the minute value of first arrival in local variable \\
    var minutesOfFirstArrival = moment(trainFirstArrival, "HH:mm").minute();
    // storing the hour value of first arrival in local variable \\
    var hourOfFirstArrival = moment(trainFirstArrival, "HH:mm").hour();

    // store curent time formated in military in variavle called now \\\
    var currentTime = moment();
    // store current minute of hour in variable now2 \\
    var currentMinute = moment().get('minute');

    var currentHour = moment(currentTime, "HH:mm").hour();



    var diffTime = moment().diff(moment(trainFirstArrivalAdjusted), "minutes");
    var timeDifference = diffTime % trainFrequency; // minutes from last arrival
    var minutesTillArrival = trainFrequency - timeDifference; // minutes from last arrival 


    // checking to see if minutes to next arrival is greater than 60 \\
    if (currentHour - hourOfFirstArrival < 0) {
        // for every additional hour over the first sixty minutes, 
        // store that value in variable a1 \\
        var a1 = hourOfFirstArrival - currentHour;
        // converting hours to minutes \\
        minutesTillArrival = minutesTillArrival + (a1 * 60);
        // add extra time (in minutes) to current time (moment.js) to obtain value of next arrival\
        var nextTrain = moment().add(minutesTillArrival, "minutes");
        // formatting time to 12 hour standard \\
        var arrivaltime = moment(nextTrain).format("hh:mm a");

    } else {

        var nextTrain = moment().add(minutesTillArrival, "minutes");
        var arrivaltime = moment(nextTrain).format("hh:mm a");
    }

    // displaying up-to-date (upon-click  or refresh) data to html, reflective of firebase.database \\
    $("#train-data-table > tbody").prepend("<tr class='data-well'><td id='name-well'>" + trainName + "</td><td id='destination-well'>" + trainDestination + "</td><td id='frequency-well'>" +
        trainFrequency + "</td><td id='arrival-well'>" + arrivaltime + "</td><td id='minutes-till-well'>" + minutesTillArrival + "</td></tr>");
}); // closing addTrain on-click function \\


// When edit data button is clicked \\
// $("#update-data-show-panel-btn").on("click", function(){
//   event.preventDefault();

//   // Display edit data panel \\
//   $("#edit-train-panel").slideDown("fast");

//   $(".data-well").on("click", function(){

// if(this.indexOf(innerText) == "  "){
//   var a = this.indexOf(innerText)
// }
//       console.log(this.innerText);

// var arrivalEdit =children.innerText").text();
// var destinationEdit = $("#destination-well").text();
// var frequencyEdit = $("#frequency-well").text();

// console.log("frequencyEdit:  " + frequencyEdit);
// console.log("nameEdit   " + nameEdit);
// console.log("destinationEdit   " + destinationEdit);
// console.log("arrivalEdit   " + arrivalEdit);