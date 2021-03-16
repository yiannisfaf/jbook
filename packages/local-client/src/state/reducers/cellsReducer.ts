import produce from 'immer';
import { stringLiteral } from 'jscodeshift';
import { ActionType } from '../action-types';
import { Action } from '../actions';
import { Cell } from '../cell';

interface CellsState {
    loading: boolean;
    error: string | null;
    order: string[];
    data: {
        [key: string]: Cell
    };
}

const initialState: CellsState = {
    loading: false,
    error: null,
    order: [],
    data: {},
}

//use immer with produce function below
const reducer = produce((state: CellsState = initialState, action: Action) => {
    switch (action.type) {
        case ActionType.SAVE_CELLS_ERROR:
            state.error = action.payload;
            
            return state;
        case ActionType.FETCH_CELLS:
            state.loading = true;
            state.error = null;

            return state;
        case ActionType.FETCH_CELLS_COMPLETE:
            state.order = action.payload.map(cell => cell.id);
            state.data = action.payload.reduce((acc, cell) => {
                acc[cell.id] = cell;
                return acc;
            }, {} as CellsState['data']);
            
            return state;
        case ActionType.FETCH_CELLS_ERROR:
            state.loading = true;
            state.error = action.payload;

            return state;
        //look at cells state object and find cell with same id as one called with in updateCell
        //replace this cell with new content specified in updateCell().
        case ActionType.UPDATE_CELL:
            const { id, content } = action.payload;

            state.data[id].content = content;
            return state;
        case ActionType.DELETE_CELL:
            delete state.data[action.payload];
            //create a new order array where id is not equal to id in deleteCell().
            state.order = state.order.filter(id => id != action.payload);

            return state;
        case ActionType.MOVE_CELL:
            //Like adding into a LinkedList.
            const { direction } = action.payload;
            const index = state.order.findIndex((id) => id === action.payload.id);
            const targetIndex = direction === 'up' ? index - 1 : index + 1;

            //check move is not invalid
            if (targetIndex < 0 || targetIndex > state.order.length - 1) {
                return state;
            }

            state.order[index] = state.order[targetIndex];
            state.order[targetIndex] = action.payload.id;

            return state;
        case ActionType.INSERT_CELL_AFTER:
            //if string then add cell before, if null then add cell to end of list
            const cell: Cell = {
                content: '',
                type: action.payload.type,
                id: randomId()
            };

            //create new cell at new random id
            state.data[cell.id] = cell;

            const foundIndex = state.order.findIndex((id) => id === action.payload.id);

            if (foundIndex < 0) {
                //if cannot find index, add cell to start of list.
                state.order.unshift(cell.id);
            } else {
                state.order.splice(foundIndex + 1, 0, cell.id);
            }
            
            return state;
        default:
            return state;
    }
});

//random id generation function
const randomId = () => {
    return Math.random().toString(36).substr(2, 5);
};

export default reducer; 