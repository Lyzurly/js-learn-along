const employees_canvas = document.querySelector(".employees-canvas");
let employee_idno_previous = -1;
let employees = [];
const employee_id_prefix = "employee";

const button_hire = document.querySelector("#hire");

const max_stat = 10;
const min_stat = 0;
const base_inc_stat = 5;
const base_wellbeing = 10;

button_hire.addEventListener("click", function (event) {
  addNewEmployee();
  console.log(employees);
});

class Employee {
  constructor(employee_id) {
    this.employee_id = employee_id;
    this.stat_pay_value = base_inc_stat;
    this.stat_praise_value = base_inc_stat;
    this.employee = document.getElementById(this.employee_id);
    this.buttons = this.employee.querySelectorAll("button");
    this.buttons.forEach((button) => {
      button.addEventListener("click", function (event) {
        //increase stat
        switch (event.target.className) {
          case "button-pay":
            stat = this.employee.classList(".stat-pay");
            increaseStat(stat);
            break;
          case "button-praise":
            stat = this.employee.classList(".stat-praise");
            increaseStat(stat);
            break;
          default:
            console.log("Unknown abilitiy used.");
        }
      });
    });

    this.stats = this.employee.querySelectorAll(".stat-value");

    // this.stats.forEach((stat) => {
    //   console.log(stat);
    //   console.log(stat.classList);
    // });
  }

  updateStats() {
    this.stats.forEach((stat) => {
      stat.classList.forEach((stat_class) => {
        switch (stat_class) {
          case "stat-pay":
            decreaseStat(stat);
            break;
          case "stat-praise":
            decreaseStat(stat);
        }
      });
    });
  }
}

function addNewEmployee() {
  employee_idno_current = ++employee_idno_previous;
  employee_idno_previous = employee_idno_current;

  employee_id = employee_id_prefix + employee_idno_current.toString();

  employees_canvas.innerHTML += employee_template;

  employee_container = document.getElementById(employee_id_prefix);
  employee_container.id = employee_id;

  employees.push(new Employee(employee_id));
  updateEmployees();
}

// setInterval(updateEmployees, 1000);
function updateEmployees() {
  employees.forEach((employee) => {
    console.log(employee.employee_id, "'s stats are ", employee.stats);
    // console.log("Updated employee type is: ", employee.employee_id);
    employee.updateStats();
  });
}

function increaseStat(stat) {
  value = Math.floor(stat.innerHTML);
  if (isInRange(value)) {
    value++;
  }
  stat.innerHTML = value;
}

function decreaseStat(stat) {
  value = Math.floor(stat.innerHTML);
  if (isInRange(value)) {
    value--;
  }
  stat.innerHTML = value;
}

function isInRange(value) {
  //return if value between min and max
  return Boolean(value < max_stat && value > min_stat);
}
