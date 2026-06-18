/* ==========================================
   SMART STUDENT STUDY PLANNER
   PART 3A
   Setup + LocalStorage + Quotes + Goals
========================================== */

/* ==========================================
   DOM ELEMENTS
========================================== */

// Theme
const themeToggle = document.getElementById("themeToggle");

// Toast
const toast = document.getElementById("toast");

// Goals
const goalInput = document.getElementById("goalInput");
const addGoalBtn = document.getElementById("addGoalBtn");
const goalList = document.getElementById("goalList");

// Motivation
const quoteText = document.getElementById("quoteText");
const newQuoteBtn = document.getElementById("newQuoteBtn");

/* ==========================================
   LOCAL STORAGE KEYS
========================================== */

const STORAGE_KEYS = {
    TASKS: "ssp_tasks",
    GOALS: "ssp_goals",
    THEME: "ssp_theme",
    PLANNER: "ssp_planner",
    SESSIONS: "ssp_sessions",
    STREAK: "ssp_streak"
};

/* ==========================================
   APP STATE
========================================== */

let tasks = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.TASKS)
) || [];

let goals = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.GOALS)
) || [];

/* ==========================================
   TOAST NOTIFICATION
========================================== */

function showToast(message = "Action completed") {

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

/* ==========================================
   MOTIVATIONAL QUOTES
========================================== */

const motivationalQuotes = [

    "Success is the sum of small efforts repeated day in and day out.",

    "The future depends on what you do today.",

    "Push yourself because no one else is going to do it for you.",

    "Discipline beats motivation.",

    "Dream big. Start small. Act now.",

    "Every expert was once a beginner.",

    "Consistency is more important than perfection.",

    "Small progress is still progress.",

    "Focus on improvement, not perfection.",

    "Study while others are sleeping. Work while others are wishing."

];

/* ==========================================
   LOAD RANDOM QUOTE
========================================== */

function loadRandomQuote() {

    const randomIndex =
        Math.floor(
            Math.random() *
            motivationalQuotes.length
        );

    quoteText.textContent =
        motivationalQuotes[randomIndex];
}

/* ==========================================
   QUOTE BUTTON EVENT
========================================== */

newQuoteBtn.addEventListener("click", () => {

    loadRandomQuote();

    showToast("New motivation loaded!");
});

/* ==========================================
   DARK MODE
========================================== */

function loadTheme() {

    const savedTheme =
        localStorage.getItem(
            STORAGE_KEYS.THEME
        );

    if (savedTheme === "light") {

        document.body.classList.add(
            "dark-mode"
        );
    }
}

function toggleTheme() {

    document.body.classList.toggle(
        "dark-mode"
    );

    const currentTheme =
        document.body.classList.contains(
            "dark-mode"
        )
            ? "light"
            : "dark";

    localStorage.setItem(
        STORAGE_KEYS.THEME,
        currentTheme
    );

    showToast("Theme updated");
}

themeToggle.addEventListener(
    "click",
    toggleTheme
);

/* ==========================================
   DAILY GOALS
========================================== */

function saveGoals() {

    localStorage.setItem(
        STORAGE_KEYS.GOALS,
        JSON.stringify(goals)
    );
}

/* ==========================================
   CREATE GOAL
========================================== */

function addGoal() {

    const goalText =
        goalInput.value.trim();

    if (!goalText) {

        showToast(
            "Please enter a goal"
        );

        return;
    }

    const goal = {

        id: Date.now(),

        text: goalText
    };

    goals.push(goal);

    saveGoals();

    renderGoals();

    goalInput.value = "";

    showToast("Goal added");
}

/* ==========================================
   DELETE GOAL
========================================== */

function deleteGoal(id) {

    goals = goals.filter(
        goal => goal.id !== id
    );

    saveGoals();

    renderGoals();

    showToast("Goal deleted");
}

/* ==========================================
   RENDER GOALS
========================================== */

function renderGoals() {

    goalList.innerHTML = "";

    if (goals.length === 0) {

        goalList.innerHTML = `
            <li class="goal-item">
                <span>
                    No goals added yet.
                </span>
            </li>
        `;

        return;
    }

    goals.forEach(goal => {

        const li =
            document.createElement("li");

        li.className = "goal-item";

        li.innerHTML = `
            <span>${goal.text}</span>

            <button
                class="goal-delete"
                onclick="deleteGoal(${goal.id})"
            >
                ✕
            </button>
        `;

        goalList.appendChild(li);
    });
}

/* ==========================================
   ADD GOAL EVENTS
========================================== */

addGoalBtn.addEventListener(
    "click",
    addGoal
);

goalInput.addEventListener(
    "keypress",
    (e) => {

        if (e.key === "Enter") {

            addGoal();
        }
    }
);

/* ==========================================
   MAKE FUNCTION GLOBAL
========================================== */

window.deleteGoal = deleteGoal;

/* ==========================================
   INITIAL LOAD
========================================== */

loadTheme();

loadRandomQuote();

renderGoals();

/* ==========================================
   PART 3A END
========================================== *//* ==========================================
   PART 3B
   TASK MANAGER + FILTERS + DASHBOARD
========================================== */

/* ==========================================
   TASK DOM ELEMENTS
========================================== */

const taskTitle =
    document.getElementById("taskTitle");

const taskSubject =
    document.getElementById("taskSubject");

const taskPriority =
    document.getElementById("taskPriority");

const taskDate =
    document.getElementById("taskDate");

const addTaskBtn =
    document.getElementById("addTaskBtn");

const taskContainer =
    document.getElementById("taskContainer");

const emptyTaskState =
    document.getElementById("emptyTaskState");

/* Search & Filters */

const searchTask =
    document.getElementById("searchTask");

const filterSubject =
    document.getElementById("filterSubject");

const filterPriority =
    document.getElementById("filterPriority");

/* Dashboard */

const totalTasksEl =
    document.getElementById("totalTasks");

const completedTasksEl =
    document.getElementById("completedTasks");

const pendingTasksEl =
    document.getElementById("pendingTasks");

const progressPercentEl =
    document.getElementById("progressPercent");

const progressLabel =
    document.getElementById("progressLabel");

const progressFill =
    document.getElementById("progressFill");

/* Statistics */

const highPriorityCount =
    document.getElementById("highPriorityCount");

const mediumPriorityCount =
    document.getElementById("mediumPriorityCount");

const lowPriorityCount =
    document.getElementById("lowPriorityCount");

/* Edit Modal */

const editModal =
    document.getElementById("editModal");

const editTaskTitle =
    document.getElementById("editTaskTitle");

const editTaskSubject =
    document.getElementById("editTaskSubject");

const editTaskPriority =
    document.getElementById("editTaskPriority");

const editTaskDate =
    document.getElementById("editTaskDate");

const saveTaskEdit =
    document.getElementById("saveTaskEdit");

const closeModal =
    document.getElementById("closeModal");

/* ==========================================
   TASK STORAGE
========================================== */

function saveTasks() {

    localStorage.setItem(
        STORAGE_KEYS.TASKS,
        JSON.stringify(tasks)
    );
}

/* ==========================================
   ADD TASK
========================================== */

function addTask() {

    const title =
        taskTitle.value.trim();

    const subject =
        taskSubject.value;

    const priority =
        taskPriority.value;

    const dueDate =
        taskDate.value;

    if (
        !title ||
        !subject ||
        !priority ||
        !dueDate
    ) {
        showToast(
            "Please fill all fields"
        );

        return;
    }

    const task = {

        id: Date.now(),

        title,

        subject,

        priority,

        dueDate,

        completed: false
    };

    tasks.push(task);

    saveTasks();

    renderTasks();

    updateDashboard();

    clearTaskForm();

    showToast("Task added");
}

/* ==========================================
   CLEAR FORM
========================================== */

function clearTaskForm() {

    taskTitle.value = "";
    taskSubject.value = "";
    taskPriority.value = "";
    taskDate.value = "";
}

/* ==========================================
   DELETE TASK
========================================== */

function deleteTask(id) {

    tasks = tasks.filter(
        task => task.id !== id
    );

    saveTasks();

    renderTasks();

    updateDashboard();

    showToast("Task deleted");
}

/* ==========================================
   COMPLETE TASK
========================================== */

function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {

            task.completed =
                !task.completed;
        }

        return task;
    });

    saveTasks();

    renderTasks();

    updateDashboard();

    showToast("Task updated");
}

