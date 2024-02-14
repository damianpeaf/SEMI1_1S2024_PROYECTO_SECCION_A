"use client";

import { useState } from "react";

export const Test = () => {
  const [name, setName] = useState("");

  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <h1>Hello {name}</h1>
    </div>
  );
};
