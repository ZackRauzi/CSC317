// hello.js
const greeting = "Hello";
const greetee = "JavaScript";

const createMessage = (greeting, name) => {
    return `${greeting}, ${name}!`;
};

console.log(createMessage(greeting, greetee));