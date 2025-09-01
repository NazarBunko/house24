import React from "react";
import { Button } from "antd";

function CollaborationTab() {
  return (
    <div
      style={{
        position: "absolute", // Змінено на 'absolute'
        top: "40%",
        right: 0,
        width: "220px",
        backgroundColor: "#28a745",
        color: "white",
        borderTopLeftRadius: "8px",
        borderBottomLeftRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        display: "flex",
        alignItems: "center",
        padding: "10px",
        zIndex: 1000,
      }}
    >
      <div style={{ flex: 1, textAlign: "center" }}>
        <p style={{ margin: "0 0 8px 0", fontWeight: 500, fontSize: "0.9rem" }}>
          Готові до співпраці? <br /> Розмістіть своє житло у нас
        </p>
        <Button
          type="primary"
          style={{
            backgroundColor: "white",
            color: "#28a745",
            border: "none",
            fontWeight: 500,
            padding: "0 12px",
            fontSize: "0.85rem",
          }}
        >
          Співпраця
        </Button>
      </div>
    </div>
  );
}

export default CollaborationTab;