/* ==========================================
   EDIT TASK
========================================== */

let currentEditId = null;

function openEditModal(id) {

    const task =
        tasks.find(
            t => t.id === id
        );

    if (!task) return;

    currentEditId = id;

    editTaskTitle.value =
        task.title;

    editTaskSubject.value =
        task.subject;

    editTaskPriority.value =
        task.priority;

    editTaskDate.value =
        task.dueDate;

    editModal.classList.add(
        "active"
    );
}

function closeEditModal() {

    editModal.classList.remove(
        "active"
    );

    currentEditId = null;
}

function saveEditedTask() {

    if (!currentEditId) return;

    tasks = tasks.map(task => {

        if (
            task.id === currentEditId
        ) {

            task.title =
                editTaskTitle.value;

            task.subject =
                editTaskSubject.value;

            task.priority =
                editTaskPriority.value;

            task.dueDate =
                editTaskDate.value;
        }

        return task;
    });

    saveTasks();

    renderTasks();

    updateDashboard();

    closeEditModal();

    showToast(
        "Task updated successfully"
    );
}

/* ==========================================
   FILTER TASKS
========================================== */

function getFilteredTasks() {

    let filtered = [...tasks];

    const searchValue =
        searchTask.value
        .toLowerCase()
        .trim();

    const subjectFilter =
        filterSubject.value;

    const priorityFilter =
        filterPriority.value;

    /* Search */

    if (searchValue) {

        filtered =
            filtered.filter(task =>
                task.title
                .toLowerCase()
                .includes(searchValue)
            );
    }

    /* Subject */

    if (
        subjectFilter !== "all"
    ) {

        filtered =
            filtered.filter(
                task =>
                task.subject ===
                subjectFilter
            );
    }

    /* Priority */

    if (
        priorityFilter !== "all"
    ) {

        filtered =
            filtered.filter(
                task =>
                task.priority ===
                priorityFilter
            );
    }

    return filtered;
}

