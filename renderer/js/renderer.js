// get elements by id
const modal = document.getElementById("taskModal");
const addbtn = document.getElementById("add-task-btn");
const closebtn =  document.getElementById("close");
const savebtn = document.getElementById("saveTask");
const taskInput = document.getElementById("modalInput");
const taskList = document.getElementById("taskList");

let tasks = [];

// open modal on button click
addbtn.onclick = function() {
    modal.style.display = "flex";
    taskInput.value='';
}

// close modal button
closebtn.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// render tasks to UI
function renderTasks() {
  taskList.innerHTML = ''; // clear list
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.textContent = task.name;

    // delete button
    const deletebtn = document.createElement('button');
    deletebtn.classList.add('delete-btn');
    //deletebtn.textContent = 'X';

    deletebtn.onclick = function(event) {
        event.stopPropagation();
        tasks.splice(index, 1);
        window.taskAPI.saveTasks(task);
        renderTasks();
    };

    li.appendChild(deletebtn);
    
    // complete or incomplete
    if(task.completed) {
        li.classList.add('completed');
    }

    // listener
    li.onclick = function () {
        tasks[index].completed = !tasks[index].completed;
        renderTasks();
        window.taskAPI.saveTasks(tasks);
    }

    taskList.appendChild(li);
  });
}

// save task handler
savebtn.onclick = async () => {
  const taskText = taskInput.value.trim();
  if (!taskText) {
    alert('Enter an item!');
    return;
  }

  tasks.push({ name: taskText, completed: false }); // Add new task to array
  renderTasks();

  // Save tasks to disk via preload API
  const response = await window.taskAPI.saveTasks(tasks);
  if (response.success) {
    console.log('Tasks saved!');
  } else {
    alert('Failed to save tasks: ' + response.error);
  }

  modal.style.display = "none";
};

// load tasks on startup
(async () => {
  try {
    tasks = await window.taskAPI.loadTasks();
    if (!Array.isArray(tasks)) throw new Error();
  } catch (e) {
    console.warn("Could not parse tasks, defaulting to empty array.");
    tasks = [];
  }
  renderTasks();
})();