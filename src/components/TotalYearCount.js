import React, { useState } from "react";

export default function TotalYearCount({ label, focusBuilding }) {
    const [pressCount, setPressCount] = useState(0);
    const [prevTotal, setPrevTotal] = useState(null);

    const handleClick = () => {
        setPressCount(prev => {
            const newCount = prev + 1;
            focusBuilding({
                yearCount: newCount,
                prevTotalOccupied: prevTotal,
                setPrevTotalOccupied: setPrevTotal
            });
            return newCount;
        });
    };

    return (
        <button onClick={handleClick} style={{ marginRight: 8 }}>
            {label}
        </button>
    );
}
