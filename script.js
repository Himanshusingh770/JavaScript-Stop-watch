let startTime;
let timerInterval;
let lapCounter = 0;
let previousLapTime = 0;
let isStopwatchActive = false;

// Start the stopwatch
function startStopwatch() {
  if (!isStopwatchActive) {
    isStopwatchActive = true;
    startTime = Date.now() - (previousLapTime || 0); // Adjust for time after a lap or pause
    timerInterval = setInterval(updateDisplay, 10);

    toggleButtonVisibility({ start: 'none', stop: 'inline-block', lap: 'inline-block', reset: 'inline-block' });
    document.getElementById('lap').disabled = false;
  }
}

// Stop the stopwatch
function stopStopwatch() {
  isStopwatchActive = false;
  clearInterval(timerInterval);

  previousLapTime = Date.now() - startTime;

  toggleButtonVisibility({ start: 'inline-block', stop: 'none', lap: 'inline-block', reset: 'inline-block' });
  document.getElementById('lap').disabled = true;
}

// Reset the stopwatch
function resetStopwatch() {
  isStopwatchActive = false;
  clearInterval(timerInterval);

  startTime = 0;
  previousLapTime = 0;
  lapCounter = 0;

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

  // Using Date methods to extract time components
  let minutes = elapsedTime.getUTCMinutes();
  let seconds = elapsedTime.getUTCSeconds();
  let milliseconds = Math.floor(elapsedTime.getUTCMilliseconds() / 10); // Convert ms to centiseconds

  // Update display with formatted time
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
  const lapDifference = currentLapTime - previousLapTime;

  // Calculate time components for lap difference
  const formattedLapDiff = formatLapDifference(lapDifference);
  const formattedTotalTime = formatLapDifference(currentLapTime);

  // Create a new row for the lap
  const lapRow = document.createElement('tr');
  lapRow.innerHTML = `
    <td>${++lapCounter}</td>
    <td>${formattedLapDiff}</td>
    <td>${formattedTotalTime}</td>
  `;

  // Prepend the new row to the laps table (show most recent lap first)
  const lapsContainer = document.getElementById('laps-container');
  lapsContainer.insertBefore(lapRow, lapsContainer.firstChild);

  document.getElementById('laps-table').style.display = 'table'; // Show laps table

  // Update the previous lap time
  previousLapTime = currentLapTime;
}

// Helper function to format lap differences
function formatLapDifference(lapTime) {
  let minutes = Math.floor(lapTime / 60000);
  let seconds = Math.floor((lapTime % 60000) / 1000);
  let milliseconds = Math.floor((lapTime % 1000) / 10);

  return `${formatTime(minutes)}:${formatTime(seconds)}.${formatMilliseconds(milliseconds)}`;
}

// Helper functions for formatting time
function formatTime(time) {
  return time < 10 ? '0' + time : time;
}

function formatMilliseconds(ms) {
  return ms.toString().padStart(2, '0');
}

// Helper function to reset the display
function resetDisplay() {
  document.getElementById('minute-display').innerText = "00";
  document.getElementById('second-display').innerText = "00";
  document.getElementById('millisecond-display').innerText = "00";
}

// Helper function to toggle visibility of buttons
function toggleButtonVisibility({ start, stop, lap, reset }) {
  document.getElementById('start').style.display = start;
  document.getElementById('stop').style.display = stop;
  document.getElementById('lap').style.display = lap;
  document.getElementById('reset').style.display = reset;
}
