import Router from 'express';
import { getWorkspacesController, workspaceController } from './workspace.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';


const workspaceRouter = Router();

workspaceRouter.post('/', authenticate, workspaceController);
workspaceRouter.get('/', authenticate, getWorkspacesController);


export default workspaceRouter;