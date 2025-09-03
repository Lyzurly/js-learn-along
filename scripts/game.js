const workers_canvas = document.querySelector(".worker-canvas");

let worker_idno_previous = -1;
let workers = [];
const id_prefix_worker = "worker_";
const class_prefix_ability = "ability-";
const class_prefix_stat = "stat-";

const button_hire_employee = document.querySelector("#hire-employee");
const button_hire_intern = document.querySelector("#hire-intern");
const button_hire_test = document.querySelector("#hire-test");

const max_stat = 10;
const min_stat = 0;
const base_inc_stat = 5;
const base_wellbeing = 10;

const sprite_path = "assets/images/HGDEmployee.gif";

class Worker {
  constructor(worker_id) {
    this.worker_container = create_element(
      "div",
      "worker-container",
      worker_id
    );

    this.createWorkerSprite();
  }

  createWorkerSprite() {
    this.sprite_container = create_element("div", "sprite-container");
    this.sprite_itself = create_element("img");
    this.sprite_itself.src = sprite_path;

    this.sprite_container.appendChild(this.sprite_itself);
    this.worker_container.appendChild(this.sprite_container);
  }

  addWorkerToDOM(worker_to_add) {
    workers_canvas.appendChild(worker_to_add);
  }
}

class Employee extends Worker {
  constructor(worker_id) {
    super(worker_id);
    this.stats = [
      new Income(this.worker_container),
      new Happiness(this.worker_container),
    ];

    this.worker_interface = create_element("div", "worker-interface");
    this.stats.forEach((stat) => {
      console.log(this);
      this.worker_interface.appendChild(stat.stat_interface);
    });
    this.worker_container.appendChild(this.worker_interface);
    this.addWorkerToDOM(this.worker_container);
  }
}

class Intern extends Worker {
  constructor(worker_id) {
    super(worker_id);
    this.stats = [
      new Happiness(this.worker_container),
      new Duration(this.worker_container),
    ];
  }
}

class TestWorker extends Worker {
  constructor(worker_id) {
    super(worker_id);
    this.stats = [new TestStat(this.worker_container)];
  }
}

button_hire_employee.addEventListener("click", function (event) {
  new Employee(createWorkerID());
});

button_hire_intern.addEventListener("click", function (event) {
  new Intern(createWorkerID());
});

button_hire_test.addEventListener("click", function (event) {
  new TestWorker(createWorkerID());
});

class Stat {
  constructor(worker_container) {
    this.worker_container = worker_container;
    this.stat_interface = create_element("div", "stat-interface");
  }

  create_stat(stat_name, ability_name = null) {
    this.stat_container = create_element("div", "stat-container");

    this.stat_wrapper = create_element("div", "stat-wrapper");
    this.stat_wrapper.innerHTML = stat_name;

    this.stat_specific_class = class_prefix_stat + stat_name;
    this.stat_value = create_element(
      "div",
      "stat-value " + this.stat_specific_class
    );
    this.stat_value.innerHTML = base_inc_stat;

    this.stat_wrapper.appendChild(this.stat_value);
    this.stat_container.appendChild(this.stat_wrapper);

    if (ability_name) {
      this.ability_specific_class = class_prefix_ability + stat_name;
      this.create_ability(ability_name, this.ability_specific_class);
    }

    this.stat_interface.appendChild(this.stat_container);
    this.worker_container.appendChild(this.stat_interface);
  }

  create_ability(ability_name, ability_specific_class) {
    this.abilities_container = create_element("div", "abilities-container");

    this.new_button = create_element("button", ability_specific_class);
    this.new_button.innerHTML = ability_name;
    this.abilities_container.appendChild(this.new_button);

    this.stat_interface.appendChild(this.abilities_container);
  }
}

class Duration extends Stat {
  constructor(worker_container) {
    super(worker_container);
    this.create_stat(this.constructor.name);
  }
}

class Income extends Stat {
  constructor(worker_container) {
    super(worker_container);
    this.ability_name = "Pay";
    this.create_stat(this.constructor.name, this.ability_name);
  }
}

class Happiness extends Stat {
  constructor(worker_container) {
    super(worker_container);
    this.ability_name = "Praise";
    this.create_stat(this.constructor.name, this.ability_name);
  }
}

class TestStat extends Stat {
  constructor(worker_container) {
    super(worker_container);
    this.ability_name = "Test";
    this.create_stat(this.constructor.name, this.ability_name);
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

// === Helper Functions === //

function createOrReturnElement(
  object_scope,
  element_string_class,
  element_string_type
) {
  let string_as_class = "." + element_string_class;
  let found_element = object_scope.querySelector(string_as_class);
  console.log("Finding string ", string_as_class);
  console.log("Found element is ", found_element);
  if (found_element) {
    return found_element;
  } else {
    let new_element = create_element(element_string_type, element_string_class);
    return new_element;
  }
}

function isInRange(value) {
  //return if value between min and max
  return Boolean(value < max_stat && value > min_stat);
}

function create_element(element_type, class_name = null, id_name = null) {
  const element_itself = document.createElement(element_type);

  if (class_name) {
    if (class_name.includes(" ")) {
      addClassesToElement(element_itself, class_name);
    } else {
      element_itself.classList.add(class_name);
    }
  }

  if (id_name) {
    element_itself.id = id_name;
  }
  return element_itself;
}

function addClassesToElement(element, string_to_split) {
  let class_names = string_to_split.split(" ");
  class_names.forEach((split_class) => {
    element.classList.add(split_class);
  });
}