/* ==========================================
   RENDER TASKS
========================================== */

function renderTasks() {

    const filteredTasks =
        getFilteredTasks();

    taskContainer.innerHTML = "";

    if (
        filteredTasks.length === 0
    ) {

        emptyTaskState.style.display =
            "block";

        return;
    }

    emptyTaskState.style.display =
        "none";

    filteredTasks.forEach(task => {

        const card =
            document.createElement(
                "div"
            );

        let priorityClass =
            "";

        if (
            task.priority ===
            "High"
        ) {
            priorityClass =
                "priority-high-card";
        }

        if (
            task.priority ===
            "Medium"
        ) {
            priorityClass =
                "priority-medium-card";
        }

        if (
            task.priority ===
            "Low"
        ) {
            priorityClass =
                "priority-low-card";
        }

        card.className = `
            glass
            task-card
            ${priorityClass}
            ${task.completed
                ? "completed"
                : ""}
        `;

        card.innerHTML = `

            <div class="task-header">

                <div>

                    <div class="task-title">
                        ${task.title}
                    </div>

                    <div class="task-info">

                        <span class="task-tag subject-tag">
                            ${task.subject}
                        </span>

                        <span class="
                            task-tag
                            priority-${task.priority.toLowerCase()}
                        ">
                            ${task.priority}
                        </span>

                        <span class="task-tag date-tag">
                            ${task.dueDate}
                        </span>

                    </div>

                </div>

            </div>

            <div class="task-actions">

                <button
                    class="task-btn complete-btn"
                    onclick="toggleTask(${task.id})"
                >
                    ${
                        task.completed
                        ? "Undo"
                        : "Complete"
                    }
                </button>

                <button
                    class="task-btn edit-btn"
                    onclick="openEditModal(${task.id})"
                >
                    Edit
                </button>

                <button
                    class="task-btn delete-btn"
                    onclick="deleteTask(${task.id})"
                >
                    Delete
                </button>

            </div>
        `;

        taskContainer.appendChild(
            card
        );
    });
}

/* ==========================================
   DASHBOARD CALCULATIONS
========================================== */

function updateDashboard() {

    const total =
        tasks.length;

    const completed =
        tasks.filter(
            task =>
            task.completed
        ).length;

    const pending =
        total - completed;

    const percentage =
        total === 0
        ? 0
        : Math.round(
            (
                completed /
                total
            ) * 100
        );

    totalTasksEl.textContent =
        total;

    completedTasksEl.textContent =
        completed;

    pendingTasksEl.textContent =
        pending;

    progressPercentEl.textContent =
        `${percentage}%`;

    progressLabel.textContent =
        `${percentage}%`;

    progressFill.style.width =
        `${percentage}%`;

    updateStatistics();
}

