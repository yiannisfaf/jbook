import express from 'express';
import {promises as fs} from 'fs';
import path from 'path';

interface Cell {
    id: string;
    content: string;
    type: 'text' | 'code'
}

export const createCellsRouter = (filename: string, dir: string) => {
    const router = express.Router();
    router.use(express.json());
    
    const fullPath = path.join(dir, filename);

    router.get('/cells', async (req, res) => {
        try {
            const result = await fs.readFile(fullPath, { encoding: 'utf-8' });

            res.send(JSON.parse(result));
        } catch (err) { 
            if (err.code === 'ENONET') {
                await fs.writeFile(fullPath, '[]', 'utf-8');
                res.send([]);
            } else {
                throw err;
            }
        }
    });

    router.post('/cells', async (req, res) => {
        //Take list of cells from req object
        //serialize them
        const { cells }: { cells: Cell[] } = req.body;
        
        //Write cells into file#
        await fs.writeFile(fullPath, JSON.stringify(cells), 'utf-8');

        res.send({ status: 'ok' });
    });

    return router;
};