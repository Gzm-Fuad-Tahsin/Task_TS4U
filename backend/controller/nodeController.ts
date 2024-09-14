import { Request, Response } from 'express';
import nodeModel from '../model/nodeModel'; // Make sure your model file has TypeScript definitions
import sendMail from './sendMail';


// Define interfaces for type safety
interface NodeData {
    label: string;
  }
  
  interface FlowNode {
    id: string;
    type: string;
    data: NodeData;
    position: { x: number; y: number };
  }
  
  interface FlowData {
    nodes: FlowNode[];
    edges: any[]; // Adjust this if you have edge types
    viewport: any; // Adjust this as needed
  }
  
  interface FlowRequest extends Request {
    body: {
      flow: FlowData;
      ipAddress: string;
    };
  }


const saveNode = async (req: Request, res: Response): Promise<void> => {
    try {
        const { ipAddress, flow }: { ipAddress: string; flow: FlowData } = req.body;

        console.log(ipAddress);
        const { nodes, edges, viewport } = flow;
        console.log(nodes);

        let data;

        const check = await nodeModel.findOne({ device: ipAddress });
        if (!check) {
            data = await new nodeModel({ device: ipAddress, nodes, edges, viewport }).save();
        } else {
            data = await nodeModel.findByIdAndUpdate(
                { _id: check._id },
                { nodes, edges, viewport },
                { new: true }
            );
        }

        res.status(200).send(data);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};

const getNodes = async (req: Request, res: Response): Promise<void> => {
    try {
        const { ipAddress } = req.params;

        console.log(ipAddress);
        const data = await nodeModel.findOne({ device: ipAddress }).exec();
        console.log(data);

        res.status(200).json(data);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};

const sendMailFunctiom = async (req: Request, res: Response): Promise<void> =>{
    const { flow } = req.body;
    const nodes = flow.nodes;
  
    // Extract the email and message from the flow data
    let email = '';
    let message = '';
  
    nodes.forEach((node:FlowNode) => {
      if (node.type === 'textupdate') {
        email = node.data.label; // Email from the node
      }
      if (node.type === 'textupdateMsg') {
        message = node.data.label; // Message from the node
      }
    });
  
    if (!email || !message) {
      res.status(400).json({ success: false, message: 'Email or message is missing in the flow data' });
    }
  
    sendMail({
        to: email,
        subject: "Automate Mail",
        
  
        message: message
      });
  };

export { saveNode, getNodes,sendMailFunctiom };
