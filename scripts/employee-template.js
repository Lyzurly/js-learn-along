const employee_template = `
        <div class="employee-container employee1">
            <div class="abilities-container">
                <span class="button-wrapper">
                    <button class="text-mdlg" id="button1">
                        Pay
                    </button>
                    <span class="text-sm popup reveal">
                        Wages +1
                    </span>
                </span>
                <span class="button-wrapper">
                    <button class="text-mdlg" id="button2">
                        Praise
                    </button>
                    <span class="text-sm popup reveal">
                        Happiness +1
                    </span>
                </span>
            </div>

            <div class="stat-container">
                <span class="title-md stat-wrapper">
                    INCOME
                    <div class="text-lg stat-value" id="stat1">
                        5
                    </div>
                </span>
                <span class="title-md stat-wrapper">
                    HAPPINESS
                    <div class="text-lg stat-value" id="stat2">
                        5
                    </div>
                </span>
                <span class="title-md stat-wrapper">
                    WELLBEING
                    <div class="text-lg overall-value">
                        10
                    </div>
                </span>
            </div>
        </div>
        <hr class="employee-separator"></hr>
        `