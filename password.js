let passwordSet = [...'0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'];
let passwordSetIndex = generatePasswordIndex(passwordSet);

document.getElementById("unlock").addEventListener("click", unlockPassword);

function unlockPassword(){
    let password = document.getElementById("password").value;
    unlock(password);
}

//this generates the password index with each key as digit {'a' : 11} so it can be used to find the index
function generatePasswordIndex(passwordSet){
    let obj = {};
    for (let i = 0; i < passwordSet.length; i++) {
        obj[passwordSet[i]] = i;
    }
    return obj;
}

function unlock(password){
    let runner = passwordSet[0]; //initial value
    let n = 0;

    let lastDigit = passwordSet[passwordSet.length - 1];
    let firstDigit = passwordSet[0];
    let index = 0;
    let increment = 0;
    let pointer = 1;

    let next = '';
    let digitIndex = 0;

    while (password !== runner){
        if (increment === passwordSet.length) { //one tick
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

                digitIndex = passwordSetIndex[next] + 1;

                runner = replaceAt(runner, passwordSet[digitIndex], pointer);
                runner = resetAllBefore(runner, pointer, firstDigit);

                pointer = 1;
                increment = 0;
            }
        }
        
        runner = replaceAt(runner, passwordSet[increment], index);
        increment++;

        console.log(runner);
        n++;
    }
    console.log("Took " + n + " many tries.");
}

//this function checks if the string consists of the last digit, returns true if it is and false if otherwise
function isFlip(str, lastDigit){
    let array = [...str];
    for (let i = 0; i < str.length; i++){
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