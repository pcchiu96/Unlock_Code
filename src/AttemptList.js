import React from "react";
import Attempt from "./Attempt";

export default function AttemptList({ attempts }) {
    return attempts.map(attempt => {
        return <Attempt key={attempt.id} attempt={attempt} />;
    });
}
