import { Dispatch } from 'redux';
import axios from 'axios';
import { ActionType } from '../action-types';
import {
    Action,
    UpdateCellAction,
    MoveCellAction,
    InsertCellAfterAction,
    DeleteCellAction,
    Direction,
} from '../actions';
import { Cell, CellTypes } from '../cell';
import bundle from '../../bundler';
import { RootState } from '../reducers';

export const updateCell = (id: string, content: string): UpdateCellAction => {
    return {
        type: ActionType.UPDATE_CELL,
        payload: {
            id,
            content
        }
    };
};

export const deleteCell = (id: string): DeleteCellAction => {
    return {
        type: ActionType.DELETE_CELL,
        payload: id
    };
};

export const moveCell = (id: string, direction: Direction): MoveCellAction => {
    return {
        type: ActionType.MOVE_CELL,
        payload: {
            id,
            direction
        }
    };
};

export const insertCellAfter = (id: string | null, cellType: CellTypes): InsertCellAfterAction => {
    return {
        type: ActionType.INSERT_CELL_AFTER,
        payload: {
            id,
            type: cellType
        }
    };
};

export const createBundle = (cellId: string, input: string) => {
    //point of this is to ensure that dispatch is called with a valid
    //action - including type and payload. Again a TS requirement.
    return async (dispatch: Dispatch<Action>) => {
        dispatch({
            type: ActionType.BUNDLE_START,
            payload: {
                cellId: cellId
            }
        });

        const result = await bundle(input);

        dispatch({
            type: ActionType.BUNDLE_COMPLETE,
            payload: {
                cellId,
                bundle: {
                    code: result.code,
                    err: result.err
                }
            }
        });
    };
};

export const fetchCells = () => {
    // makes sure we can only call Dispatch with a properly typed action
    return async (dispatch: Dispatch<Action>) => {
        dispatch({ type: ActionType.FETCH_CELLS });
        
        try {
            const { data }: { data: Cell[] } = await axios.get('/cells');
            
            dispatch({ type: ActionType.FETCH_CELLS_COMPLETE, payload: data });
        } catch (err) {
            dispatch({ type: ActionType.FETCH_CELLS_ERROR, payload: err.message })
        }
    };
};

export const saveCells = () => {
    //getState gets the current state from the redux store
    return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
        const { cells: { data, order} } = getState();

        const cells = order.map(id => data[id]);

        try {
            await axios.post('/cells', { cells: cells });
        } catch(err) {
            dispatch({
                type: ActionType.SAVE_CELLS_ERROR,
                payload: err.message,
            });
        }
    };
};

