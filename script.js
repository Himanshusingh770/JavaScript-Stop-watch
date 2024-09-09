let hours = 0;
let minutes = 0;
let seconds = 0;
let milliseconds = 0;
let timerInterval;
let isStopwatchActive = false;
let previousLapTime = 0;
let lapCounter = 0;

// Start the stopwatch
function startStopwatch() {
  if (!isStopwatchActive) {
    isStopwatchActive = true;
    timerInterval = setInterval(updateDisplay, 10);

    // Show Stop, Lap, and Reset buttons
    document.getElementById('start').style.display = 'none';
    document.getElementById('stop').style.display = 'inline-block';
    document.getElementById('lap').style.display = 'inline-block';
    document.getElementById('lap').disabled = false; // Enable Lap button
    document.getElementById('reset').style.display = 'inline-block';
  }
}

// Stop the stopwatch
function stopStopwatch() {
  isStopwatchActive = false;
  clearInterval(timerInterval);

  // Show Start button again, hide Stop button
  document.getElementById('start').style.display = 'inline-block';
  document.getElementById('stop').style.display = 'none';

  // Disable Lap button
  document.getElementById('lap').disabled = true;
}

// Reset the stopwatch
function resetStopwatch() {
  isStopwatchActive = false;
  clearInterval(timerInterval);
  hours = 0;
  minutes = 0;
  seconds = 0;
  milliseconds = 0;
  previousLapTime = 0;
  lapCounter = 0;
  updateDisplay(true); // Reset display

  // Clear laps
  document.getElementById('laps-container').innerHTML = '';
  document.getElementById('laps-table').style.display = 'none'; // Hide laps table

  // Reset buttons: only Start button visible
  document.getElementById('start').style.display = 'inline-block';
  document.getElementById('stop').style.display = 'none';
  document.getElementById('lap').style.display = 'none';
  document.getElementById('reset').style.display = 'none';
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

// Record the lap and add it to the laps table
function recordLap() {
  if (document.getElementById('lap').disabled) return; // Prevent lap recording when button is disabled

  const currentLapTime = hours * 3600000 + minutes * 60000 + seconds * 1000 + milliseconds;
  const lapDifference = currentLapTime - previousLapTime;

  // Calculate the time components for the lap difference
  const lapHours = Math.floor(lapDifference / 3600000);
  const lapMinutes = Math.floor((lapDifference % 3600000) / 60000);
  const lapSeconds = Math.floor((lapDifference % 60000) / 1000);
  const lapMilliseconds = lapDifference % 1000;

  // Create a new row for the lap
  const lapRow = document.createElement('tr');
  lapRow.innerHTML = `
    <td>${++lapCounter}</td>
    <td>${formatTime(lapHours)}:${formatTime(lapMinutes)}:${formatTime(lapSeconds)}.${formatMilliseconds(lapMilliseconds)}</td>
    <td>${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}.${formatMilliseconds(milliseconds)}</td> <!-- Swapped order -->
  `;

  // Prepend the new row to the laps table (show most recent first)
  const lapsContainer = document.getElementById('laps-container');
  lapsContainer.insertBefore(lapRow, lapsContainer.firstChild); // Insert new row at the top

  document.getElementById('laps-table').style.display = 'table'; // Show laps table

  // Update the previous lap time
  previousLapTime = currentLapTime;
}
