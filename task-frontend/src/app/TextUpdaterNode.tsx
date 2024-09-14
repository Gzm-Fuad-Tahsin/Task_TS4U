import { useCallback, useState } from 'react';
import { Handle, Position } from '@xyflow/react';

const handleStyle = { left: 10 };

function TextUpdaterNode({ id, data, isConnectable }) {
    const onChange = useCallback(
      (evt) => {
        const newValue = evt.target.value;
        data.onLabelChange(id, newValue); // Call the onLabelChange function
      },
      [data, id]
    );

  return (
    <div className="text-updater-node">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <div>
        <label htmlFor="text">email:</label>
        <input id="text" name="text" onChange={onChange} className="nodrag" />
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        style={handleStyle}
        isConnectable={isConnectable}
      />
    </div>
  );
}

export default TextUpdaterNode;
