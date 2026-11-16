
// ===================================
// DEADLINE OS - DAY 2
// Progress Tracking + Local Storage
// ===================================

// Default project settings
const defaultSettings = {
    title: "AI ENGINEER",
    startDate: "2026-11-16T00:00",
    deadline: "2027-04-30T23:59"
};

// Load previously saved settings
let settings = JSON.parse(
    localStorage.getItem("deadlineSettings")
) || defaultSettings;

let startDate = new Date(settings.startDate).getTime();
let deadline = new Date(settings.deadline).getTime();

// HTML elements
const titleInput = document.getElementById("titleInput");
const startDateInput =
    document.getElementById("startDateInput");
const dateInput = document.getElementById("dateInput");

const goalTitle =
    document.getElementById("goalTitle");

const progressBar =
    document.getElementById("progressBar");

const progressText =
    document.getElementById("progressText");

// Display saved settings in the form
titleInput.value = settings.title;
startDateInput.value = settings.startDate;
dateInput.value = settings.deadline;

// Update displayed goal
goalTitle.textContent = settings.title;

// Save settings in browser storage
function saveSettings() {

    settings = {
        title: titleInput.value.trim(),
        startDate: startDateInput.value,
        deadline: dateInput.value
    };

    localStorage.setItem(
        "deadlineSettings",
        JSON.stringify(settings)
    );
}

// Display current date
function updateToday() {

    document.getElementById("today").textContent =
        new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric"
        });
}

// Live digital clock
function updateClock() {

    document.getElementById("clock").textContent =
        new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        });
}

// Countdown and progress calculation
function updateCountdown() {

    const now = Date.now();
    const difference = deadline - now;

    // Calculate progress
    const totalDuration = deadline - startDate;
    const elapsedDuration = now - startDate;

    let progress =
        (elapsedDuration / totalDuration) * 100;

    progress = Math.max(0, Math.min(100, progress));

    progressBar.style.width = progress + "%";
    progressText.textContent = progress.toFixed(1) + "%";

    // Handle completed deadline
    if (difference <= 0) {

        ["days", "hours", "minutes", "seconds"]
            .forEach(id => {
                document.getElementById(id).textContent = "00";
            });

        goalTitle.textContent = settings.title +
            " - COMPLETED";

        return;
    }

    // Calculate remaining time
    const days = Math.floor(
        difference / (1000 * 60 * 60 * 24)
    );

    const hours = Math.floor(
        (difference / (1000 * 60 * 60)) % 24
    );

    const minutes = Math.floor(
        (difference / (1000 * 60)) % 60
    );

    const seconds = Math.floor(
        (difference / 1000) % 60
    );

    // Display countdown
    document.getElementById("days").textContent =
        String(days).padStart(3, "0");

    document.getElementById("hours").textContent =
        String(hours).padStart(2, "0");

    document.getElementById("minutes").textContent =
        String(minutes).padStart(2, "0");

    document.getElementById("seconds").textContent =
        String(seconds).padStart(2, "0");

    goalTitle.textContent = settings.title;
}

// Update button
document.getElementById("updateButton")
    .addEventListener("click", () => {

        const newStart =
            new Date(startDateInput.value).getTime();

        const newDeadline =
            new Date(dateInput.value).getTime();

        if (
            !titleInput.value.trim() ||
            !startDateInput.value ||
            !dateInput.value ||
            !Number.isFinite(newStart) ||
            !Number.isFinite(newDeadline) ||
            newDeadline <= newStart
        ) {
            alert(
                "Enter a goal and valid dates. " +
                "The deadline must be after the start date."
            );
            return;
        }

        startDate = newStart;
        deadline = newDeadline;

        saveSettings();

        goalTitle.textContent = settings.title;

        updateCountdown();

        alert("Your goal has been saved!");
    });

// Restore and run
updateToday();
updateClock();
updateCountdown();

// Refresh every second
setInterval(() => {
    updateClock();
    updateCountdown();
}, 1000);

// ===================================
// MILESTONE MANAGEMENT
// ===================================

// Load saved milestones
let milestones = JSON.parse(
    localStorage.getItem("deadlineMilestones")
) || [
    { id: 1, name: "Complete Machine Learning", completed: true },
    { id: 2, name: "Build AI portfolio", completed: false },
    { id: 3, name: "Apply for AI jobs", completed: false },
    { id: 4, name: "Launch your career", completed: false }
];

// Save milestones
function saveMilestones() {
    localStorage.setItem(
        "deadlineMilestones",
        JSON.stringify(milestones)
    );
}

// Display milestones
function renderMilestones() {

    const list = document.getElementById("milestoneList");

    list.innerHTML = "";

    milestones.forEach(milestone => {

        const item = document.createElement("div");

        item.className = "milestone";

        if (milestone.completed) {
            item.classList.add("completed");
        }

        const name = document.createElement("span");

        name.className = "milestone-name";
        name.textContent = milestone.name;

        const actions = document.createElement("div");

        actions.className = "milestone-actions";

        // Complete button
        const completeButton = document.createElement("button");

        completeButton.textContent =
            milestone.completed ? "✓" : "○";

        completeButton.title = "Toggle completion";

        completeButton.addEventListener("click", () => {

            milestone.completed = !milestone.completed;

            saveMilestones();
            renderMilestones();

        });

        // Delete button
        const deleteButton = document.createElement("button");

        deleteButton.textContent = "×";
        deleteButton.title = "Delete milestone";

        deleteButton.addEventListener("click", () => {

            milestones = milestones.filter(
                m => m.id !== milestone.id
            );

            saveMilestones();
            renderMilestones();

        });

        actions.append(completeButton, deleteButton);

        item.append(name, actions);

        list.appendChild(item);

    });
}

// Add a new milestone
document.getElementById("addMilestoneButton")
    .addEventListener("click", () => {

        const input =
            document.getElementById("milestoneInput");

        const name = input.value.trim();

        if (!name) {
            alert("Please enter a milestone.");
            return;
        }

        milestones.push({
            id: Date.now(),
            name: name,
            completed: false
        });

        saveMilestones();

        renderMilestones();

        input.value = "";

    });

// Initial display
renderMilestones();
