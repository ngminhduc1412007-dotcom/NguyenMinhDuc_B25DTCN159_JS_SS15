// ==================
// Dữ liệu
// ==================
var tasks = [];
var idCounter = 1;

// ==================
// DOM
// ==================
var taskInput = document.getElementById("taskInput");
var addBtn = document.getElementById("addBtn");
var taskList = document.getElementById("taskList");
var completedCount = document.getElementById("completedCount");
var totalCount = document.getElementById("totalCount");
var completionStatus = document.getElementById("completionStatus");

// ==================
// Khởi động
// ==================
init();

function init() {
  renderTasks();
  updateFooter();

  addBtn.addEventListener("click", function () {
    addTask();
  });

  taskInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      addTask();
    }
  });
}

// ==================
// Thêm công việc
// ==================
function addTask() {
  var text = taskInput.value.trim();

  if (text === "") {
    alert("Vui lòng nhập công việc!");
    return;
  }

  var task = {
    id: idCounter,
    text: text,
    completed: false
  };

  idCounter++;
  tasks.push(task);

  taskInput.value = "";
  taskInput.focus();

  renderTasks();
  updateFooter();
}

// ==================
// Render danh sách
// ==================
function renderTasks() {
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    taskList.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📋</div>
        <div class="empty-state-text">
          Chưa có công việc nào. Hãy thêm công việc mới!
        </div>
      </div>
    `;
    return;
  }

  tasks.forEach(function (task) {
    var item = createTaskElement(task);
    taskList.appendChild(item);
  });
}

// ==================
// Tạo 1 task element
// ==================
function createTaskElement(task) {
  var div = document.createElement("div");
  div.className = "task-item";
  if (task.completed) {
    div.classList.add("completed");
  }
  div.setAttribute("data-id", task.id);

  // checkbox
  var checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "task-checkbox";
  checkbox.checked = task.completed;

  checkbox.addEventListener("change", function () {
    toggleTask(task.id);
  });

  // text
  var span = document.createElement("span");
  span.className = "task-text";
  if (task.completed) {
    span.classList.add("completed");
  }
  span.innerText = task.text;

  // actions
  var actions = document.createElement("div");
  actions.className = "task-actions";

  var editBtn = document.createElement("button");
  editBtn.className = "btn-edit";
  editBtn.innerText = "✏️ Sửa";
  editBtn.addEventListener("click", function () {
    editTask(task.id);
  });

  var deleteBtn = document.createElement("button");
  deleteBtn.className = "btn-delete";
  deleteBtn.innerText = "🗑️ Xóa";
  deleteBtn.addEventListener("click", function () {
    deleteTask(task.id);
  });

  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);

  div.appendChild(checkbox);
  div.appendChild(span);
  div.appendChild(actions);

  return div;
}

// ==================
// Toggle hoàn thành
// ==================
function toggleTask(id) {
  var task = tasks.find(function (t) {
    return t.id === id;
  });

  if (task) {
    task.completed = !task.completed;
    renderTasks();
    updateFooter();
  }
}

// ==================
// Xóa
// ==================
function deleteTask(id) {
  var task = tasks.find(function (t) {
    return t.id === id;
  });

  if (!task) return;

  var confirmDelete = confirm("Bạn có chắc muốn xóa công việc này?");
  if (!confirmDelete) return;

  tasks = tasks.filter(function (t) {
    return t.id !== id;
  });

  renderTasks();
  updateFooter();
}

// ==================
// Edit
// ==================
function editTask(id) {
  var task = tasks.find(function (t) {
    return t.id === id;
  });

  if (!task) return;

  var taskItem = document.querySelector('[data-id="' + id + '"]');
  var textSpan = taskItem.querySelector(".task-text");
  var actions = taskItem.querySelector(".task-actions");

  taskItem.classList.add("editing");

  var input = document.createElement("input");
  input.type = "text";
  input.className = "task-edit-input";
  input.value = task.text;

  var saveBtn = document.createElement("button");
  saveBtn.className = "btn-save";
  saveBtn.innerText = "💾 Lưu";

  var cancelBtn = document.createElement("button");
  cancelBtn.className = "btn-cancel";
  cancelBtn.innerText = "❌ Hủy";

  saveBtn.addEventListener("click", function () {
    saveTask(id, input.value);
  });

  cancelBtn.addEventListener("click", function () {
    renderTasks();
  });

  actions.innerHTML = "";
  actions.appendChild(saveBtn);
  actions.appendChild(cancelBtn);

  taskItem.insertBefore(input, actions);
  input.focus();

  input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      saveTask(id, input.value);
    }
    if (e.key === "Escape") {
      renderTasks();
    }
  });
}

// ==================
// Lưu sau khi sửa
// ==================
function saveTask(id, newText) {
  var value = newText.trim();

  if (value === "") {
    alert("Không được để trống!");
    return;
  }

  var task = tasks.find(function (t) {
    return t.id === id;
  });

  if (task) {
    task.text = value;
  }

  renderTasks();
  updateFooter();
}

// ==================
// Cập nhật footer
// ==================
function updateFooter() {
  var total = tasks.length;

  var completed = tasks.filter(function (t) {
    return t.completed === true;
  }).length;

  totalCount.innerText = total;
  completedCount.innerText = completed;

  if (total > 0 && total === completed) {
    completionStatus.innerHTML = `
      <div class="completion-badge">
        <span class="check-icon">✅</span>
        <span>Hoàn thành tất cả!</span>
      </div>
    `;
  } else {
    completionStatus.innerHTML = "";
  }
}