/* ==========================================
   PRODUCTIVITY STATS
========================================== */

function updateStatistics() {

    const high =
        tasks.filter(
            task =>
            task.priority ===
            "High"
        ).length;

    const medium =
        tasks.filter(
            task =>
            task.priority ===
            "Medium"
        ).length;

    const low =
        tasks.filter(
            task =>
            task.priority ===
            "Low"
        ).length;

    highPriorityCount.textContent =
        high;

    mediumPriorityCount.textContent =
        medium;

    lowPriorityCount.textContent =
        low;
}

/* ==========================================
   EVENT LISTENERS
========================================== */

addTaskBtn.addEventListener(
    "click",
    addTask
);

searchTask.addEventListener(
    "input",
    renderTasks
);

filterSubject.addEventListener(
    "change",
    renderTasks
);

filterPriority.addEventListener(
    "change",
    renderTasks
);

saveTaskEdit.addEventListener(
    "click",
    saveEditedTask
);

closeModal.addEventListener(
    "click",
    closeEditModal
);

/* ==========================================
   GLOBAL ACCESS
========================================== */

window.deleteTask =
    deleteTask;

window.toggleTask =
    toggleTask;

window.openEditModal =
    openEditModal;

/* ==========================================
   INITIAL LOAD
========================================== */

renderTasks();

updateDashboard();

/* ==========================================
   PART 3B END
========================================== *//* ==========================================
   PART 3C
   WEEKLY PLANNER + POMODORO + STREAK
========================================== */

/* ==========================================
   WEEKLY PLANNER
========================================== */

const savePlannerBtn =
    document.getElementById(
        "savePlannerBtn"
    );

const plannerTextareas =
    document.querySelectorAll(
        "[data-day]"
    );

/* Save Weekly Planner */

function savePlanner() {

    const plannerData = {};

    plannerTextareas.forEach(area => {

        const day =
            area.dataset.day;

        plannerData[day] =
            area.value;
    });

    localStorage.setItem(
        STORAGE_KEYS.PLANNER,
        JSON.stringify(
            plannerData
        )
    );

    showToast(
        "Weekly planner saved"
    );
}

/* Load Weekly Planner */

function loadPlanner() {

    const savedPlanner =
        JSON.parse(
            localStorage.getItem(
                STORAGE_KEYS.PLANNER
            )
        ) || {};

    plannerTextareas.forEach(area => {

        const day =
            area.dataset.day;

        area.value =
            savedPlanner[day] || "";
    });
}

savePlannerBtn.addEventListener(
    "click",
    savePlanner
);

/* ==========================================
   POMODORO TIMER
========================================== */

const timerDisplay =
    document.getElementById(
        "timerDisplay"
    );

const startTimerBtn =
    document.getElementById(
        "startTimer"
    );

const pauseTimerBtn =
    document.getElementById(
        "pauseTimer"
    );

const resetTimerBtn =
    document.getElementById(
        "resetTimer"
    );

const sessionCountEl =
    document.getElementById(
        "sessionCount"
    );

const totalSessionsEl =
    document.getElementById(
        "totalSessions"
    );

/* Timer Variables */

let pomodoroTime = 25 * 60;

let timerInterval = null;

let timerRunning = false;

let sessionCount =
    parseInt(
        localStorage.getItem(
            STORAGE_KEYS.SESSIONS
        )
    ) || 0;

/* Update Session Display */

function updateSessionDisplay() {

    sessionCountEl.textContent =
        sessionCount;

    totalSessionsEl.textContent =
        sessionCount;
}

/* Format Time */

