const workers_canvas = document.querySelector(".worker-canvas");

let worker_idno_previous = -1;
let workers = [];
const id_prefix_worker = "worker_";
const id_prefix_ability = "ability_";
const id_prefix_stat = "stat_";

const button_hire_employee = document.querySelector("#hire-employee");
const button_hire_intern = document.querySelector("#hire-intern");

const max_stat = 10;
const min_stat = 0;
const base_inc_stat = 5;
const base_wellbeing = 10;

class Worker {
  constructor(worker_id) {
    this.worker_container = create_element(
      "div",
      "worker-container",
      worker_id
    );

    this.interface_container = create_element("span", "interface-container");

    this.worker_container.appendChild(this.interface_container);

    this.addWorkerToDOM(this.worker_container);
  }

  addWorkerToDOM(worker_to_add) {
    workers_canvas.appendChild(worker_to_add);
  }
}

class Employee extends Worker {
  constructor(worker_id) {
    super(worker_id);
    this.stats = [
      new Income(this.worker_container, this.interface_container),
      new Happiness(this.worker_container, this.interface_container),
    ];
  }
}

class Intern extends Worker {
  constructor(worker_id) {
    super(worker_id);
    this.stats = [
      new Happiness(this.worker_container, this.interface_container),
      new Duration(this.worker_container, this.interface_container),
    ];
  }
}

button_hire_employee.addEventListener("click", function (event) {
  new Employee(createWorkerID());
});

button_hire_intern.addEventListener("click", function (event) {
  new Intern(createWorkerID());
});

class Stat {
  constructor(worker_container, interface_container) {}

  create_ability(worker_container, interface_container, ability_name) {
    this.abilities_container =
      this.create_abilities_container(interface_container);

    this.ability_id = "#" + id_prefix_ability + worker_container.id;

    this.new_button = create_element("button", null, this.ability_id);

    this.new_button.innerHTML = ability_name;

    this.abilities_container.appendChild(this.new_button);

    interface_container.appendChild(this.abilities_container);
  }
  create_abilities_container(parent_element) {
    let found_abilities_container = parent_element.querySelector(
      ".abilities-container"
    );
    if (!found_abilities_container) {
      let new_abilities_container = create_element(
        "div",
        "abilities-container"
      );
      return new_abilities_container;
    } else {
      return found_abilities_container;
    }
  }
}

class Duration extends Stat {
  constructor(worker_container, interface_container) {
    super(worker_container, interface_container);
  }
}

class Income extends Stat {
  constructor(worker_container, interface_container) {
    super(worker_container);
    this.ability_name = "Pay";
    this.create_ability(
      worker_container,
      interface_container,
      this.ability_name
    );
  }
}

class Happiness extends Stat {
  constructor(worker_container, interface_container) {
    super(worker_container, interface_container);
    this.ability_name = "Praise";
    this.create_ability(
      worker_container,
      interface_container,
      this.ability_name
    );
  }
}

function createWorkerID() {
  worker_idno_current = ++worker_idno_previous;
  worker_idno_previous = worker_idno_current;

  return id_prefix_worker + worker_idno_current.toString();
}

// const abilities_container = create_element("div", "abilities-container");
// abilities_container.appendChild();

// workers.push(new Employee(employee_id));
// updateEmployees();

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

function create_element(element_type, class_name = null, id_name = null) {
  const element_itself = document.createElement(element_type);

  if (class_name) {
    element_itself.classList.add(class_name);
  }

  if (id_name) {
    element_itself.id = id_name;
  }
  return element_itself;
}
