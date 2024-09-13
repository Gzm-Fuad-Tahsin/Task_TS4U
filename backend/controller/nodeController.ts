import { Request, Response } from 'express';
import nodeModel from '../model/nodeModel'; // Make sure your model file has TypeScript definitions

interface Flow {
    nodes: any; // Replace 'any' with the correct type for nodes
    edges: any; // Replace 'any' with the correct type for edges
    viewport: any; // Replace 'any' with the correct type for viewport
}

const saveNode = async (req: Request, res: Response): Promise<void> => {
    try {
        const { ipAddress, flow }: { ipAddress: string; flow: Flow } = req.body;

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

export { saveNode, getNodes };
