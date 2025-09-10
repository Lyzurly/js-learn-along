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
const eleRevenue = document.querySelector("#revenue");
let valueRevenue = 3000;
let factorRevenue = 50;
const eleCost_employee = document.querySelector("#employee-cost");
let employee_cost = 1500;

const money_formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const default_max_stat = 10;
const default_min_stat = 0;
const base_inc_stat = 5;
const base_happiness = 50;

const default_decrement_amount = 1;
const default_increment_amount = 1;
const default_tick_interval = 2;
const default_tick_counter = default_tick_interval;
const default_income_tolerance = 5;

const sprite_path = "HGDEmployee.gif";

const tick = new Event("tick");

// === Global Functions === //
startingMoney();
function startingMoney() {
  eleRevenue.innerHTML = money_formatter.format(valueRevenue);
  eleCost_employee.innerHTML = employee_cost;
}

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
    this.createTickListener();
  }

  createWorkerSprite() {
    this.sprite_container = create_element("div", "sprite-container");
    this.sprite_itself = create_element("img");
    this.sprite_itself.src = sprite_path;
    this.sprite_itself.src = this.sprite_itself.src;

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
    requestAnimationFrame(() => {
      worker_to_add.classList.add("fade-in");
    });
  }

  createTickListener() {
    this.workerTickListener = () => {
      this.monitorOnTick();

      Object.entries(this.stats).forEach((stat) => {
        stat[1].tickOnInterval(decreaseStat, stat[1]);
      });
    };

    window.addEventListener("tick", this.workerTickListener);
  }

  monitorOnTick() {
    // TODO setup increment in general, start with praise

    // TODO separately readable global revenue stat (needs to be implemented good) that updates the innerHTML and can be siphoned from for payment and hiring

    this.latestValue_income = 0;
    if (this.stats.hasOwnProperty("income")) {
      this.latestValue_income = this.stats.income.stat_value.innerHTML;
    }

    this.latestValue_happiness = 0;
    if (this.stats.hasOwnProperty("happiness")) {
      this.latestValue_happiness = this.stats.happiness.stat_value.innerHTML;
    }

    valueRevenue =
      valueRevenue +
      Number(Math.floor(this.latestValue_income / factorRevenue)) +
      Number(this.latestValue_happiness);

    this.newRevenue = money_formatter.format(valueRevenue);

    eleRevenue.innerHTML = this.newRevenue;

    if (this.latestValue_happiness <= 0 && this.latestValue_income <= 0) {
      removeWorker(this);
    }
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
  if (canAfford(employee_cost)) {
    workers.push(new Employee(createWorkerID()));
    spendMoney(employee_cost);
  }
});

button_hire_intern.addEventListener("click", function (event) {
  workers.push(new Intern(createWorkerID()));
});

// button_hire_test.addEventListener("click", function (event) {
//   workers.push(new TestWorker(createWorkerID()));
// });

// === Stat Classes === //

// ABSTRACT CLASS //
class Stat {
  constructor(
    worker_container,
    worker_obj,
    max_stat = default_max_stat,
    decrement_amount = default_decrement_amount,
    tick_interval = default_tick_interval
  ) {
    this.worker_container = worker_container;
    this.worker_obj = worker_obj;
    this.stat_interface = create_element("div", "stat-interface");

    this.max_stat_og = max_stat;
    this.max_stat = this.max_stat_og;

    this.decrement_amount_og = decrement_amount;
    this.decrement_amount = this.decrement_amount_og;

    this.tick_interval_og = tick_interval;
    this.tick_interval = this.tick_interval_og;
    this.tick_interval_fast = Math.floor(this.tick_interval / 5);

    this.tick_counter = this.tick_interval;
  }

  tickOnInterval(fn_onInterval, fn_onIntervalParam1 = null) {
    if (!workers.includes(this.worker_obj)) return;

    this.adjustInterval(this.constructor.name);

    this.tick_counter--;
    if (this.tick_counter <= 0) {
      this.tick_counter = this.tick_interval;
      fn_onInterval(fn_onIntervalParam1);
      // this.monitorOnInterval(this.constructor.name);
    }
  }

