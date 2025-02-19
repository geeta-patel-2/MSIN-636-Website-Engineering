import chalk from "chalk";

// Defining the array of 5 quotes
const quote = [
    "Faith is the bird that feels the light when the dawn is still dark - Rabindranath Tagore",
    "Arise, awake and stop not till the goal is reached - Swami Vivekananda.",
    "Leadership is about taking responsibility, not making excuses.",
    "If you want to walk fast, walk alone. But if you want to walk far walk together.",
    "Simple living and high thinking"
]

// printing the quote in different colors
function printQuote(quote) {

    // generating a random number between 0 and 4 both inclusive
    const index = Math.floor((Math.random() * 10) / 2);

    // printing the provided quote in the randomly selected color
    switch (index) {
        case 0:
            console.log(chalk.cyan(quote));
            break;
        case 1:
            console.log(chalk.green(quote));
            break;
        case 2:
            console.log(chalk.yellow(quote));
            break;
        case 3:
            console.log(chalk.blue(quote));
            break;
        default:
            console.log(chalk.red(quote));
            break;
    }
}

// Printing common statement without colors
console.log("Your Quote of the Day: ");

/**
 * 1. Generating Random number between 0 and 4 inclusive
 * 2. Picking the quote at index where index is the generated number in previous step
 * 3. Calling printQuote method to actually print the picked quote from step 2
 * */
printQuote(quote[Math.floor((Math.random() * 10) / 2)]);