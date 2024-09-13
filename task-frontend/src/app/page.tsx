"use client";
import {
  addEdge,
  Controls,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/base.css";
import "@xyflow/react/dist/style.css";
import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import CustomNode from "./CustomNode";
import { DnDProvider, useDnD } from "./DnDContext";
import "./index.css";
import Sidebar from "./Sidebar";

interface NodeData {
  label: string;
}

interface CustomNodeProps {
  id: string;
  data: NodeData;
  type: string;
  position: { x: number; y: number };
}

const nodeTypes = {
  custom: CustomNode,
};

const initialNodes: CustomNodeProps[] = [
  {
    id: "1",
    type: "custom",
    data: { label: "input" },
    position: { x: 250, y: 5 },
  },
];

let id = 0;
const getId = () => `dndnode_${id++}`;

const socket: Socket = io("http://localhost:5000");

const DnDFlow: React.FC = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [rfInstance, setRfInstance] = useState<ReactFlow | null>(null);
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

      if (!type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: getId(),
        type: "custom",
        position,
        data: { label: `${type}` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, type]
  );

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

    const ipAddress = await getData(); // Fetch IP address

    if (rfInstance) {
      const flow = rfInstance.toObject();
      const data = {
        flow,
        ipAddress,
      };

      console.log("Data to send:", JSON.stringify(data));

      try {
        await axios.post("http://localhost:5001/api/v1/auth/flowdata", data);
        // Emit the data to the server
        socket.emit("flowData", data);
      } catch (error) {
        console.error("Error sending data:", error);
      }
    }
  }, [rfInstance]);

  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      const ipAddress = await getData();
      const flow1 = await axios.get(
        `http://localhost:5001/api/v1/auth/flowdata/${ipAddress}`
      );
      const flow = flow1.data;
      const { nodes, edges, viewport } = flow1.data;
      console.log(flow);

      if (nodes && edges && viewport) {
        setNodes(nodes);
        setEdges(edges);
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
  socket.on("connect", () => {
    console.log("Connected to server");
  });
  useEffect(() => {
    socket.on("flowData", (data) => {
      const { nodes, edges } = data.flow;
      console.log(nodes);
      setNodes(nodes);
      setEdges(edges);
    });

    return () => {
      socket.off("flowData"); // Cleanup on unmount
    };
  }, []);

  return (
    <div className="flex flex-row-reverse flex-grow h-full">
      <div className="flex-grow h-full" ref={reactFlowWrapper}>
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

const App: React.FC = () => (
  <ReactFlowProvider>
    <DnDProvider>
      <DnDFlow />
    </DnDProvider>
  </ReactFlowProvider>
);

export default App;
