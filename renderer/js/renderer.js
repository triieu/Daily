// get elements by id
const modal = document.getElementById("taskModal");
const togglebtn = document.getElementById("toggle-theme")
const body = document.body;
const addbtn = document.getElementById("add-task-btn");
const closebtn =  document.getElementById("close");
const savebtn = document.getElementById("saveTask");
const taskInput = document.getElementById("modalInput");
const taskList = document.getElementById("taskList");
const quote = document.getElementById('quote');

const defaultQuote = `"today will be a good day."`;

let data = {
    quote: {defaultQuote},
    tasks: []
};

togglebtn.addEventListener('click', () => {
  body.classList.toggle('dark-mode');

  const isDark = body.classList.contains('dark-mode');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
})

window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if  (savedTheme === 'dark') {
    body.classList.add('dark-mode');
  }
})

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

// quote
quote.addEventListener('blur', async() => {
    data.quote = quote.innerText.trim();

    // empty
    if (!data.quote) {
        quote.innerText = defaultQuote;
        data.quote = defaultQuote;
    } else {
        data.quote = quote.innerText.trim();
    }

    const response = await window.taskAPI.saveData(data);
    if(!response.success) {
        alert('failed to save quote: ', response.error);
    }
});

// render tasks to UI
function renderTasks() {
  taskList.innerHTML = ''; // clear list
  data.tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.textContent = task.name;

    // delete button
    const deletebtn = document.createElement('button');
    deletebtn.classList.add('delete-btn');
    //deletebtn.textContent = 'X';

    deletebtn.onclick = function(event) {
        event.stopPropagation();
        data.tasks.splice(index, 1);
        window.taskAPI.saveData(data);
        renderTasks();
    };

    li.appendChild(deletebtn);
    
    // complete or incomplete
    if(task.completed) {
        li.classList.add('completed');
    }

    // listener
    li.onclick = function () {
        data.tasks[index].completed = !data.tasks[index].completed;
        renderTasks();
        window.taskAPI.saveData(data);
    }

    taskList.appendChild(li);
  });
}

// save task handler
savebtn.onclick = async () => {
  const taskText = taskInput.value.trim();
  if (!taskText) {
    alert('enter an item!');
    return;
  }

  data.tasks.push({ name: taskText, completed: false }); // add new task to array
  renderTasks();

  // save tasks to disk via preload API
  const response = await window.taskAPI.saveData(data);
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
    const loadedData = await window.taskAPI.loadData();
    
    if (loadedData && Array.isArray(loadedData.tasks)) {
      data = loadedData;

      // Ensure quote fallback if missing or empty
      if (!data.quote || data.quote.trim() === "") {
        data.quote = `"today will be a great day."`;
      }
    }

  } catch {
    console.warn("Failed to load data, using defaults:", error);
  }

  if (quote) quote.innerText = data.quote;
  renderTasks();
})();