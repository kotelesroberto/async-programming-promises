/*
Async / await examples

We can use AWAIT keyword on functions returns Promises
*/

import setText , {appendText} from './results.mjs';

export async function get(){
    // we are waiting for the result and after use the return data
    const {data} = await axios.get('http://localhost:3000/orders/1');
    setText(JSON.stringify(data));
}

export async function getCatch(){
    // handle error 404 as this error doesn't belong to Promise. Now we use standard JavaScript error handling: try/catch block
    try {
        const {data} = await axios.get('http://localhost:3000/orders/123');
        setText(JSON.stringify(data));    
    } catch (error) {
        setText(error);
    }  
}

export async function chain(){
    /**
     * {data: address} means we destructure data return value and assign to a variable named "address"
     * Calls will be sequential
     */
    const {data} = await axios.get('http://localhost:3000/orders/1');
    const {data: address} = await axios.get(`http://localhost:3000/addresses/${data.shippingAddress}`);

    setText( `City: ${JSON.stringify(address.city)}` );
}


/**
 * Calls sometimes should be non-sequential, not waiting for the end of previous call. This is CONCURENT (non-sequential calls)
 * Functions are NOT AWAITED
 * axios.get is a Promise, status is pending
 */
export async function concurrent(){
    const orderStatus =  axios.get('http://localhost:3000/orderStatuses');
    const orders =  axios.get('http://localhost:3000/orders');

    setText('');

    // we still await for the end of calls at this point
    const {data: statuses} = await orderStatus;
    const {data: order} = await orders;

    // the will run immediately:
    appendText(JSON.stringify(statuses));
    appendText(JSON.stringify(order[0]));
    
}

/**
 * Awaiting paralell calls
 * Sometimes we don't ant to wait for a slow running process but wanna run another paralelly.
 */
export async function parallel(){
    setText('');

    // we can mix-match Promise functions with async/await (As they are top of Promises)
    await Promise.all([
        (async ()=>{
            const {data} = await axios.get('http://localhost:3000/orderStatuses');
            appendText(JSON.stringify(data));
        })(),
        (async ()=>{
            const {data} = await axios.get('http://localhost:3000/orders');
            appendText(JSON.stringify(data));
        })()
    ]);

    // DO what we want after al promises returned...
    
}