  adjustInterval(stat_name) {
    switch (stat_name) {
      case "Happiness":
        this.income_value = fetchClassEleInID(
          this.worker_container.id,
          "stat-Income"
        ).innerHTML;
        if (this.income_value < Math.floor(employee_cost / 2)) {
          this.tick_interval = this.tick_interval_fast;
          if (this.tick_counter > this.tick_interval) {
            this.tick_counter = this.tick_interval;
          }
        } else {
          this.tick_interval = this.tick_interval_og;
        }
        if (this.income_value < Math.floor(employee_cost / 3)) {
          this.decrement_amount = Math.floor(this.decrement_amount * 2);
        } else {
          this.decrement_amount = this.decrement_amount_og;
        }
        break;
      default:
      //
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

    switch (stat_name) {
      case "Income":
        this.stat_value.innerHTML = employee_cost;
        break;
      case "Happiness":
        this.stat_value.innerHTML = base_happiness;
        break;
      default:
        this.stat_value.innerHTML = base_inc_stat;
    }

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
    this.new_button_span = create_element("span", "button-text");
    this.new_button_span.innerHTML = ability_name;

    this.new_button.appendChild(this.new_button_span);
    this.abilities_container.appendChild(this.new_button);

    this.stat_interface.appendChild(this.abilities_container);
  }
}

class Duration extends Stat {
  constructor(worker_container, worker_obj) {
    super(worker_container, worker_obj);
    this.stat_value = this.create_stat(this.constructor.name);
  }
}

class Income extends Stat {
  constructor(worker_container, worker_obj) {
    super(worker_container, worker_obj, null, 100);
    this.ability_name = "Pay";
    this.stat_value = this.create_stat(
      this.constructor.name,
      this.ability_name
    );
  }
}

class Happiness extends Stat {
  constructor(worker_container, worker_obj) {
    super(worker_container, worker_obj, 100, default_decrement_amount, 5);
    this.ability_name = "Praise";
    this.stat_value = this.create_stat(
      this.constructor.name,
      this.ability_name
    );
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
  }
}

// === Worker Management Functions === //

function removeWorker(worker_to_remove) {
  worker_to_remove.worker_container.classList.add("fade-out");
  setTimeout(() => {
    workers = workers.filter(
      (worker_in_array) => worker_in_array !== worker_to_remove
    );

    window.removeEventListener("tick", worker_to_remove.workerTickListener);

    worker_to_remove.worker_container.remove();
    worker_to_remove = null;
  }, 400);
}

function createWorkerID() {
  let worker_idno_current = ++worker_idno_previous;
  worker_idno_previous = worker_idno_current;

  return id_prefix_worker + worker_idno_current.toString();
}

function increaseStat(stat_to_increase, increment_amount) {
  const stat_value = stat_to_increase.stat_value;
  value = Math.floor(stat.innerHTML);
  if (statIsInRange(stat_to_increase, value)) {
    value += increment_amount;
  }
  stat.innerHTML = value;
}

function decreaseStat(stat_to_decrease) {
  const stat_value = stat_to_decrease.stat_value;
  const stat_dec_amt = stat_to_decrease.decrement_amount;
  let value = Math.floor(stat_value.innerHTML);
  if (stat_value.innerHTML < stat_dec_amt) {
    value = 0;
  } else {
    if (statIsInRange(stat_to_decrease, value)) {
      value -= stat_dec_amt;
    }
  }
  stat_value.innerHTML = value;
}

// === Helper Functions === //

function canAfford(cost_to_afford) {
  return cost_to_afford <= valueRevenue;
}

function spendMoney(cost_to_spend) {
  valueRevenue -= cost_to_spend;
  eleRevenue.innerHTML = money_formatter.format(valueRevenue);
}

function fetchClassEleInID(ele1_id, ele2_class) {
  return document.getElementById(ele1_id).getElementsByClassName(ele2_class)[0];
}

function statIsInRange(stat_to_check, value) {
  //return if value between min and max
  if (stat_to_check.max_stat) {
    return Boolean(value < stat_to_check.max_stat && value > default_min_stat);
  } else {
    return Boolean(value > default_min_stat);
  }
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
