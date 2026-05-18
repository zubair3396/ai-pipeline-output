# Requirements - Simple Stopwatch

## What to build
A single-page web application that functions as a stopwatch. The user can start, stop, reset, and record laps.

## Features
- A large time display showing minutes:seconds.milliseconds, starting at 00:00.00
- A "Start" button that begins counting up the elapsed time
- A "Stop" button that pauses the elapsed time (the time stays visible)
- A "Reset" button that returns the time to 00:00.00 and clears all laps
- A "Lap" button that records the current elapsed time to a list below the display
- The lap list shows each recorded lap with a numeric label (Lap 1, Lap 2, etc.) and the time at which it was recorded

## Tech
- Plain HTML, CSS, JavaScript - no framework
- Single file output preferred (index.html)
- Must work in Chrome without any build step

## Acceptance criteria
- On page load, the display shows 00:00.00 and the lap list is empty
- Clicking Start makes the display update in real time
- Clicking Stop pauses the time at its current value; the display does not change after Stop
- Clicking Reset returns the display to 00:00.00 and removes all laps
- Clicking Lap while the stopwatch is running adds a new entry to the lap list with the current time
- The Lap button does nothing when the stopwatch has never been started
- No console errors on load or during interaction
- Page is usable on a mobile screen (375px wide)
