let dataList = [];
let autoId = 1;

const input = document.getElementById("taskInput");
const btn = document.getElementById("addBtn");
const content = document.getElementById("taskList");

btn.addEventListener("click", createTask); 
input.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    createTask();
  }
});
function createTask() {
  let getInput = input.value;
  if (getInput.trim() === "") {
    alert("Vui lòng nhập công việc");
    return;
  }
  let newTask = {
    id: autoId,
    text: getInput,
    completed: false,
  };
  autoId++;
  dataList.push(newTask);
  input.value = "";
  input.focus();
  console.log("Danh sach hien tai: ", dataList);
  render();
}

function render() {
  content.innerHTML = "";
  if (dataList.length === 0) {
    content.innerHTML = `
    <div class="check">
      <p>Chua co cong viec</p>
    </div>`;
    return;
  }
  dataList.forEach(function (task) {
    let text = document.createElement("div");
    text.innerHTML = `
      <div class="task-item">
        <input type="checkbox" ${task.completed ? "checked" : ""} 
        onchange="toggleTask(${task.id})">
        <p style="${task.completed ? "text-decoration: line-through;" : ""}">
        ${task.text}
        </p>
        <div class="btn-function">
          <button onclick="editTask(${task.id})">sua</button>
          <button onclick="deleteTask(${task.id})">xoa</button>
        </div>
      </div>
    `;
    content.appendChild(text);
  });
}


function toggleTask(taskId) {
  let task = dataList.find(function (task) {
    return task.id === taskId;
  });
  if (task) {
    task.completed = !task.completed;
  }
  render();
}

function editTask(taskId) {
  let tasks = dataList.find(function (task) {
    return task.id === taskId;
  });
  if (!tasks) {
    return;
  }
  let newText = prompt("Sua cong viec:", tasks.text);
  if (newText === null) {
    return;
  }
  if (newText.trim() === "") {
    alert("Khong duoc de trong");
    return;
  }
  tasks.text = newText.trim();
  render();
}

function deleteTask(taskId) {
  let tasks = dataList.find(function (task) {
    return task.id === taskId;
  });
  if (!tasks) {
    return;
  }
  let isConfirm = confirm("Ban co chac muon xoa task khong");

  if (!isConfirm) {
    return;
  }
  dataList = dataList.filter(function (task) {
    return task.id !== taskId;
  });
  render();
}