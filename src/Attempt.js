import React from "react";

export default function Attempt({ attempt }) {
    return (
        <tr>
            <th scope='row'>{attempt.id}</th>
            <td>{attempt.code}</td>
            <td>{attempt.tries}</td>
            <td>{attempt.time} ms</td>
        </tr>
    );
}
