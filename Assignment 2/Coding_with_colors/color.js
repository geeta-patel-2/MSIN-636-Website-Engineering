// Import the chalk library to add colors to the text
import chalk from "chalk";
import readline from "readline";

// Ask the user for their name
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Prompt the user for their name
rl.question('What is your name? ', (name) => {
    // Create a personalized message with different colors
    const message = chalk.blue(`Hello, ${name}!`) +
        chalk.green(' Welcome to the colorful world of Node.js!') +
        chalk.red('\nEnjoy coding with color!');

    // Print the personalized message in different colors
    console.log(message);

    // Close the readline interface
    rl.close();
});
