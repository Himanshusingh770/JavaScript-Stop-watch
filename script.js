let startTime;
let timerInterval;
let lapCounter = 0;
let previousLapTime = 0;
let isStopwatchActive = false;
let pausedTime = 0;

// Toggle button visibility
function toggleButtonVisibility({ start, stop, lap, reset }) {
  document.getElementById('start').style.display = start;
  document.getElementById('stop').style.display = stop;
  document.getElementById('lap').style.display = lap;
  document.getElementById('reset').style.display = reset;
}

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
  const elapsedTime = Date.now() - startTime;

  // Create a Date object with the elapsed time in milliseconds
  const elapsedDate = new Date(elapsedTime);

  let hours = elapsedDate.getUTCHours(); // Get hours
  let minutes = elapsedDate.getUTCMinutes(); // Get minutes
  let seconds = elapsedDate.getUTCSeconds(); // Get seconds
  let milliseconds = Math.floor(elapsedDate.getUTCMilliseconds() / 10); // Convert ms to centiseconds

  // Format the time and display it
  if (hours > 0) {
    document.getElementById('timeDisplay').innerText = `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}.${formatMilliseconds(milliseconds)}`;
  } else {
    document.getElementById('timeDisplay').innerText = `${formatTime(minutes)}:${formatTime(seconds)}.${formatMilliseconds(milliseconds)}`;
  }

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

// Format lap time
function formatLapDifference(lapTime) {
  const lapDate = new Date(lapTime);

  const minutes = lapDate.getUTCMinutes();
  const seconds = lapDate.getUTCSeconds();
  const milliseconds = Math.floor(lapDate.getUTCMilliseconds() / 10); // Convert ms to centiseconds

  return `${formatTime(minutes)}:${formatTime(seconds)}.${formatMilliseconds(milliseconds)}`;
}

// Helper functions
function formatTime(time) {
  return time < 10 ? '0' + time : time;
}

function formatMilliseconds(ms) {
  return ms.toString().padStart(2, '0');
}

function resetDisplay() {
  document.getElementById('timeDisplay').innerText = "00:00:00";
}
