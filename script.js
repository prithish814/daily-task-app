// Get HTML elements
const taskInput = document.getElementById("task-input");
const addButton = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");


// Store tasks in an array
let tasks = [];


// Get today's date in YYYY-MM-DD format
function getTodayDate() {

    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


// Save tasks in localStorage
function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));

}


// Load tasks from localStorage
function loadTasks() {

    tasks = JSON.parse(localStorage.getItem("tasks")) || [];

}

// Update Dashboard
function updateDashboard() {

    // Get today's tasks
    const todayTasks = tasks.filter(function(task) {
        return task.date === getTodayDate();
    });

    // Calculate total tasks
    const totalTasks = todayTasks.length;

    // Calculate completed tasks
    const completedTasks = todayTasks.filter(function(task) {
        return task.done === true;
    }).length;

    // Calculate remaining tasks
    const remainingTasks = totalTasks - completedTasks;

    // Calculate productivity score
    const score = totalTasks === 0
        ? 0
        : Math.round((completedTasks / totalTasks) * 100);

    // Display dashboard values
    document.getElementById("completed-count").textContent = completedTasks;

    document.getElementById("remaining-count").textContent = remainingTasks;

    document.getElementById("score").textContent = score + "%";

    // Update progress bar
    document.getElementById("progress-bar").style.width = score + "%";

}


// Display tasks on the webpage
function displayTasks() {

    taskList.innerHTML = "";

    const todayTasks = tasks.filter(function(task) {
        return task.date === getTodayDate();
    });

    todayTasks.forEach(function(task) {

        const li = document.createElement("li");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.done;

        const span = document.createElement("span");
        span.textContent = task.text;

        if (task.done) {
            span.classList.add("completed");
        }

        // Checkbox functionality
        checkbox.addEventListener("change", function() {

            task.done = checkbox.checked;

            saveTasks();
            displayTasks();

        });

        // Delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function() {

            tasks = tasks.filter(function(t) {
                return t.id !== task.id;
            });

            saveTasks();
            displayTasks();

        });

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteButton);

        taskList.appendChild(li);

    });

    updateDashboard();

}


// Add new task
addButton.addEventListener("click", function() {

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    const newTask = {

        id: Date.now(),
        text: taskText,
        done: false,
        date: getTodayDate()

    };

    tasks.push(newTask);

    saveTasks();

    displayTasks();

    taskInput.value = "";

});


// Load saved tasks when page opens
loadTasks();
displayTasks();

// Register Service Worker
if ("serviceWorker" in navigator) {

    window.addEventListener("load", function() {

        navigator.serviceWorker.register("./service-worker.js")

            .then(function(registration) {

                console.log("Service Worker registered successfully!");

            })

            .catch(function(error) {

                console.log("Service Worker registration failed:", error);

            });

    });

}