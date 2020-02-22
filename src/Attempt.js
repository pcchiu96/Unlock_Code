import React from "react";

export default function Attempt({ attempt }) {
    return (
        <div>
            Code: <span className='lead'>{attempt.password}</span> Amount of tries: <span className='lead'>{attempt.tries}</span> Amount of
            time: <span className='lead'>{attempt.time}</span> ms
        </div>
    );
}
