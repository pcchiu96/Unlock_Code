let codeSet = [..."1234567890"];
let codeSetIndex = generateCodeIndex(codeSet);
let counter = 1;

document.getElementById("unlock").addEventListener("click", function () {
    handleUnlock();
});

function handleUnlock() {
    let code = document.getElementById("code").value;
    let print = document.getElementById("print");

    if (isNaN(code)) return (print.innerHTML = "Input must all be numbers.");

    if (code) {
        let t0 = performance.now();
        let unlocked = unlock(code);
        let t1 = performance.now();
        unlocked.time = (t1 - t0).toFixed(3);

        let row = print.insertRow(-1);

        // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);

        // Add some text to the new cells:
        cell1.innerHTML = unlocked.code;
        cell2.innerHTML = unlocked.tries;
        cell3.innerHTML = unlocked.time;

        // let tableRow = document.createElement("tr");
        // let tableCode = document.createElement("td");
        // let tableTries = document.createElement("td");
        // let tableTime = document.createElement("td");

        // tableCode.appendChild(document.createTextNode(unlocked.code));
        // tableTries.appendChild(document.createTextNode(unlocked.tries));
        // tableTime.appendChild(document.createTextNode(unlocked.time));

        // tableRow.appendChild(tableCode);
        // tableRow.appendChild(tableTries);
        // tableRow.appendChild(tableTime);
    } else {
        console.log("No input");
    }
}

//this generates the code index with each key as digit {'a' : 11} so it can be used to find the index
function generateCodeIndex(codeSet) {
    let obj = {};
    let length = codeSet.length;
    for (let i = 0; i < length; i++) {
        obj[codeSet[i]] = i;
    }
    return obj;
}

function unlock(code) {
    let runner = codeSet[0]; //initial value
    let n = 0;

    let lastDigit = codeSet[codeSet.length - 1];
    let firstDigit = codeSet[0];
    let codeLength = codeSet.length;
    let index = 0;
    let increment = 0;
    let pointer = 1;

    let next = "";
    let digitIndex = 0;

    while (code !== runner) {
        if (increment === codeLength) {
            //one tick
            if (isFlip(runner, lastDigit)) {
                //at max digit value
                runner = addDigit(codeSet, runner); //add a digit
                runner = resetAllBefore(runner, runner.length, firstDigit); //reset all values before it to default
                increment = 0;
            } else {
                next = runner.charAt(pointer);
                while (next === lastDigit && pointer < runner.length) {
                    //find the next non last digit value
                    pointer++;
                    next = runner.charAt(pointer);
                }

                digitIndex = codeSetIndex[next] + 1;

                runner = replaceAt(runner, codeSet[digitIndex], pointer);
                runner = resetAllBefore(runner, pointer, firstDigit);

                pointer = 1;
                increment = 0;
            }
        }

        runner = replaceAt(runner, codeSet[increment], index);
        increment++;

        //console.log(runner);
        n++;
    }
    console.log("Took " + n + " many tries.");

    return {
        code: runner,
        tries: n,
    };
}

//this function checks if the string consists of the last digit, returns true if it is and false if otherwise
function isFlip(str, lastDigit) {
    return str === lastDigit.repeat(str.length);
}

//adds the first digit from code set to the string
function addDigit(array, str) {
    return str + array[0];
}

//this resets all the characters before the index to the first digit from code set
function resetAllBefore(str, index, firstDigit) {
    return firstDigit.repeat(index) + str.substr(index);
}

function replaceAt(str, newStr, index) {
    return str.substr(0, index) + newStr + str.substr(index + 1);
}
