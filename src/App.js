import React, { useState, useRef } from "react";
import AttempList from "./AttemptList";
import uuidv4 from "uuid/v4";
import "./App.css";

function App() {
    let codeSet = [..."0123456789abcdefghijklmnopqrstuvwxyz"];
    // let codeSet = [..."0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"];
    // let codeSet = [..."0123456789"];
    let codeSetIndex = generatecodeIndex(codeSet);
    let counter = 1;

    const [attempts, setAttempts] = useState([]);
    const codeRef = useRef();

    function handleUnlock() {
        let code = codeRef.current.value.toLowerCase();

        if (code) {
            let t0 = performance.now();
            let unlocked = unlock(code);
            let t1 = performance.now();
            unlocked.time = (t1 - t0).toFixed(3);
            // unlocked.id = uuidv4();

            if (attempts.length === 0) {
                unlocked.id = counter;
            } else {
                unlocked.id = attempts[attempts.length - 1].id + 1;
            }

            setAttempts(prevAttemps => {
                return [...prevAttemps, unlocked];
            });
        } else {
            console.log("No input");
        }
    }

    function handleClear() {
        setAttempts([]);
    }

    //this generates the code index with each key as digit {'a' : 11} so it can be used to find the index
    function generatecodeIndex(codeSet) {
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
            tries: n
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

    return (
        <div className='background'>
            <div className='App'>
                <header className='App-header mt-5'>Welcome to Unlock Code</header>
                <dl className='row'>
                    <dt className='col-sm-2 align-right'>Description</dt>
                    <dd className='col-sm-9'>
                        This is just a fun little project I made to see if I can replicate what{" "}
                        <a className='btn-link text-info' href='https://www.youtube.com/watch?v=yzGzB-yYKcc'>
                            Snowden
                        </a>{" "}
                        said about codes under 8 characters can be solved under a second.
                    </dd>

                    <dt className='col-sm-2 align-right'>Guide</dt>
                    <dd className='col-sm-9'>Simply enter any code you would like my program to try unlock</dd>

                    <dt className='col-sm-2 align-right'>Note</dt>
                    <dd className='col-sm-9'>
                        This obviously isn't a hack or anymeans. All it does is run every possible combination and hit with the code
                        entered.
                    </dd>
                </dl>
                <div className='form-inline mb-5 center_form'>
                    <div className='form-group m-0 m-sm-3'>
                        <input type='text' ref={codeRef} className='form-control' placeholder='Enter a code' />
                    </div>
                    <div>
                        <button type='button' onClick={handleUnlock} className='btn btn-outline-info shadow-none m-sm-3'>
                            Unlock
                        </button>
                        <button type='button' onClick={handleClear} className='btn btn-outline-info shadow-none'>
                            Clear
                        </button>
                    </div>
                </div>
                <table className='table table-hover table-dark'>
                    <thead>
                        <tr>
                            <th scope='col '>#</th>
                            <th scope='col'>Code</th>
                            <th scope='col'>Amount of Tries</th>
                            <th scope='col'>Time Spent</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AttempList attempts={attempts} />
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default App;
