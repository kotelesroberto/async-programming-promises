/**
 * Creating PROMISES
 */

import setText, { appendText } from "./results.mjs";


// for this part run in terminal: npm run dev
export function timeout(){
    // Promise has EXECUTOR FUNCTION that is the only parameter of it
    const wait = new Promise( (resolve, reject) => {
        setTimeout(() => {
            resolve('Timeout!');
        }, 1500);
    });

    wait.then( text => setText(text));
}

export function interval(){
    // even if setInterval runs function more times the promise will be end after the FIRST resolve. In console we see message repeateadly but not on the screen.
    let counter = 0;
    const wait = new Promise( (resolve, reject) => {
        setInterval(() => {
            console.log('INTERVALL');
            resolve(`Timeout! ${++counter}`);
        }, 1500);
    });

    wait
        .then( text => setText(text))
        .finally( () => appendText(` --- Done ${counter}`) )
}

export function clearIntervalChain(){
    let counter = 0;
    let interval;


    // when promise ends we kill interval, won't be run anymore. Message stops in console and screen to.
    const wait = new Promise( (resolve, reject) => {
        interval = setInterval(() => {
            console.log('INTERVALL');
            resolve(`Timeout! ${++counter}`);
        }, 1500);
    });

    wait
        .then( text => setText(text))
        .finally( () => clearInterval(interval) )
}

export function xhr(){
    let request = new Promise( (resolve, reject) => {

        // not exist entry but xhr GET call will be success as server will be reached by the call. That's why we have n onerror (when call is rejected) and xhr.status check (if call is ok but no data)
        let xhr = new XMLHttpRequest();
        
        xhr.open("GET", "http://localhost:3000/users/7");
        xhr.onload = () => {
            if( xhr.status === 200) {
                resolve(xhr.responseText)
            } else {
                reject(xhr.statusText)
            }
        };
        xhr.onerror = () => reject('Request failed');
        xhr.send();
    });

    request
        .then( (result) => setText(result))
        .catch( (reason) => setText(reason));
}

export function allPromises(){
    // in this function we are waiting for all promises are done (if they are success). But if one of them is failing (even earlier than others) the Promise.all will catch error and stops running.
    let categories = axios.get('http://localhost:3000/itemCategories');
    let statuses = axios.get('http://localhost:3000/orderStatuses');
    let userTypes = axios.get('http://localhost:3000/userTypes');
    let addressTypes = axios.get('http://localhost:3000/addressTypes');

    // check if all promises were done, parameter of "then" will be an array of results
    // FYI: Prommise.all ends either ALL fulfill or ONE rejects
    Promise.all([categories, statuses, userTypes, addressTypes])
        .then( ([cat, stat, type, address]) => {
            setText('');

            appendText(JSON.stringify(cat.data));
            appendText(JSON.stringify(stat.data));
            appendText(JSON.stringify(type.data));
            appendText(JSON.stringify(address.data));
        })
        .catch( response => setText(response));
}

export function allSettled(){
    /* if we don't mind seeing one or few promises failing but wanna use the results of success promies
    returned data of Promise.allSettled looks different from Promise.all
        { status: "fulfilled", value: {} }
        { status: "rejected", reason: {} }

        allSettled is not supported by all browsers
    */

    // in this function we are waiting for all 3 promises are done
    let categories = axios.get('http://localhost:3000/itemCategories');
    let statuses = axios.get('http://localhost:3000/orderStatuses');
    let userTypes = axios.get('http://localhost:3000/userTypes');
    let addressTypes = axios.get('http://localhost:3000/addressTypes');

    // now even if any of them will FAIL, 'then' waits for ALL end
    Promise.allSettled([categories, statuses, userTypes, addressTypes])
        .then( (values) => {
            let results = values.map( v => {
                if(v.status === "fulfilled") {
                    return `FULFILLED: ${JSON.stringify(v.value.data[0])} | `
                }
                return `REJECTED: ${v.reason.message} | `
            });

            setText(results);
        })
        .catch( response => setText(response));

        // FYI: Prommise.all ends either ALL fulfill or ONE rejects
}


// for this part run in NEW terminal: npm run secondary
export function race(){
    /*
    using the closest endpoint: choosing the fastest endpoint serving the same data, rest of them will be ignored
    Promise.race stops when first promise settles. If it's a rejection we need to use catch function.
    race is a rare function
    */

    let users = axios.get("http://localhost:3000/users");
    let backup = axios.get("http://localhost:3001/users");

    Promise.race([users,backup])
        .then( users => setText(JSON.stringify(users.data)))
        .catch(reason => setText(reason));
}