import { combineReducers } from 'redux';
import cellsReducer from './cellsReducer';
import bundlesReducer from './bundlesReducer';

const reducers = combineReducers({
    cells: cellsReducer,
    bundles: bundlesReducer
});

export default reducers;

//define new type for TS
export type RootState = ReturnType<typeof reducers>;