const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)
const employees = [];

const question = () =>
  inquirer.prompt([
    {
      type: "input",
      message: "Please provide your name?",
      name: "name",
    },
    {
      type: "input",
      message: "Please provide your email address?",
      name: "email",
    },
    {
      type: "input",
      message: "Please provide your id.",
      name: "id",
    },
    {
      type: "list",
      message: "What is your role?",
      choices: ["Manager", "Engineer", "Intern"],
      name: "role",
    },
  ]);

function main() {
  question().then(async (response) => {
    switch (response.role) {
      case "Manager":
        const employeeMgr = await createManager(
          response.name,
          response.id,
          response.email
        );
        employees.push(employeeMgr);

        addAnotherEmployee();
        break;

      case "Engineer":
        const employeeEng = await createEngineer(
          response.name,
          response.id,
          response.email
        );
        employees.push(employeeEng);
        addAnotherEmployee();
        break;

      case "Intern":
        const employeeInt = await createIntern(
          response.name,
          response.id,
          response.email
        );
        employees.push(employeeInt);

        addAnotherEmployee();
        break;
      default:
        break;
    }
  });
}

async function createManager(name, id, email) {
  const response = await inquirer.prompt([
    {
      type: "input",
      message: "What is your office number?",
      name: "officeNumber",
    },
  ]);

  return new Manager(name, id, email, response.officeNumber);
}

async function createEngineer(name, id, email) {
  const response = await inquirer.prompt([
    {
      type: "input",
      message: "What is your Github username?",
      name: "github",
    },
  ]);

  return new Engineer(name, id, email, response.github);
}

async function createIntern(name, id, email) {
  const response = await inquirer.prompt([
    {
      type: "input",
      message: "Where do you attend University?",
      name: "university",
    },
  ]);

  return new Intern(name, id, email, response.university);
}

function addAnotherEmployee() {
  inquirer
    .prompt([
      {
        type: "confirm",
        message: "Would you like to add another employee?",
        name: "addEmployee",
      },
    ])
    .then((response) => {
      if (response.addEmployee) {
        main();
      } else {
        const data = render(employees);
        //fs function
        if (!fs.existsSync(OUTPUT_DIR)) {
          fs.mkdirSync(OUTPUT_DIR);
        }
        fs.writeFile(outputPath, data, (err) => {
          return err ? console.log(err) : console.log("Success!");
        });
      }
    });
}

main();

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!
// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
