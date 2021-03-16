import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../state';

export const useActions = () => {
    //this is common code that we need to add to redux for getting
    //data from state so we add it as a hook for everywhere.
    const dispatch = useDispatch();

    //react reruns the function one single time
    //or whenever dispatch changes - like useState and useEffect
    return useMemo(() => {
        return bindActionCreators(actionCreators, dispatch);
    }, [dispatch]);
};