let output = "";
const input = document.getElementById("input");
let operator = 0;
let mem = "";

//Button Logic
function pressNum(num){
    if (input.value !== ""){
        clearNum;
    }
    input.value += num;
}

function pressZero(num){
    if (input.value !== ""){
        clearNum;
    }
    if (input.value !== "0"){
        input.value += num;
    }
}

function clearNum(){
    input.value = "";
    output = 0;
}

function equals(){
    if (operator == 1){
        output = +output + +input.value;
    } else if (operator == 2){
        output = +output - +input.value;
    } else if (operator == 3){
        output = +output * +input.value;
    } else if (operator == 4){
        output = +output / +input.value;
    }
    input.value = output;
}

function decimal(num){
    if (!input.value.includes(".")) {
        input.value = input.value + num;
    }
}

function add(){
    output = input.value;
    input.value = "";
    operator = 1;
}

function subtract(){
    output = input.value;
    input.value = "";
    operator = 2;
}

function multiply(){
    output = input.value;
    input.value = "";
    operator = 3;
}

function divide(){
    output = input.value;
    input.value = "";
    operator = 4;
}

function changeSign(){
    input.value *= -1;
}

function makeFraction(){
    input.value = input.value/100;
}

function memory(){
    if (input.value == ""){
        input.value = mem;
    } else {
        mem = input.value;
        clearNum();
    }
}