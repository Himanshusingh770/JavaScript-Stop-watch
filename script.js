let hours = 0;
let minutes = 0;
let seconds = 0;
let milliseconds = 0;
let timerInterval;
let isStopwatchActive= false;
let previousLapTime = 0;
let hourSectionAdded = false;  // Track if hour section is added

// Start the stopwatch
function startStopwatch() {
  if (!isStopwatchActive) {
    isStopwatchActive= true;
    timerInterval = setInterval(updateDisplay, 10);  // Update every 10ms for milliseconds

    // Show Stop button and keep Start and Reset buttons
    document.getElementById('start').style.display = 'none';
    document.getElementById('stop').style.display = 'inline-block';
    document.getElementById('reset').style.display = 'inline-block';
  }
}

// Stop the stopwatch
function stopStopwatch() {
  isStopwatchActive= false;
  clearInterval(timerInterval);

  // Show Start and Reset buttons, but hide Stop button
  document.getElementById('start').style.display = 'inline-block';
  document.getElementById('stop').style.display = 'none';
  document.getElementById('reset').style.display = 'inline-block';
}

// Reset the stopwatch
function resetStopwatch() {
  isStopwatchActive= false;
  clearInterval(timerInterval);
  hours = 0;
  minutes = 0;
  seconds = 0;
  milliseconds = 0;
  previousLapTime = 0;
  hourSectionAdded = false;  // Reset hour section tracking
  updateDisplay(true);  // Force display to "00"

  // Clear the laps display
  document.getElementById('laps-container').innerHTML = '';

  // Remove the hour display if it was added
  const hourDisplay = document.getElementById('hour-display');
  if (hourDisplay) {
    hourDisplay.remove();
  }

  // Reset buttons back to initial state (Start and Reset buttons)
  document.getElementById('start').style.display = 'inline-block';
  document.getElementById('stop').style.display = 'none';
  document.getElementById('reset').style.display = 'inline-block';
}

// Update the stopwatch display
function updateDisplay(isReset = false) {
  if (!isReset) {  // Only update milliseconds if it's not a reset
    milliseconds += 10;
  }

  if (milliseconds === 1000) {
    milliseconds = 0;
    seconds++;
  }
  if (seconds === 60) {
    seconds = 0;
    minutes++;
  }
  if (minutes === 60) {
    minutes = 0;
    hours++;

    // Add hour section dynamically if it's not already added
    if (!hourSectionAdded) {
      addHourDisplay();
      hourSectionAdded = true;
    }
  }

  // Update the UI with formatted time
  if (hours > 0) {
    document.getElementById('hour-display').innerText = formatTime(hours);
  }
  document.getElementById('minute-display').innerText = formatTime(minutes);
  document.getElementById('second-display').innerText = formatTime(seconds);
  document.getElementById('millisecond-display').innerText = isReset ? "00" : formatMilliseconds(milliseconds);
}

// Format the time to always show two digits
function formatTime(time) {
  return time < 10 ? '0' + time : time;
}

// Format milliseconds to always show two digits (00-99)
function formatMilliseconds(ms) {
  return Math.floor(ms / 10).toString().padStart(2, '0');
}

// Record the lap time and display it
function recordLap() {
  const currentLapTime = hours * 3600000 + minutes * 60000 + seconds * 1000 + milliseconds;
  const lapDifference = currentLapTime - previousLapTime;

  // Calculate hours, minutes, seconds, and milliseconds for the lap difference
  const lapHours = Math.floor(lapDifference / 3600000);
  const lapMinutes = Math.floor((lapDifference % 3600000) / 60000);
  const lapSeconds = Math.floor((lapDifference % 60000) / 1000);
  const lapMilliseconds = lapDifference % 1000;

  const lapElement = document.createElement('div');
  lapElement.textContent = `Lap ${document.getElementById('laps-container').childElementCount + 1}: ` + 
                           `${formatTime(lapHours)}:${formatTime(lapMinutes)}:${formatTime(lapSeconds)}.${formatMilliseconds(lapMilliseconds)}`;
  
  document.getElementById('laps-container').appendChild(lapElement);

  // Update previous lap time to the current lap time
  previousLapTime = currentLapTime;
}

// Add hour display dynamically
function addHourDisplay() {
  const hourSpan = document.createElement('span');
  hourSpan.id = 'hour-display';
  hourSpan.innerText = '00';
  const separator = document.createTextNode(':');
  
  const stopwatch = document.getElementById('stopwatch');
  stopwatch.insertBefore(hourSpan, document.getElementById('minute-display'));
  stopwatch.insertBefore(separator, document.getElementById('minute-display'));
}
