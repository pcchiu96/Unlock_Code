let passwordSet = [...'0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'];
let passwordSetIndex = generatePasswordIndex(passwordSet);

document.getElementById("unlock").addEventListener("click", unlockPassword);

function unlockPassword(){
    let password = document.getElementById("password").value;
    let print = document.getElementById("print");
    if (password){
        let t0 = performance.now();
        let unlocked = unlock(password);
        let t1 = performance.now();
        console.log('Took', (t1 - t0).toFixed(4), 'milliseconds');

        print.innerHTML = "Password: " + unlocked.password + "<br>"
        + "Amount of tries: " + unlocked.tries + "<br>"
        + "Time it took: " + (t1 - t0).toFixed(4) + " ms";
    } else {
        console.log("No input");
    }   
}

//this generates the password index with each key as digit {'a' : 11} so it can be used to find the index
function generatePasswordIndex(passwordSet){
    let obj = {};
    let length = passwordSet.length;
    for (let i = 0; i < length; i++) {
        obj[passwordSet[i]] = i;
    }
    return obj;
}

function unlock(password){
    let runner = passwordSet[0]; //initial value
    let n = 0;

    let lastDigit = passwordSet[passwordSet.length - 1];
    let firstDigit = passwordSet[0];
    let passwordLength = passwordSet.length;
    let index = 0;
    let increment = 0;
    let pointer = 1;

    let next = '';
    let digitIndex = 0;

    let process = document.getElementById("process");

    while (password !== runner){
        if (increment === passwordLength) { //one tick
            if (isFlip(runner, lastDigit)){ //at max digit value
                runner = addDigit(passwordSet, runner); //add a digit
                runner = resetAllBefore(runner, runner.length, firstDigit); //reset all values before it to default
                increment = 0;
            } else {
                next = runner.charAt(pointer); 
                while (next === lastDigit && pointer < runner.length){ //find the next non last digit value
                    pointer++;
                    next = runner.charAt(pointer);
                }

                digitIndex = passwordSetIndex[next] + 1; //

                runner = replaceAt(runner, passwordSet[digitIndex], pointer);
                runner = resetAllBefore(runner, pointer, firstDigit);

                pointer = 1;
                increment = 0;
            }
        }
        
        runner = replaceAt(runner, passwordSet[increment], index);
        increment++;

        //console.log(runner);
        n++; 
    }
    console.log("Took " + n + " many tries.");

    return {
        "password": runner,
        "tries": n
    }
}

//this function checks if the string consists of the last digit, returns true if it is and false if otherwise
function isFlip(str, lastDigit){
    let array = [...str];
    let length = str.length;
    for (let i = 0; i < length; i++){
        if (array[i] !== lastDigit){
            return false;
        }
    }
    return true;
}

//adds the first digit from password set to the string
function addDigit(array, str){
    return str + array[0];
}

//this resets all the characters before the index to the first digit from password set
function resetAllBefore(str, index, firstDigit){
    let n = str.substr(0, index).length;
    let i = 0;
    let zeros = "";
    while (i < n){
        zeros+=firstDigit;
        i++;
    }
    return zeros + str.substr(index);
}

function replaceAt(str, newStr, index){
    return str.substr(0, index) + newStr + str.substr(index + 1);
}