function updateTimerDisplay() {

    const minutes =
        Math.floor(
            pomodoroTime / 60
        );

    const seconds =
        pomodoroTime % 60;

    timerDisplay.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

/* Start Timer */

function startPomodoro() {

    if (timerRunning) return;

    timerRunning = true;

    timerInterval =
        setInterval(() => {

            pomodoroTime--;

            updateTimerDisplay();

            if (
                pomodoroTime <= 0
            ) {

                clearInterval(
                    timerInterval
                );

                timerRunning =
                    false;

                sessionCount++;

                localStorage.setItem(
                    STORAGE_KEYS.SESSIONS,
                    sessionCount
                );

                updateSessionDisplay();

                updateStudyStreak();

                showToast(
                    "Pomodoro session completed!"
                );

                pomodoroTime =
                    25 * 60;

                updateTimerDisplay();
            }

        }, 1000);
}

/* Pause Timer */

function pausePomodoro() {

    clearInterval(
        timerInterval
    );

    timerRunning = false;

    showToast(
        "Timer paused"
    );
}

/* Reset Timer */

function resetPomodoro() {

    clearInterval(
        timerInterval
    );

    timerRunning = false;

    pomodoroTime =
        25 * 60;

    updateTimerDisplay();

    showToast(
        "Timer reset"
    );
}

/* Timer Events */

startTimerBtn.addEventListener(
    "click",
    startPomodoro
);

pauseTimerBtn.addEventListener(
    "click",
    pausePomodoro
);

resetTimerBtn.addEventListener(
    "click",
    resetPomodoro
);

/* ==========================================
   STUDY STREAK TRACKER
========================================== */

const streakCountEl =
    document.getElementById(
        "streakCount"
    );

/*
Structure:

{
    streak: 5,
    lastDate: "2026-06-17"
}
*/

function getTodayDate() {

    return new Date()
        .toISOString()
        .split("T")[0];
}

function loadStreak() {

    const streakData =
        JSON.parse(
            localStorage.getItem(
                STORAGE_KEYS.STREAK
            )
        ) || {
            streak: 0,
            lastDate: null
        };

    streakCountEl.textContent =
        streakData.streak;
}

/* Update Streak After Session */

function updateStudyStreak() {

    const today =
        getTodayDate();

    let streakData =
        JSON.parse(
            localStorage.getItem(
                STORAGE_KEYS.STREAK
            )
        ) || {
            streak: 0,
            lastDate: null
        };

    if (
        streakData.lastDate ===
        today
    ) {
        return;
    }

    const yesterday =
        new Date();

    yesterday.setDate(
        yesterday.getDate() - 1
    );

    const yesterdayString =
        yesterday
        .toISOString()
        .split("T")[0];

    if (
        streakData.lastDate ===
        yesterdayString
    ) {

        streakData.streak += 1;

    } else {

        streakData.streak = 1;
    }

    streakData.lastDate =
        today;

    localStorage.setItem(
        STORAGE_KEYS.STREAK,
        JSON.stringify(
            streakData
        )
    );

    streakCountEl.textContent =
        streakData.streak;
}

/* ==========================================
   AUTO SAVE WEEKLY PLANNER
========================================== */

plannerTextareas.forEach(area => {

    area.addEventListener(
        "input",
        () => {

            const plannerData = {};

            plannerTextareas.forEach(
                item => {

                    plannerData[
                        item.dataset.day
                    ] = item.value;
                }
            );

            localStorage.setItem(
                STORAGE_KEYS.PLANNER,
                JSON.stringify(
                    plannerData
                )
            );
        }
    );
});

/* ==========================================
   APP INITIALIZATION
========================================== */

function initializeApp() {

    loadTheme();

    loadPlanner();

    renderGoals();

    renderTasks();

    updateDashboard();

    updateStatistics();

    updateTimerDisplay();

    updateSessionDisplay();

    loadStreak();

    loadRandomQuote();
}

initializeApp();

/* ==========================================
   CLOSE MODAL ON OUTSIDE CLICK
========================================== */

window.addEventListener(
    "click",
    (e) => {

        if (
            e.target === editModal
        ) {

            closeEditModal();
        }
    }
);

/* ==========================================
   KEYBOARD SHORTCUTS
========================================== */

/*
Ctrl + Enter
Quick Add Task
*/

document.addEventListener(
    "keydown",
    (e) => {

        if (
            e.ctrlKey &&
            e.key === "Enter"
        ) {

            if (
                taskTitle.value.trim()
            ) {

                addTask();
            }
        }
    }
);

/* ==========================================
   PAGE LOAD ANIMATION
========================================== */

window.addEventListener(
    "load",
    () => {

        document.body.style.opacity =
            "1";
    }
);

/* ==========================================
   FINAL SAFETY CHECK
========================================== */

if (
    !localStorage.getItem(
        STORAGE_KEYS.SESSIONS
    )
) {

    localStorage.setItem(
        STORAGE_KEYS.SESSIONS,
        "0"
    );
}

/* ==========================================
   END OF SCRIPT.JS
========================================== */