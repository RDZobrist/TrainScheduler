// Global Variables \\
var anotherTrain = 0;
var hoursWaiting;

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
     if (currentHour > 12) {

     }
     // console.log("current hour   " + currentHour);

     var diffTime = moment().diff(moment(trainFirstArrivalAdjusted), "minutes");
     // console.log("difffff   " + diffTime);


     var timeDifference = diffTime % trainFrequency;


     var minutesTillArrival = trainFrequency - timeDifference;



     if (currentHour - hourOfFirstArrival < 0) {
          if (currentHour > 11) {
               var a1 = hourOfFirstArrival - currentHour;
               minutesTillArrival = minutesTillArrival + (a1 * 60);
               var nextTrain = moment().add(minutesTillArrival, "minutes");
               var arrivaltime = moment(nextTrain).format("hh:mm a");
          } else {
               var a1 = hourOfFirstArrival - currentHour;
               minutesTillArrival = minutesTillArrival + (a1 * 60);
               var nextTrain = moment().add(minutesTillArrival, "minutes");
               var arrivaltime = moment(nextTrain).format("hh:mm a");

          }

     } else {
          if (currentHour < 12) {

               var nextTrain = moment().add(minutesTillArrival, "minutes");
               var arrivaltime = moment(nextTrain).format("hh:mm a");

          } else {
               var nextTrain = moment().add(minutesTillArrival, "minutes");
               var arrivaltime = moment(nextTrain).format("hh:mm A");
          }

     }
     $("#train-data-table > tbody").prepend("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" +
          trainFrequency + "</td><td>" + arrivaltime + "</td><td>" + minutesTillArrival + "</td></tr>");
});
