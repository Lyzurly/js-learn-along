
const max_stat = 10
const min_stat = 0

const stats = document.querySelectorAll('.stat_value')

setInterval(decreaseStats,1000)

function decreaseStats() {
    stats.forEach(stat => {
        //decreasing if stat is in range
        value = stat.innerHTML
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