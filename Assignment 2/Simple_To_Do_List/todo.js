import inquirer from "inquirer";

// Array to store tasks
let tasks = [];

/**
 * Function to display the menu options
 */
async function showMenu() {

    // SHow Menu and wait for user to select an option
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: ['Add a new task', 'View all tasks', 'Delete a task', 'Exit']
        }
    ]);

    // Call Methods according to selected Options
    switch (answers.action) {
        case 'Add a new task':
            await addTask();
            break;
        case 'View all tasks':
            viewTasks();
            break;
        case 'Delete a task':
            await deleteTask();
            break;
        case 'Exit':
            console.log('Goodbye!');
            process.exit();
    }
}

/**
 * Function to add a new task
 */
async function addTask() {

    // Show message and wait for user to enter task name
    const answer = await inquirer.prompt([
        {
            type: 'input',
            name: 'task',
            message: 'Enter the task:'
        }
    ]);

    // Add task only if not null or not empty else show display error message.
    if (answer.task && answer.task.trim().length > 0) {
        tasks.push(answer.task);
        console.log(`Task added: ${answer.task}`);
    } else {
        console.log("Task not added due to being empty.");
    }
    showMenu();
}

/**
 * Function to view all tasks
 */
function viewTasks() {
    console.log('\nYour Tasks:');
    if (tasks.length === 0) { // Checking if no task available show default message
        console.log('No tasks available.');
    } else {
        // Loop through tasks and display on the screen
        tasks.forEach((task, index) => {
            console.log(`${index + 1}. ${task}`);
        });
    }
    showMenu();
}

/**
 * Function to delete a task by its number
 */
async function deleteTask() {
    if (tasks.length === 0) {
        console.log('No tasks to delete.');
        return showMenu();
    }

    // Show message and wait for user to enter task number to be deleted
    const answer = await inquirer.prompt([
        {
            type: 'input',
            name: 'taskNumber',
            message: 'Enter the task number to delete:',
            validate: (input) => {

                // Handle scenario where user decides cancel task deletion
                if (input.toLowerCase() === 'exit' || input.toLowerCase() === 'cancel') {
                    return true;
                }

                const num = parseInt(input);
                return num > 0 && num <= tasks.length ? true : 'Please enter a valid task number';
            }
        }
    ]);

    // Through default message if user decides to exit else delete the task and show deletion message
    if (answer.taskNumber.toLowerCase() === 'exit' || answer.taskNumber.toLowerCase() === 'cancel') {
        console.log(`Task deletion exited.`);
    } else {
        const taskIndex = parseInt(answer.taskNumber) - 1;
        const removedTask = tasks.splice(taskIndex, 1);
        console.log(`Task deleted: ${removedTask}`);
    }
    showMenu();
}

// Start the application
showMenu();
