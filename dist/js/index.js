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

$("body").bind("mouseup", event => {
  let way = mouseDown.func.join();
  let wayFunc = wayFuncs[way];

  if (wayFunc) {
    //debugger;
    wayFunc(this, event);
  }

  //console.log(this.mouseDown.func.join());
  mouseDown.down = false;
  mouseDown.event = undefined;
  mouseDown.func = [];
  
  body.painStarted = false;
});

$("body").bind("mousemove", event => {
  function determinateRouting(delta, limit, limitError) {
    let route = undefined;
    let a = Math.round(Math.abs(delta) / limit * 10) / 10;
    if (a > 1 - limitError) route = delta < 0 ? -1 : 1;
    else if (a > -limitError && a < limitError) route = 0;
    return route;
  }

  if (event.buttons === 1) {
    event.preventDefault();
    mouseDown.event = mouseDown.event || event;
    let limit = 20;
    let limitError = 0.35;
    let maxCount = 3;

    let deltaX = mouseDown.event.screenX - event.screenX;
    let deltaY = mouseDown.event.screenY - event.screenY;
    let routeX = determinateRouting(deltaX, limit, limitError);
    let routeY = determinateRouting(deltaY, limit, limitError);
    let route = "";

    if (routeX == 0 && routeY == 1) route = "n";
    else if (routeX == 0 && routeY == -1) route = "s";
    else if (routeX == 1 && routeY == 0) route = "w";
    else if (routeX == -1 && routeY == 0) route = "e";
    else if (routeX == 1 && routeY == 1) route = "nw";
    else if (routeX == 1 && routeY == -1) route = "sw";
    else if (routeX == -1 && routeY == 1) route = "ne";
    else if (routeX == -1 && routeY == -1) route = "se";

    if (route != "") {
      
      mouseDown.event = event;

      mouseDown.preFunc = mouseDown.preFunc.slice(-maxCount + 1);
      mouseDown.preFunc.push(route);
      let countRoute = 0;

      for (let i = 0; i < mouseDown.preFunc.length; i++) {
        if ((mouseDown.preFunc[i] = route)) countRoute++;

        if (countRoute >= maxCount) break;
      }

      if (countRoute >= maxCount) {
        let func = mouseDown.func[mouseDown.func.length - 1];
        if (func == undefined || func != route) {
          mouseDown.preFunc = [];
          mouseDown.func.push(route);
        }
      }
    }
  }
});

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