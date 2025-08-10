import React from "react";

export default function HDBInfoBox({ data, onClose, yearCount }) {
    if (!data) return null;

    // Calculate total occupied units
    const totalOccupied = Object.values(data.occupied).reduce((a, b) => a + b, 0);
    const prevTotal = yearCount === 1 ? 0 : (data.prevTotalOccupied ?? 0);
    const diff = data.occupiedDiff || 0;
    const diffColor = diff > 0 ? "lightgreen" : diff < 0 ? "salmon" : "white";

    return (
        <div
            style={{
                position: "absolute",
                top: "50%",
                left: "60%", // shifted right from center
                transform: "translateY(-50%)",
                padding: "12px 16px",
                background: "rgba(0,0,0,0.9)",
                color: "#fff",
                borderRadius: "8px",
                fontSize: "14px",
                zIndex: 10,
                maxWidth: "280px",
                lineHeight: 1.4
            }}
        >
            {/* Close button */}
            <button
                onClick={onClose}
                style={{
                    position: "absolute",
                    top: "6px",
                    right: "8px",
                    background: "transparent",
                    border: "none",
                    color: "#fff",
                    fontSize: "16px",
                    cursor: "pointer",
                    lineHeight: "1"
                }}
                aria-label="Close"
            >
                &times;
            </button>

            <div style={{ fontWeight: "bold", marginBottom: "6px" }}>Building Details</div>

            <div><strong>Full address:</strong> {data.address}</div>

            <div style={{ marginTop: "8px" }}>
                <strong>Total Units:</strong> {data.totalUnits}
                <ul style={{ margin: "4px 0 6px 16px", padding: 0 }}>
                    {Object.entries(data.units).map(([type, count]) => (
                        <li key={type}>{type} rooms: {count}</li>
                    ))}
                </ul>
            </div>

            <div style={{ marginTop: "8px" }}>
                <strong>Occupied: {totalOccupied}</strong>
                <ul style={{ margin: "4px 0 0 16px", padding: 0 }}>
                    {Object.entries(data.occupied).map(([type, count]) => (
                        <li key={type}>{type} rooms: {count}</li>
                    ))}
                </ul>

                <div style={{ marginTop: "6px", fontWeight: "bold", textAlign: "center", color: diffColor }}>
                    Statistic: {diff > 0 ? `+${diff}` : diff}
                </div>

                <div style={{ marginTop: "12px", fontWeight: "bold", fontSize: "16px", textAlign: "center" }}>
                    Year: {yearCount}
                </div>

                <div style={{ marginTop: "2px", fontWeight: "bold", color: "lightgray" }}>
                    Prior Year Occupancy: {prevTotal}
                </div>
            </div>
        </div>
    );
}
