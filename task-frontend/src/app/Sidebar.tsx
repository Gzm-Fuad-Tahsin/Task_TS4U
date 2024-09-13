import React, { useState } from 'react';
import { useDnD } from './DnDContext';

export default () => {
  const [_, setType] = useDnD();
  const [inputValue, setInputValue] = useState(''); // State to manage input value
  const [defaultNodeName, setDefaultNodeName] = useState('Default'); // State for default node name

  const onDragStart = (event, nodeType) => {
    setType(nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  // Function to handle name change
  const handleNameChange = () => {
    if (inputValue) {
      setDefaultNodeName(inputValue);
    }
  };

  return (
    <aside className="border border-l-2 border-black px-3 py-4 w-1/6">
      <div className="text-xl pb-2 border-b-2 border-black">You can drag these nodes to the pane on the right.</div>

      <div className="flex cursor-grab" onDragStart={(event) => onDragStart(event, 'input')} draggable>
        Input Node
      </div>

      <div
        className="dndnode"
        onDragStart={(event) => onDragStart(event, defaultNodeName)}
        draggable
      >
        {defaultNodeName}
      </div>

      <div className="dndnode output" onDragStart={(event) => onDragStart(event, 'output')} draggable>
        Output Node
      </div>

      {/* Input field to change the node's name */}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)} // Update input value on change
        placeholder="Enter node name"
        className="mt-4 border px-2 py-1"
      />

      {/* Button to change the node name */}
      <button
        onClick={handleNameChange} // Trigger the name change on button click
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Change
      </button>
    </aside>
  );
};
