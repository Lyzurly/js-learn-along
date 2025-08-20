const employees_canvas = document.querySelector('.employees-canvas')
let employee_idno_previous = -1
let employees = []
const employee_id_prefix = "employee"


const button_hire = document.querySelector('#hire')

const max_stat = 10
const min_stat = 0
const base_inc_stat = 5
const base_wellbeing = 10

button_hire.addEventListener('click', function(event){
    addNewEmployee()
})

class Employee{
    constructor(
        employee_id
    ){
        this.employee = document.getElementById(employee_id.toString())
        this.buttons = this.employee.querySelectorAll('button')
        this.buttons.forEach(button => {
            button.addEventListener('click', function(event){
                //increase stat
                switch (event.target.className) {
                    case 'button-pay':
                        stat = this.employee.classList('.stat-pay')
                        increaseStat(stat)
                    break;
                    case 'button-praise':
                        stat = this.employee.classList('.stat-praise')
                        increaseStat(stat)
                    break;
                    default:
                        console.log("Unknown abilitiy used.")
                }
           })});

        this.stats = this.employee.querySelectorAll('.stat-value')
    }

    decreaseStats() {
        this.stats.forEach(stat => {
            //decreasing if stat is in range
            let value = base_inc_stat
            stat.innerHTML = value
            if (value > 0) {
                value--;
            }
            stat.innerHTML = value
        })
    }
    
} 

function addNewEmployee() {
    employee_idno_current = employee_idno_previous++
    employee_idno_previous = employee_idno_current

    employee_id = employee_id_prefix + employee_idno_current.toString()

    employees_canvas.innerHTML += employee_template

    employee_container = document.getElementById(employee_id_prefix)
    employee_container.id = employee_id

    employees.push(
        new Employee(
            employee_id,
        )
    )
}

setInterval(updateEmployees,1000)
function updateEmployees(){
    employees.forEach(employee =>{
        employee.decreaseStats()
    })
}

function increaseStat(stat){
    value = stat.innerHTML;
    if (isInRange(stat_value)) {
        value++;
    }
    stat.innerHTML = value
}

function isInRange(value) {
    //return if value between min and max
    return Boolean(value < max_stat && value >= min_stat)
}