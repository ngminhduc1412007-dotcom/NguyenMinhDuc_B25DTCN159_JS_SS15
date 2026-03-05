let taskListData = [];
let nextTaskId = 1;

// =======================
// DOM ELEMENTS
// =======================

const taskInputElement = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addBtn");
const taskContainer = document.getElementById("taskList");
const completedTaskCountElement = document.getElementById("completedCount");
const totalTaskCountElement = document.getElementById("totalCount");
const completionStatusContainer = document.getElementById("completionStatus");

// =======================
// KHỞI ĐỘNG
// =======================

initializeApp();

function initializeApp() {
  renderTaskList();
  updateFooterStatistics();

  addTaskButton.addEventListener("click", function () {
    addNewTask();
  });

  taskInputElement.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      addNewTask();
    }
  });
}

// =======================
// THÊM CÔNG VIỆC
// =======================

function addNewTask() {
  const taskText = taskInputElement.value.trim();

  if (taskText === "") {
    alert("Vui lòng nhập công việc!");
    return;
  }

  const newTask = {
    id: nextTaskId,
    text: taskText,
    completed: false
  };

  nextTaskId++;
  taskListData.push(newTask);

  taskInputElement.value = "";
  taskInputElement.focus();

  renderTaskList();
  updateFooterStatistics();
}

// =======================
// RENDER DANH SÁCH
// =======================

function renderTaskList() {
  taskContainer.innerHTML = "";

  if (taskListData.length === 0) {
    taskContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📋</div>
        <div class="empty-state-text">
          Chưa có công việc nào. Hãy thêm công việc mới!
        </div>
      </div>
    `;
    return;
  }

  taskListData.forEach(function (taskItem) {
    const taskElement = createTaskElement(taskItem);
    taskContainer.appendChild(taskElement);
  });
}

// =======================
// TẠO 1 TASK ELEMENT
// =======================

function createTaskElement(taskData) {
  const taskWrapper = document.createElement("div");
  taskWrapper.className = "task-item";

  if (taskData.completed) {
    taskWrapper.classList.add("completed");
  }

  taskWrapper.setAttribute("data-id", taskData.id);

  // Checkbox
  const checkboxElement = document.createElement("input");
  checkboxElement.type = "checkbox";
  checkboxElement.className = "task-checkbox";
  checkboxElement.checked = taskData.completed;

  checkboxElement.addEventListener("change", function () {
    toggleTaskCompletion(taskData.id);
  });

  // Text
  const taskTextElement = document.createElement("span");
  taskTextElement.className = "task-text";
  taskTextElement.innerText = taskData.text;

  if (taskData.completed) {
    taskTextElement.classList.add("completed");
  }

  // Action buttons
  const actionContainer = document.createElement("div");
  actionContainer.className = "task-actions";

  const editButton = document.createElement("button");
  editButton.className = "btn-edit";
  editButton.innerText = "✏️ Sửa";

  editButton.addEventListener("click", function () {
    editTask(taskData.id);
  });

  const deleteButton = document.createElement("button");
  deleteButton.className = "btn-delete";
  deleteButton.innerText = "🗑️ Xóa";

  deleteButton.addEventListener("click", function () {
    deleteTask(taskData.id);
  });

  actionContainer.appendChild(editButton);
  actionContainer.appendChild(deleteButton);

  taskWrapper.appendChild(checkboxElement);
  taskWrapper.appendChild(taskTextElement);
  taskWrapper.appendChild(actionContainer);

  return taskWrapper;
}

// =======================
// TOGGLE HOÀN THÀNH
// =======================

function toggleTaskCompletion(taskId) {
  const task = taskListData.find(function (taskItem) {
    return taskItem.id === taskId;
  });

  if (task) {
    task.completed = !task.completed;
    renderTaskList();
    updateFooterStatistics();
  }
}

// =======================
// XÓA TASK
// =======================

function deleteTask(taskId) {
  const task = taskListData.find(function (taskItem) {
    return taskItem.id === taskId;
  });

  if (!task) return;

  const confirmDelete = confirm("Bạn có chắc muốn xóa công việc này?");
  if (!confirmDelete) return;

  taskListData = taskListData.filter(function (taskItem) {
    return taskItem.id !== taskId;
  });

  renderTaskList();
  updateFooterStatistics();
}

// =======================
// EDIT TASK
// =======================

function editTask(taskId) {
  const task = taskListData.find(function (taskItem) {
    return taskItem.id === taskId;
  });

  if (!task) return;

  const taskElement = document.querySelector('[data-id="' + taskId + '"]');
  const actionContainer = taskElement.querySelector(".task-actions");

  taskElement.classList.add("editing");

  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.className = "task-edit-input";
  editInput.value = task.text;

  const saveButton = document.createElement("button");
  saveButton.className = "btn-save";
  saveButton.innerText = "💾 Lưu";

  const cancelButton = document.createElement("button");
  cancelButton.className = "btn-cancel";
  cancelButton.innerText = "❌ Hủy";

  saveButton.addEventListener("click", function () {
    saveEditedTask(taskId, editInput.value);
  });

  cancelButton.addEventListener("click", function () {
    renderTaskList();
  });

  actionContainer.innerHTML = "";
  actionContainer.appendChild(saveButton);
  actionContainer.appendChild(cancelButton);

  taskElement.insertBefore(editInput, actionContainer);
  editInput.focus();

  editInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      saveEditedTask(taskId, editInput.value);
    }

    if (event.key === "Escape") {
      renderTaskList();
    }
  });
}

// =======================
// LƯU TASK SAU KHI SỬA
// =======================

function saveEditedTask(taskId, newText) {
  const trimmedText = newText.trim();

  if (trimmedText === "") {
    alert("Không được để trống!");
    return;
  }

  const task = taskListData.find(function (taskItem) {
    return taskItem.id === taskId;
  });

  if (task) {
    task.text = trimmedText;
  }

  renderTaskList();
  updateFooterStatistics();
}

// =======================
// UPDATE FOOTER
// =======================

function updateFooterStatistics() {
  const totalTaskCount = taskListData.length;

  const completedTaskCount = taskListData.filter(function (taskItem) {
    return taskItem.completed === true;
  }).length;

  totalTaskCountElement.innerText = totalTaskCount;
  completedTaskCountElement.innerText = completedTaskCount;

  if (totalTaskCount > 0 && totalTaskCount === completedTaskCount) {
    completionStatusContainer.innerHTML = `
      <div class="completion-badge">
        <span class="check-icon">✅</span>
        <span>Hoàn thành tất cả!</span>
      </div>
    `;
  } else {
    completionStatusContainer.innerHTML = "";
  }
}