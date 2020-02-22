import React, { useState, useRef } from "react";
import AttempList from "./AttemptList";
import uuidv4 from "uuid/v4";
import "./App.css";

function App() {
    // let passwordSet = [...'0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'];
    let passwordSet = [..."0123456789"];
    let passwordSetIndex = generatePasswordIndex(passwordSet);

    const [attempts, setAttempts] = useState([]);
    const passwordRef = useRef();

    function handleUnlock() {
        let password = passwordRef.current.value;

        if (password) {
            let t0 = performance.now();
            let unlocked = unlock(password);
            let t1 = performance.now();
            unlocked.time = (t1 - t0).toFixed(4);
            unlocked.id = uuidv4();

            console.log(unlocked);

            setAttempts(prevAttemps => {
                return [...prevAttemps, unlocked];
            });
        } else {
            console.log("No input");
        }
    }

    //this generates the password index with each key as digit {'a' : 11} so it can be used to find the index
    function generatePasswordIndex(passwordSet) {
        let obj = {};
        let length = passwordSet.length;
        for (let i = 0; i < length; i++) {
            obj[passwordSet[i]] = i;
        }
        return obj;
    }

    function unlock(password) {
        let runner = passwordSet[0]; //initial value
        let n = 0;

        let lastDigit = passwordSet[passwordSet.length - 1];
        let firstDigit = passwordSet[0];
        let passwordLength = passwordSet.length;
        let index = 0;
        let increment = 0;
        let pointer = 1;

        let next = "";
        let digitIndex = 0;

        while (password !== runner) {
            if (increment === passwordLength) {
                //one tick
                if (isFlip(runner, lastDigit)) {
                    //at max digit value
                    runner = addDigit(passwordSet, runner); //add a digit
                    runner = resetAllBefore(runner, runner.length, firstDigit); //reset all values before it to default
                    increment = 0;
                } else {
                    next = runner.charAt(pointer);
                    while (next === lastDigit && pointer < runner.length) {
                        //find the next non last digit value
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

            //console.log(runner);
            n++;
        }
        console.log("Took " + n + " many tries.");

        return {
            password: runner,
            tries: n
        };
    }

    //this function checks if the string consists of the last digit, returns true if it is and false if otherwise
    function isFlip(str, lastDigit) {
        return str === lastDigit.repeat(str.length);
    }

    //adds the first digit from password set to the string
    function addDigit(array, str) {
        return str + array[0];
    }

    //this resets all the characters before the index to the first digit from password set
    function resetAllBefore(str, index, firstDigit) {
        return firstDigit.repeat(index) + str.substr(index);
    }

    function replaceAt(str, newStr, index) {
        return str.substr(0, index) + newStr + str.substr(index + 1);
    }

    return (
        <div className='background'>
            <div className='App'>
                <header className='App-header'>Welcome to Unlock Code</header>
                <dl className='row'>
                    <dt className='col-sm-2 align-right'>Description</dt>
                    <dd className='col-sm-9'>
                        This is just a fun little project I made to see if I can replicate what{" "}
                        <a className='btn-link text-info' href='https://www.youtube.com/watch?v=yzGzB-yYKcc'>
                            Snowden
                        </a>{" "}
                        said about passwords under 8 characters can be solved under a second.
                    </dd>

                    <dt className='col-sm-2 align-right'>Guide</dt>
                    <dd className='col-sm-9'>Simply enter any code you would like my program to try unlock</dd>

                    <dt className='col-sm-2 align-right'>Note</dt>
                    <dd className='col-sm-9'>
                        This obviously isn't a hack or anymeans. All it does is run every possible combination and hit with the code
                        entered.
                    </dd>
                </dl>
                <div className='form-inline mb-5'>
                    <div className='form-group mx-sm-3 mb-2'>
                        <input type='text' ref={passwordRef} className='form-control' placeholder='Enter a code' />
                    </div>
                    <button onClick={handleUnlock} className='btn btn-info mb-2'>
                        Unlock
                    </button>
                </div>
                <AttempList attempts={attempts} />
            </div>
        </div>
    );
}

export default App;
