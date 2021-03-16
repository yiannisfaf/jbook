import { useTypedSelector } from './use-typed-selector';

export const useCumulativeCode = (cellId: string) => {
    return useTypedSelector((state) => {
        const { data, order } = state.cells;

        //Here we get the cell by mapping each id and accessing each
        //element of the data array.
        const orderedCells = order.map((id) => data[id]);

        const showFunc =
        `
            import _React from 'react';
            import _ReactDOM from 'react-dom';

            var show = (value) => {
                const root = document.querySelector('#root');

                if (typeof value === 'object') {
                    if (value.$$typeof && value.props) {
                        _ReactDOM.render(value, root);
                    } else {
                        root.innerHTML = JSON.stringify(value);
                    }
                } else {
                    root.innerHTML = value;
                }
            };
        `;
        const showFuncNoop = 'var show = () => {}';
        const cumulativeCode = [];
        for (let c of orderedCells) {
            if (c.type === 'code') {
                if (c.id === cellId) {
                    cumulativeCode.push(showFunc);
                } else {
                    cumulativeCode.push(showFuncNoop);
                }
                cumulativeCode.push(c.content);
            }
            if (c.id === cellId) {
                //we just want code from previous cells not this cell too.
                break;
            }
        }

        return cumulativeCode;
    }).join('\n');
};