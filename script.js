let startTime;
let timerInterval;
let lapCounter = 0;
let previousLapTime = 0;
let isStopwatchActive = false;
let pausedTime = 0;

// Start the stopwatch
function startStopwatch() {
  if (!isStopwatchActive) {
    isStopwatchActive = true;
    startTime = Date.now() - pausedTime; // Adjust for paused time
    timerInterval = setInterval(updateDisplay, 10);

    toggleButtonVisibility({ start: 'none', stop: 'inline-block', lap: 'inline-block', reset: 'inline-block' });
    document.getElementById('lap').disabled = false;
  }
}

// Stop the stopwatch
function stopStopwatch() {
  isStopwatchActive = false;
  clearInterval(timerInterval);

  pausedTime = Date.now() - startTime; // Save paused time

  toggleButtonVisibility({ start: 'inline-block', stop: 'none', lap: 'inline-block', reset: 'inline-block' });
  document.getElementById('lap').disabled = true;
}

// Reset the stopwatch
function resetStopwatch() {
  isStopwatchActive = false;
  clearInterval(timerInterval);

  startTime = 0;
  pausedTime = 0;
  lapCounter = 0;
  previousLapTime = 0;

  updateDisplay(true); // Reset display

  // Clear laps
  document.getElementById('laps-container').innerHTML = '';
  document.getElementById('laps-table').style.display = 'none'; // Hide laps table

  // Reset buttons: only Start button visible
  toggleButtonVisibility({ start: 'inline-block', stop: 'none', lap: 'none', reset: 'none' });
}

// Update the stopwatch display
function updateDisplay(isReset = false) {
  const elapsedTime = new Date(Date.now() - startTime);

  let hours = elapsedTime.getUTCHours();  
  let minutes = elapsedTime.getUTCMinutes();
  let seconds = elapsedTime.getUTCSeconds();
  let milliseconds = Math.floor(elapsedTime.getUTCMilliseconds() / 10); 

  if (hours > 0) {
    document.getElementById('hour-display').classList.remove('hidden');
  } else {
    document.getElementById('hour-display').classList.add('hidden');
  }

  document.getElementById('hour-display').innerText = formatTime(hours);
  document.getElementById('minute-display').innerText = formatTime(minutes);
  document.getElementById('second-display').innerText = formatTime(seconds);
  document.getElementById('millisecond-display').innerText = formatMilliseconds(milliseconds);

  if (isReset) {
    resetDisplay();
  }
}

// Record the lap
function recordLap() {
  if (!isStopwatchActive) return; // Prevent lap recording when stopwatch is stopped

  const currentLapTime = Date.now() - startTime;
  const lapTime = currentLapTime - previousLapTime; // Calculate lap time based on the previous lap

  // Update previousLapTime for the next lap
  previousLapTime = currentLapTime;

  // Create formatted lap time and total time
  const formattedLapTime = formatLapDifference(lapTime);
  const formattedTotalTime = formatLapDifference(currentLapTime);

  // Create a new row for the lap
  const lapRow = document.createElement('tr');
  lapRow.innerHTML = `
    <td>${++lapCounter}</td>
    <td>${formattedLapTime}</td>
    <td>${formattedTotalTime}</td>
  `;

  // Prepend the new row to the laps table
  const lapsContainer = document.getElementById('laps-container');
  lapsContainer.insertBefore(lapRow, lapsContainer.firstChild);

  document.getElementById('laps-table').style.display = 'table'; // Show laps table
}

// Helper functions
function formatLapDifference(lapTime) {
  // Create a new Date object with lapTime milliseconds
  const lapDate = new Date(lapTime);

  // Extract time components from the Date object
  const minutes = lapDate.getUTCMinutes();
  const seconds = lapDate.getUTCSeconds();
  const milliseconds = Math.floor(lapDate.getUTCMilliseconds() / 10); // Convert ms to centiseconds

  // Format the components
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');
  const formattedMilliseconds = String(milliseconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}.${formattedMilliseconds}`;
}


function formatTime(time) {
  return time < 10 ? '0' + time : time;
}

function formatMilliseconds(ms) {
  return ms.toString().padStart(2, '0');
}

function resetDisplay() {
  document.getElementById('hour-display').classList.add('hidden');
  document.getElementById('hour-display').innerText = "00";
  document.getElementById('minute-display').innerText = "00";
  document.getElementById('second-display').innerText = "00";
  document.getElementById('millisecond-display').innerText = "00";
}

// Toggle button visibility
function toggleButtonVisibility({ start, stop, lap, reset }) {
  document.getElementById('start').style.display = start;
  document.getElementById('stop').style.display = stop;
  document.getElementById('lap').style.display = lap;
  document.getElementById('reset').style.display = reset;
}
