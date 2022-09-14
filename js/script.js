// No carregamento do aplicativo, obtenha todas as tarefas do localStorage
window.onload = loadTasks;

// Ao enviar o formulário adicionar tarefa
document.querySelector("form").addEventListener("submit", e => {
  e.preventDefault();
  addTask();
});

function loadTasks() {
  // verifique se localStorage tem alguma tarefa
  // se não, então retorne
  if (localStorage.getItem("tasks") == null) return;

  // Obtenha as tarefas do localStorage e converta-as em uma matriz
  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));

  // Percorra as tarefas e adicione-as à lista
  tasks.forEach(task => {
    const list = document.querySelector("ul");
    const li = document.createElement("li");
    li.innerHTML = `<input type="checkbox" onclick="taskComplete(this)" class="check" ${task.completed ? 'checked' : ''}>
          <input type="text" value="${task.task}" class="task ${task.completed ? 'completed' : ''}" onfocus="getCurrentTask(this)" onblur="editTask(this)">
          <i class="fa fa-trash" onclick="removeTask(this)"></i>`;
    list.insertBefore(li, list.children[0]);
  });
}

function addTask() {
  const task = document.querySelector("form input");
  const list = document.querySelector("ul");
  
  // retornar se a tarefa estiver vazia
  if (task.value === "") {
    alert("Por favor, adicione alguma tarefa!");
    return false;
  }
  // retornar se a tarefa estiver vazia
  if (document.querySelector(`input[value="${task.value}"]`)) {
    alert("A tarefa já existe!");
    return false;
  }
  
  // adicionar tarefa ao armazenamento local
  localStorage.setItem("tasks", JSON.stringify([...JSON.parse(localStorage.getItem("tasks") || "[]"), { task: task.value, completed: false }]));

  // criar item de lista, adicionar innerHTML e anexar a ul
  const li = document.createElement("li");
  li.innerHTML = `<input type="checkbox" onclick="taskComplete(this)" class="check">
      <input type="text" value="${task.value}" class="task" onfocus="getCurrentTask(this)" onblur="editTask(this)">
      <i class="fa fa-trash" onclick="removeTask(this)"></i>`;
  list.insertBefore(li, list.children[0]);
  // limpar entrada
  task.value = "";
}

function taskComplete(event) {
  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
  tasks.forEach(task => {
    if (task.task === event.nextElementSibling.value) {
      task.completed = !task.completed;
    }
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  event.nextElementSibling.classList.toggle("completed");
}

function removeTask(event) {
  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
  tasks.forEach(task => {
    if (task.task === event.parentNode.children[1].value) {
      // deletar tarefa
      tasks.splice(tasks.indexOf(task), 1);
    }
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  event.parentElement.remove();
}

// armazene a tarefa atual para rastrear as alterações
var currentTask = null;

// obter tarefa atual
function getCurrentTask(event) {
  currentTask = event.value;
}

// edite a tarefa e atualize o armazenamento local
function editTask(event) {
  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
  // verifique se a tarefa está vazia
  if (event.value === "") {
    alert("A tarefa não pode ser vazia!.");
    event.value = currentTask;
    return;
  }
  // tarefa já existe
  tasks.forEach(task => {
    if (task.task === event.value) {
      alert("tarefa já existe!");
      event.value = currentTask;
      return;
    }
  });
  // Atualizar a tarefa
  tasks.forEach(task => {
    if (task.task === currentTask) {
      task.task = event.value;
    }
  });
  // atualizar a tarefa no localStorage
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
