var timer = {
  value: 0,
  timerId: undefined,
  lastStartTime: undefined,
  lastStartValue: undefined
};

let mouseDown = {
  down: false,
  event: undefined,
  func: [],
  preFunc: []
};

let wayFuncs = {
  "s,n": startStopTimer,
  "e,w": restartLapTimer
};

$(".startStop").bind("click", startStopTimer);
$(".restartLap").bind("click", restartLapTimer);

function restartLapTimer() {
  if (!timer.timerId) {
    timer.value = 0;
    updateTablo();
    $("ol").empty();
    localStorage.removeItem("lastSavedTimer");
  } else {
    addNewListElement();
  }
}

initializateTimer();

function initializateTimer() {
  let lastSavedTimer = JSON.parse(localStorage.getItem("lastSavedTimer"));
  if (lastSavedTimer) {
    timer.value = lastSavedTimer.value;
    if (lastSavedTimer.timerId) {
      let today = new Date();
      timer.value =
        lastSavedTimer.lastStartValue +
        Math.floor(today.getTime() / 1000) -
        lastSavedTimer.lastStartTime;
      startStopTimer();
    } else {
      updateTablo();
    }

    //console.log(lastSavedTimer);
  }
}

function startStopTimer() {
  if (!timer.timerId) {
    let today = new Date();
    timer.timerId = setInterval(setTimer, 1000);
    timer.lastStartTime = Math.floor(today.getTime() / 1000);
    timer.lastStartValue = timer.value;

    $(".startStop").val("Stop");
    $(".restartLap").val("Lap");
  } else {
    clearInterval(timer.timerId);
    timer.timerId = undefined;
    $(".startStop").val("Start");
    $(".restartLap").val("Restart");
  }
  localStorage.setItem("lastSavedTimer", JSON.stringify(timer));
}

function setTimer() {
  timer.value += 1;
  updateTablo();
}

function updateTablo() {
  let time = convertIntToData(timer.value);
  $(".tablo").html(`${time.hour}:${time.min}:${time.sec}`);
}

function convertIntToData(i) {
  let time = {};
  let curVal = i >= 86400 ? i % 86400 : i;
  time.hour = Math.floor(curVal / 3600);
  time.min = Math.floor((curVal - time.hour * 3600) / 60);
  time.sec = curVal % 60; // - min*60 - hour*3600;

  time.hour = (time.hour >= 10 ? "" : "0") + time.hour;
  time.min = (time.min >= 10 ? "" : "0") + time.min;
  time.sec = (time.sec >= 10 ? "" : "0") + time.sec;
  return time;
}

function addNewListElement() {
  let time = convertIntToData(timer.value);
  $("ol").append("<li>" + `${time.hour}:${time.min}:${time.sec}` + "</li>");

  $(document).on("click", "li", function() {
    $(this)
      .toggleClass("strike")
      .fadeOut("slow");
  });
}