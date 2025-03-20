
const moodButtons = document.querySelectorAll(".mood-btn");
const moodHistory = document.getElementById("mood-history");
const calendar = document.getElementById("calendar");

// Load stored moods on page load
loadMoods();
generateCalendar();

// Event listener for mood buttons
moodButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const selectedMood = this.getAttribute("data-mood");
    saveMood(selectedMood);
    loadMoods();
    generateCalendar();
  });
});

// Function to save mood in LocalStorage
function saveMood(mood) {
  let moods = JSON.parse(localStorage.getItem("moodTracker")) || [];
  const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD

  // Check if today's mood is already logged, update it
  const existingMoodIndex = moods.findIndex((entry) => entry.date === today);
  if (existingMoodIndex !== -1) {
    moods[existingMoodIndex].mood = mood;
  } else {
    moods.push({ date: today, mood: mood });
  }

  localStorage.setItem("moodTracker", JSON.stringify(moods));
}

// Function to load moods from LocalStorage
function loadMoods() {
  const moods = JSON.parse(localStorage.getItem("moodTracker")) || [];
  moodHistory.innerHTML = ""; // Clear existing history

  moods.forEach((entry) => {
    const moodEntry = document.createElement("div");
    moodEntry.classList.add("mood-entry");
    moodEntry.innerHTML = `<span>${entry.date}</span> <span>${entry.mood}</span>`;
    moodHistory.appendChild(moodEntry);
  });
}

// Function to generate calendar view
function generateCalendar() {
  const moods = JSON.parse(localStorage.getItem("moodTracker")) || [];
  calendar.innerHTML = ""; // Clear previous calendar

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const firstDay = new Date(year, month, 1).getDay(); // Day index (0-6)
  const daysInMonth = new Date(year, month + 1, 0).getDate(); // Get total days in month

  // Fill empty spaces before first day
  for (let i = 0; i < firstDay; i++) {
    const emptyDay = document.createElement("div");
    emptyDay.classList.add("day");
    calendar.appendChild(emptyDay);
  }

  // Populate calendar days
  for (let day = 1; day <= daysInMonth; day++) {
    const dayElement = document.createElement("div");
    dayElement.classList.add("day");

    const dateKey = `${year}-${(month + 1).toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;
    const moodEntry = moods.find((entry) => entry.date === dateKey);

    if (moodEntry) {
      dayElement.textContent = moodEntry.mood;
    } else {
      dayElement.textContent = day;
    }

    // Highlight today's date
    if (dateKey === new Date().toISOString().split("T")[0]) {
      dayElement.classList.add("today");
    }

    calendar.appendChild(dayElement);
  }
}


// Function to toggle collapsible mood history
function toggleHistory() {
  let content = document.getElementById("mood-history");
  if (content.style.maxHeight) {
    content.style.maxHeight = null; // Collapse
  } else {
    content.style.maxHeight = content.scrollHeight + "px"; // Expand
  }
}
