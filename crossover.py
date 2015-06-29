STARTING_CAPITAL = 50000
MONTHLY_EXPENSES = 2000
MONTHLY_INVESTMENT = 2500
LONG_TERM_RATE = 0.05


def total_capital_needed(monthly_expenses, interest_rate):
    return monthly_expenses * 12.0 / interest_rate


def commas(val):
    return "${:,}".format(val)


def _c(val):
    return commas(val)


def compute_years_to_crossover(
        starting_capital,
        monthly_expenses,
        monthly_investment,
        long_term_rate,
        show_results=True,
        show_output=False
):
    # years = 0
    current_capital = starting_capital
    total_needed = total_capital_needed(monthly_expenses, long_term_rate)
    years_needed = -1

    for x in range(100):
        if show_output:
            print "%s: %s" % (x, commas(current_capital))

        if current_capital > total_needed:
            years_needed = x
            break

        for m in range(12):
            current_capital += monthly_investment

        current_capital = current_capital * (1 + long_term_rate)

    if show_results:
        print "Starting Capital: ", _c(starting_capital)
        print "Monthly Expenses: ", _c(monthly_expenses)
        print "Monthly Investment: ", _c(monthly_investment)
        print "Long Term Rate: ", long_term_rate
        print "Years Needed", years_needed

    return x

if __name__ == "__main__":
    rate = 0.01

    results = []

    print "assumptions"
    print "Starting Capital: ", _c(STARTING_CAPITAL)
    print "Monthly Expenses: ", _c(MONTHLY_EXPENSES)
    print "Monthly Investment: ", _c(MONTHLY_INVESTMENT)
    print ""

    for x in range(10):
        cur_rate = (x + 1) * rate
        years = compute_years_to_crossover(
            STARTING_CAPITAL, MONTHLY_EXPENSES,
            MONTHLY_INVESTMENT, cur_rate, show_results=False)

        results.append((cur_rate, years))
        # print years

    for x in results:
        print "Interest Rate: %.2f, Years: %d" % (x[0], x[1])

    total_needed = total_capital_needed(MONTHLY_EXPENSES, LONG_TERM_RATE)
    print commas(total_needed)
