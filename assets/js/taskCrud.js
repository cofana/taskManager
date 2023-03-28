"use strict";
// Employee class
class Employee {
  constructor(fullName, email, phoneNumber, dateOfBirth, monthlySalary) {
    this.fullName = fullName;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.dateOfBirth = dateOfBirth;
    this.monthlySalary = monthlySalary;
  }
}

// Task class
class Task {
  constructor(title, description, assignee, date) {
    this.title = title;
    this.description = description;
    this.assignee = assignee;
    this.date = date;
  }
}

// BUTTONS
const btnAddEmployee = document.querySelector(".add-employee");
const employeeTable = document.querySelector(".employeeTable");
const employeeBody = document.querySelector(".employee-list-body");
const btnUpdateEmployee = document.querySelector(".update-employee");
const selectAssignee = document.querySelector(".select-assignee");
const taskBody = document.querySelector(".task-list-body");
const btnAddTask = document.querySelector(".add-task");
const btnUpdateTask = document.querySelector(".update-task");
const btnDelete = document.querySelector(".btn-delete");
const btnEdit = document.querySelector(".btn-edit");

// STICKY HEADER
const header = document.querySelector('.header');
const headerHeight = header.offsetHeight;

window.addEventListener("scroll", function () {
  // Check the position of the scroll
  if (window.pageYOffset > headerHeight) {
    // Apply a CSS class to the header element
    header.classList.add("sticky");
  } else {
    // Remove the CSS class from the header element
    header.classList.remove("sticky");
  }
});



// * REFACTORED FUNCTIONS * //

const showData = function (dataType) {
  let html = "";
  let dataList = dataType === "task" ? taskList : employeeList;
  let tableBody = dataType === "task" ? taskBody : employeeBody;

  dataList.forEach(function (element, index) {
    if (dataType === "task") {
      html += `<tr><td>${element.title}</td><td>${element.description}</td><td>${element.date}</td><td>${element.assignee}</td><td><button onclick='deleteData(${index}, "task")' class='btn btn-delete'>Delete</button><button onclick='updateData(${index}, "task")' class='btn btn-edit'>Edit</button></td></tr>`;
    } else if (dataType === "employee") {
      html += `<tr><td>${element.fullName}</td><td>${element.email}</td><td>${element.phoneNumber}</td><td>${element.dateOfBirth}</td><td>${element.monthlySalary}</td><td><button onclick='deleteData(${index}, "employee")' class='btn btn-delete'>Delete</button><button onclick='updateData(${index}, "employee")' class='btn btn-edit'>Edit</button></td></tr>`;
    }
  });

  tableBody.innerHTML = html;
};

const addData = function (e, type) {
  if (e && e.preventDefault) {
    e.preventDefault();
  }
  if (type === "employee") {
    if (validateFormEmployees() === true) {
      let fullName = document.getElementById("fullName").value;
      let email = document.getElementById("email").value;
      let number = document.getElementById("number").value;
      let dateBirth = document.getElementById("dateBirth").value;
      let salary = document.getElementById("salary").value;

      let newEmployee = new Employee(
        fullName,
        email,
        number,
        dateBirth,
        salary
      );
      employeeList.push(newEmployee);

      localStorage.setItem("employeeList", JSON.stringify(employeeList));
      document.getElementById("fullName").value = "";
      document.getElementById("email").value = "";
      document.getElementById("number").value = "";
      document.getElementById("dateBirth").value = "";
      document.getElementById("salary").value = "";
      showData("employee");
    }
  } else {
    if (validateFormTask() === true) {
      let title = document.getElementById("title").value;
      let description = document.getElementById("description").value;
      let date = document.getElementById("date").value;
      let assignee = document.getElementById("assignee").value;

      let newTask = new Task(title, description, assignee, date);
      taskList.push(newTask);

      localStorage.setItem("taskList", JSON.stringify(taskList));
      document.getElementById("title").value = "";
      document.getElementById("description").value = "";
      document.getElementById("date").value = "";
      document.getElementById("assignee").value = "";
      showData("task");
    }
  }
};

const deleteData = function (index, type) {
  if (type === "employee") {
    employeeList.splice(index, 1);
    localStorage.setItem("employeeList", JSON.stringify(employeeList));
    showData("employee");
  } else {
    taskList.splice(index, 1);
    localStorage.setItem("taskList", JSON.stringify(taskList));
    showData("task");
  }
  displayAssignees();
};

