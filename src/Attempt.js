import React from "react";

export default function Attempt({ attempt }) {
    return (
        <div>
            Password: {attempt.password} Amount of tries: {attempt.tries} Amount of time: {attempt.time} ms
        </div>
    );
}
