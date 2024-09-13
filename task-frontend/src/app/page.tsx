'use client'
import {
  Controls,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/base.css";
import "@xyflow/react/dist/style.css";
import { useCallback, useRef, useState } from "react";

import { DnDProvider, useDnD } from "./DnDContext";
import Sidebar from "./Sidebar";

import axios from "axios";
import "../../tailwind.config";
import CustomNode from "./CustomNode";
import "./index.css";

const nodeTypes = {
  custom: CustomNode,
};

const initialNodes = [
  {
    id: "1",
    type: "custom",
    data: { label: "input node" },
    position: { x: 250, y: 5 },
  },
];

let id = 0;
const getId = () => `dndnode_${id++}`;

const DnDFlow = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [rfInstance, setRfInstance] = useState(null);
  const { screenToFlowPosition } = useReactFlow();
  const [type] = useDnD();

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      // check if the dropped element is valid
      if (!type) {
        return;
      }

      // project was renamed to screenToFlowPosition
      // and you don't need to subtract the reactFlowBounds.left/top anymore
      // details: https://reactflow.dev/whats-new/2023-11-10
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: getId(),
        type: "custom",
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, type]
  );
  const flowKey = "reactFlowData";
  const getData = async () => {
    try {
      const res = await axios.get("https://api.ipify.org/?format=json");
      console.log("IP Address:", res.data.ip);
      return res.data.ip; // Return the IP address
    } catch (error) {
      console.error("Error fetching IP address:", error);
      return null;
    }
  };

  const onSave = useCallback(async () => {
    console.log("onSave triggered");
    console.log("rfInstance:", rfInstance);

    // Get the IP address
    const ipAddress = await getData(); // Fetch IP address

    if (rfInstance) {
      const flow = rfInstance.toObject();

      // Prepare the data to be sent with the IP address
      const data = {
        flow,
        ipAddress,
      };

      // Log the data to be sent
      console.log("Data to send:", JSON.stringify(data));

      // Send the data to the backend using Axios
      try {
        await axios
          .post("http://localhost:5001/api/v1/auth/flowdata", data)
          .then((response) => {
            console.log(response);
          });
      } catch (error) {
        console.error("Error sending data:", error);
      }
    }
  }, [rfInstance]);

  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      // const flow = JSON.parse(localStorage.getItem(flowKey));
      const ipAddress = await getData();
      const flow1 = await axios.get(
        `http://localhost:5001/api/v1/auth/flowdata/${ipAddress}`
      );
      const flow = flow1.data;
      const { nodes, edges, viewport } = flow1.data;
      console.log(flow);

      if (nodes && edges && viewport) {
        // Set nodes and edges in the React Flow state
        setNodes(nodes);
        setEdges(edges);

        // Update the viewport position and zoom
        screenToFlowPosition({
          x: viewport.x || 0,
          y: viewport.y || 0,
          zoom: viewport.zoom || 1,
        });
      }
    };

    restoreFlow();
  }, [setNodes, screenToFlowPosition]);

  const onAdd = useCallback(() => {
    const newNode = {
      id: getId(),
      data: { label: "Added node" },
      type: "custom",
      position: {
        x: (Math.random() - 0.5) * 400,
        y: (Math.random() - 0.5) * 400,
      },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);

  return (
    <div className="dndflow">
      <div className="reactflow-wrapper" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setRfInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
          nodeTypes={nodeTypes}
        >
          <Controls />
          <Panel position="top-right">
            <button
              onClick={onSave}
              className="p-2 border-black border-2 rounded-md mr-2"
            >
              save
            </button>
            <button
              onClick={onRestore}
              className="p-2 border-black border-2 rounded-md mr-2"
            >
              restore
            </button>
            <button
              onClick={onAdd}
              className="p-2 border-black border-2 rounded-md mr-2"
            >
              add node
            </button>
          </Panel>
        </ReactFlow>
      </div>
      <Sidebar />
    </div>
  );
};

export default () => (
  <ReactFlowProvider>
    <DnDProvider>
      <DnDFlow />
    </DnDProvider>
  </ReactFlowProvider>
);