const updateData = function (index, type) {
  let data;
  let addButton;
  let updateButton;
  let validateFunction;
  let dataString;

  if (type === "employee") {
    data = employeeList;
    addButton = btnAddEmployee;
    updateButton = btnUpdateEmployee;
    validateFunction = validateFormEmployees;
    dataString = "employeeList";
  } else {
    data = taskList;
    addButton = btnAddTask;
    updateButton = btnUpdateTask;
    validateFunction = validateFormTask;
    dataString = "taskList";
  }

  addButton.style.display = "none";
  updateButton.style.display = "inline-block";

  document.getElementById("fullName").value = data[index].fullName || "";
  document.getElementById("email").value = data[index].email || "";
  document.getElementById("number").value = data[index].phoneNumber || "";
  document.getElementById("dateBirth").value = data[index].dateOfBirth || "";
  document.getElementById("salary").value = data[index].monthlySalary || "";
  document.getElementById("title").value = data[index].title || "";
  document.getElementById("description").value = data[index].description || "";
  document.getElementById("date").value = data[index].date || "";
  document.getElementById("assignee").value = data[index].assignee || "";


  updateButton.addEventListener("click", function (e) {
    e.preventDefault();
    if (validateFunction() === true) {
      data[index].fullName = document.getElementById("fullName").value;
      data[index].email = document.getElementById("email").value;
      data[index].phoneNumber = document.getElementById("number").value;
      data[index].dateOfBirth = document.getElementById("dateBirth").value;
      data[index].monthlySalary = document.getElementById("salary").value;
      data[index].title = document.getElementById("title").value;
      data[index].description = document.getElementById("description").value;
      data[index].date = document.getElementById("date").value;
      data[index].assignee = document.getElementById("assignee").value;

      localStorage.setItem(dataString, JSON.stringify(data));
      showData(type);

      document.getElementById("fullName").value = "";
      document.getElementById("email").value = "";
      document.getElementById("number").value = "";
      document.getElementById("dateBirth").value = "";
      document.getElementById("salary").value = "";
      document.getElementById("title").value = "";
      document.getElementById("description").value = "";
      document.getElementById("date").value = "";
      document.getElementById("assignee").value = "";

      addButton.style.display = "inline-block";
      updateButton.style.display = "none";
      displayAssignees();
    }
  });
};


// * EMPLOYEE SECTION * //

let employeeList;

if (
  localStorage.getItem("employeeList") &&
  localStorage.getItem("employeeList") !== "null" &&
  localStorage.getItem("employeeList") !== "undefined"
) {
  employeeList = JSON.parse(localStorage.getItem("employeeList"));
} else {
  employeeList = [];
}

const validateFormEmployees = function () {
  let fullName = document.getElementById("fullName");
  let email = document.getElementById("email");
  let number = document.getElementById("number");
  let dateBirth = document.getElementById("dateBirth");
  let salary = document.getElementById("salary");

  if (fullName.value === "") {
    alert("Name is required");
    return false;
  }

  if (email.value === "") {
    alert("Email is required");
    return false;
  }

  if (number.value === "") {
    alert("Number is required");
    return false;
  }

  if (dateBirth.value === "") {
    alert("Birth date is required");
    return false;
  }

  if (salary.value === "") {
    alert("Salary is required");
    return false;
  }

  return true;
};

showData("employee");

btnAddEmployee.addEventListener("click", function (e) {
  addData(e, "employee");
  displayAssignees();
});

// * EMPLOYEE SECTION * //

// * TASK SECTION * //

let taskList;
if (
  localStorage.getItem("taskList") &&
  localStorage.getItem("taskList") !== "null" &&
  localStorage.getItem("taskList") !== "undefined"
) {
  taskList = JSON.parse(localStorage.getItem("taskList"));
} else {
  taskList = [];
}

const displayAssignees = function () {
  selectAssignee.innerHTML = "";

  let defaultOption = document.createElement("option");
  defaultOption.text = "Select an assignee";
  defaultOption.value = "0";
  selectAssignee.appendChild(defaultOption);

  employeeList.forEach((employee) => {
    let option = document.createElement("option");
    option.text = employee.fullName;
    option.value = employee.fullName;
    selectAssignee.appendChild(option);
  });
};
displayAssignees();

const validateFormTask = function () {
  let title = document.getElementById("title");
  let description = document.getElementById("description");
  let date = document.getElementById("date");
  let assignee = document.getElementById("assignee");

  if (title.value === "") {
    alert("Title is required");
    return false;
  }

  if (description.value === "") {
    alert("Description is required");
    return false;
  }

  if (date.value === "") {
    alert("Date is required");
    return false;
  }

  if (assignee.value === "0") {
    alert("Select an assignee");
    return false;
  }

  return true;
};

showData("task");

btnAddTask.addEventListener("click", function (e) {
  addData(e, "task");
});
