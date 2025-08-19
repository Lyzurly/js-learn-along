
const max_stat = 10
const min_stat = 0
const base_inc_stat = 5
const base_wellbeing = 10

const stats = document.querySelectorAll('.stat-value')

const employees_canvas = document.querySelector('.employees-canvas')

addNewEmployee()
function addNewEmployee() {
    employees_canvas.innerHTML += employee_template
}
addNewEmployee()

// setInterval(decreaseStats,1000)

function decreaseStats() {
    stats.forEach(stat => {
        //decreasing if stat is in range
        let value = base_inc_stat
        stat.innerHTML = value
        if (value > 0) {
            value--;
        }
        stat.innerHTML = value
    })
}

const buttons = document.querySelectorAll('button')
buttons.forEach(button => {
    button.addEventListener('click', function(event){
        //increase stat
        switch (event.target.id) {
            case "button1":
                stat1 = document.getElementById('stat1')
                value = stat1.innerHTML;
                if (isInRange(value)) {
                    value++;
                }
                stat1.innerHTML = value
            break;
            case "button2":
                stat1 = document.getElementById('stat2')
                value = stat1.innerHTML;
                if (isInRange(value)) {
                    value++;
                }
                stat1.innerHTML = value
            break;
            default:
                console.log("Unknown abilitiy used.")
        }
    })});

function isInRange(value) {
    //return if value between min and max
    return Boolean(value < max_stat && value >= min_stat)
}