var unique = require('uniq');
var crossover = require('./fi_crossover');
var $ = jQuery = require('jquery');
var bootstrap = require('bootstrap');
var Slider = require("bootstrap-slider");

var c3 = require('c3');

var INTEREST_RATE = 0.05;
var STARTING_CAPITAL = 50000;
var MONTHLY_INVESTMENT = 2500;
var MONTHLY_EXPENSES = 2000;

$("#rate").val(INTEREST_RATE);
$("#starting_capital").val(STARTING_CAPITAL);
$("#monthly_investment").val(MONTHLY_INVESTMENT);
$("#monthly_expenses").val(MONTHLY_EXPENSES);

var tableHeader = $("table").html();
console.log(tableHeader);

function setupSlider(opts){

  var slider = new Slider(
      opts.sliderID,
      {
        id: opts.id,
        min: opts.min,
        max: opts.max,
        value: opts.value,
        step: opts.step
      }
  );

  slider.on('slide', function(){
    $(opts.inputID).val(slider.getValue());
  });

  $(opts.inputID).on('change', function(){
    var val = parseFloat($(this).val());
    slider.setValue(val);
  });
}

setupSlider({
  sliderID: '#monthly_investment_slider',
  inputID: '#monthly_investment',
  id: 'slider3',
  min: 0,
  max: 5000,
  value: MONTHLY_INVESTMENT,
  step: 100
});

setupSlider({
  sliderID: '#monthly_expenses_slider',
  inputID: '#monthly_expenses',
  id: 'slider4',
  min: 0,
  max: 5000,
  value: MONTHLY_EXPENSES,
  step: 100
});

setupSlider({
  sliderID: '#starting_capital_slider',
  inputID: '#starting_capital',
  id: 'slider3',
  min: 1000,
  max: 400000,
  value: STARTING_CAPITAL,
  step: 1000
});

setupSlider({
  sliderID: '#rate_slider',
  inputID: '#rate',
  id: 'slider2',
  min: 0.01,
  max: 0.20,
  value: INTEREST_RATE,
  step: 0.01
});


function update_table_for_values(values){
  console.log(values);

  var data = crossover.compute_data_for_crossover(values);

  console.log(data);

  $("#capital").html("");
  $("#capital").append(tableHeader)

  for(var i = 0; i < data.length; i++){
    var cur = data[i];
    console.log(cur);
    $("#capital").append(
      "<tr><td>" + cur.year + "</td><td>"
      + cur.currentCapital + "</td><td>"
      + cur.investmentIncome + "</td></tr>"
    )
  }
}

function getVal(id) {
  return parseFloat($(id).val());
}


// Update once on start
update_table_for_values({
    starting_capital: STARTING_CAPITAL,
    monthly_expenses: MONTHLY_EXPENSES,
    monthly_investment: MONTHLY_INVESTMENT,
    interest_rate: INTEREST_RATE
});

// Update on click
$("#update_chart").click(function() {
    var interest_rate = parseFloat($("#rate").val());
    var starting_capital = parseFloat($("#starting_capital").val());
    var monthly_investment = parseFloat($("#monthly_investment").val());
    var monthly_expenses = parseFloat($("#monthly_expenses").val());

    update_table_for_values({
        starting_capital: starting_capital,
        monthly_expenses: monthly_expenses,
        monthly_investment: monthly_investment,
        interest_rate: interest_rate
    });

    interestChart.load({
      columns: getInterestRateChartData()
    });

    monthlyInvestmentChart.load({
      columns: getMonthlyInvestmentChartData()
    });
});

function getInterestRateChartData(){
  // Get the interest rates for the x axis
  var interest_rates = [];
  for(var i = 1; i <= 20; i ++){
    interest_rates.push(0.01 * i);
  }
  console.log(interest_rates);

  var years_to_crossover = [];
  for(var i = 0; i < interest_rates.length; i++){
    var graph_parameters = {
      starting_capital: getVal('#starting_capital'),
      monthly_expenses: getVal('#monthly_expenses'),
      monthly_investment: getVal('#monthly_investment'),
      interest_rate: interest_rates[i]
    }
    var years_to_cross = crossover.compute_years_to_crossover(graph_parameters);
    years_to_crossover.push(years_to_cross);
  }

  // Add the title at the start
  interest_rates.splice(0, 0, "interest_rate");
  years_to_crossover.splice(0, 0, "years_to_crossover");

  return [interest_rates, years_to_crossover];
}

function getMonthlyInvestmentChartData(){
  // Get the interest rates for the x axis
  var monthly_investments = [];
  for(var i = 1; i <= 50; i ++){
    monthly_investments.push(100 * i);
  }

  var years_to_crossover = [];
  for(var i = 0; i < monthly_investments.length; i++){
    var graph_parameters = {
      starting_capital: getVal('#starting_capital'),
      monthly_expenses: getVal('#monthly_expenses'),
      monthly_investment: monthly_investments[i],
      interest_rate: getVal('#rate')
    }
    var years_to_cross = crossover.compute_years_to_crossover(graph_parameters);
    years_to_crossover.push(years_to_cross);
  }

  // Add the title at the start
  monthly_investments.splice(0, 0, "monthly_investment");
  years_to_crossover.splice(0, 0, "years_to_crossover");

  return [monthly_investments, years_to_crossover];
}


var interestChart = c3.generate({
    bindto: '#interestChart',
    data: {
        x: 'interest_rate',
        columns: getInterestRateChartData()
    }
});

var monthlyInvestmentChart = c3.generate({
    bindto: '#monthlyInvestmentChart',
    data: {
        x: 'monthly_investment',
        columns: getMonthlyInvestmentChartData()
    }
});


