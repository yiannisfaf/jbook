import { useSelector, TypedUseSelectorHook } from 'react-redux';
import { RootState } from '../state';


//understands type of data stored in the store.
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;