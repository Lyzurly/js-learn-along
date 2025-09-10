"use strict";

const workers_canvas = document.querySelector(".worker-canvas");

let worker_idno_previous = -1;
let workers = [];
const id_prefix_worker = "worker_";
const class_prefix_ability = "ability-";
const class_prefix_stat = "stat-";

const button_hire_employee = document.querySelector("#hire-employee");
const button_hire_intern = document.querySelector("#hire-intern");
const button_hire_test = document.querySelector("#hire-test");
const value_profit = document.querySelector("#profit");

const max_stat = 10;
const min_stat = 0;
const base_inc_stat = 5;
const base_wellbeing = 10;

const default_tick_interval = 2;
const default_tick_counter = default_tick_interval;
const default_income_tolerance = 5;

const sprite_path = "assets/images/HGDEmployee.gif";

const tick = new Event("tick");

// === Global Interval Functions === //
setGlobalInterval();
function setGlobalInterval() {
  setInterval(() => {
    window.dispatchEvent(tick);
  }, 500);
}

// === Worker Classes === //

// ABSTRACT CLASS //
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

  createWorkerInterface(stats) {
    this.worker_interface = create_element("div", "worker-interface");
    Object.entries(stats).forEach((stat) => {
      this.worker_interface.appendChild(stat[1].stat_interface);
    });
    this.worker_container.appendChild(this.worker_interface);
    this.addWorkerToDOM(this.worker_container);
  }

  addWorkerToDOM(worker_to_add) {
    workers_canvas.appendChild(worker_to_add);
  }
}

class Employee extends Worker {
  constructor(worker_id) {
    super(worker_id);
    this.stats = {
      income: new Income(this.worker_container, this),
      happiness: new Happiness(this.worker_container, this),
    };

    this.createWorkerInterface(this.stats);
  }
}

class Intern extends Worker {
  constructor(worker_id) {
    super(worker_id);
    this.stats = {
      duration: new Duration(this.worker_container, this),
      happiness: new Happiness(this.worker_container, this),
    };

    this.createWorkerInterface(this.stats);
  }
}

class TestWorker extends Worker {
  constructor(worker_id) {
    super(worker_id);
    this.stats = { teststat: new TestStat(this.worker_container, this) };

    this.createWorkerInterface(this.stats);
  }
}

// === Hiring Buttons === //

button_hire_employee.addEventListener("click", function (event) {
  workers.push(new Employee(createWorkerID()));
});

button_hire_intern.addEventListener("click", function (event) {
  workers.push(new Intern(createWorkerID()));
});

button_hire_test.addEventListener("click", function (event) {
  workers.push(new TestWorker(createWorkerID()));
});

// === Stat Classes === //

// ABSTRACT CLASS //
class Stat {
  constructor(worker_container, worker_obj) {
    this.worker_container = worker_container;
    this.worker_obj = worker_obj;
    this.stat_interface = create_element("div", "stat-interface");

    this.tick_counter = default_tick_counter;
  }

  createTickListener(tick_interval = default_tick_interval) {
    this.tick_interval = tick_interval;
    this.tick_interval_fast = Math.floor(this.tick_interval / 5);
    this.tick_counter = this.tick_interval;
    window.addEventListener("tick", () => {
      this.tickOnInterval(decreaseStat, this.stat_value, this.tick_interval);
    });
  }

  tickOnInterval(fn_onInterval, fn_onIntervalParam = null) {
    this.tick_counter--;
    this.monitorOnTick(this.constructor.name);
    if (this.tick_counter <= 0) {
      this.tick_counter = this.tick_interval;
      fn_onInterval(fn_onIntervalParam);
      // this.monitorOnInterval(this.constructor.name);
    }
  }

  monitorOnTick(stat_name) {
    // TODO setup increment in general, start with praise

    // TODO separately readable global profit stat (needs to be implemented good) that updates the innerHTML and can be siphoned from for payment and hiring

    this.latestValue_income = 0;
    if (this.worker_obj.stats.hasOwnProperty("income")) {
      this.latestValue_income =
        this.worker_obj.stats.income.stat_value.innerHTML;
    }

    this.latestValue_happiness = 0;
    if (this.worker_obj.stats.hasOwnProperty("happiness")) {
      this.latestValue_happiness =
        this.worker_obj.stats.happiness.stat_value.innerHTML;
    }

    this.currentProfit = value_profit.innerHTML;

    value_profit.innerHTML =
      Number(this.currentProfit) +
      Number(this.latestValue_income) +
      Number(this.latestValue_happiness);

    switch (stat_name) {
      case "Happiness":
        this.income_value = fetchClassEleInID(
          this.worker_container.id,
          "stat-Income"
        ).innerHTML;
        if (this.income_value < default_income_tolerance) {
          this.tick_interval = this.tick_interval_fast;
          console.log("Faster interval is ", this.tick_interval);
          if (this.tick_counter > this.tick_interval) {
            this.tick_counter = this.tick_interval;
          }
        }
        break;
      default:
      // //
    }
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

    return this.stat_value;
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
  constructor(worker_container, worker_obj) {
    super(worker_container, worker_obj);
    this.stat_value = this.create_stat(this.constructor.name);

    this.createTickListener();
  }
}

class Income extends Stat {
  constructor(worker_container, worker_obj) {
    super(worker_container, worker_obj);
    this.ability_name = "Pay";
    this.stat_value = this.create_stat(
      this.constructor.name,
      this.ability_name
    );

    this.createTickListener();
  }
}

class Happiness extends Stat {
  constructor(worker_container, worker_obj) {
    super(worker_container, worker_obj);
    this.ability_name = "Praise";
    this.stat_value = this.create_stat(
      this.constructor.name,
      this.ability_name
    );

    this.new_interval = 10;

    this.createTickListener(this.new_interval);
  }
}

class TestStat extends Stat {
  constructor(worker_container, worker_obj) {
    super(worker_container, worker_obj);
    this.ability_name = "Test";
    this.stat_value = this.create_stat(
      this.constructor.name,
      this.ability_name
    );

    this.createTickListener();
  }
}

// === Worker Management Functions === //

function createWorkerID() {
  let worker_idno_current = ++worker_idno_previous;
  worker_idno_previous = worker_idno_current;

  return id_prefix_worker + worker_idno_current.toString();
}

function increaseStat(stat) {
  value = Math.floor(stat.innerHTML);
  if (isInRange(value)) {
    value++;
  }
  stat.innerHTML = value;
}

function decreaseStat(stat_value) {
  let value = Math.floor(stat_value.innerHTML);
  if (isInRange(value)) {
    value--;
  }
  stat_value.innerHTML = value;
}

// === Helper Functions === //

function fetchClassEleInID(ele1_id, ele2_class) {
  return document.getElementById(ele1_id).getElementsByClassName(ele2_class)[0];
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
