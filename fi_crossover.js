function total_capital_needed(monthly_expenses, interest_rate){
    return monthly_expenses * 12.0 / interest_rate
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function _c(val){
    val = parseFloat(val);
    return "$" + numberWithCommas(val.toFixed(2))
}

function compute_years_to_crossover(values){
    var results = compute_data_for_crossover(values)
    return results.length - 1;
}

function compute_data_for_crossover(values){
    console.log(values);
    var starting_capital = values.starting_capital;
    var monthly_expenses = values.monthly_expenses;
    var monthly_investment = values.monthly_investment;
    var long_term_rate = values.interest_rate;


    var years = 0
    var current_capital = starting_capital
    var total_needed = total_capital_needed(monthly_expenses, long_term_rate)
    var years_needed = -1

    var output = [];

    for(var x = 0; x < 100; x++){
        output.push({
            year: x,
            currentCapital: _c(current_capital),
            investmentIncome: _c(current_capital * long_term_rate / 12)
        })

        if(current_capital > total_needed){
            years_needed = x;
            break;
        }

        for(var m = 0; m < 12; m++){
            current_capital += monthly_investment
        }

        current_capital = current_capital * (1 + long_term_rate)
    }
    return output;
}


module.exports = {
    format: _c,
    compute_data_for_crossover: compute_data_for_crossover,
    compute_years_to_crossover: compute_years_to_crossover,
    total_capital_needed: total_capital_needed
}