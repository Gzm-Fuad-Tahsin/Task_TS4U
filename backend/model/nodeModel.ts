import mongoose, { Document, Schema, Model } from 'mongoose';

// Define TypeScript interfaces for each schema component

interface INode extends Document {
  id: string;
  type: string;
  data: {
    label: string;
  };
  position: {
    x: number;
    y: number;
  };
  measured: {
    width: number;
    height: number;
  };
  selected?: boolean;
  dragging?: boolean;
}

interface IEdge extends Document {
  source: string;
  target: string;
  id: string;
}

interface IViewport extends Document {
  x: number;
  y: number;
  zoom: number;
}

interface IFlow extends Document {
  device: string;
  nodes: INode[];
  edges: IEdge[];
  viewport: IViewport;
}

// Define schema for the node object
const NodeSchema: Schema = new Schema({
  id: { type: String, required: true },
  type: { type: String, required: true },
  data: {
    label: { type: String, required: true }
  },
  position: {
    x: { type: Number, required: true },
    y: { type: Number, required: true }
  },
  measured: {
    width: { type: Number, required: true },
    height: { type: Number, required: true }
  },
  selected: { type: Boolean, default: false },
  dragging: { type: Boolean, default: false }
});

// Define schema for the edge object
const EdgeSchema: Schema = new Schema({
  source: { type: String, required: true },
  target: { type: String, required: true },
  id: { type: String, required: true }
});

// Define schema for the viewport object
const ViewportSchema: Schema = new Schema({
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  zoom: { type: Number, required: true }
});

// Main schema for the flow
const FlowSchema: Schema = new Schema({
  device: {
    type: String,
    required: true,
  },
  nodes: [NodeSchema],
  edges: [EdgeSchema],
  viewport: ViewportSchema
});

// Create and export the model
const Flow: Model<IFlow> = mongoose.model<IFlow>('Flow', FlowSchema);

export default Flow;
