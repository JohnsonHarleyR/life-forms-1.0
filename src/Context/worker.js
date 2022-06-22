// // onmessage = (e) => {
// //     console.log(e.data);
// // }

// const workercode = () => {
//     self.onmessage = function(e) {
//         console.log('message received from script.');
//         let result = `Message: ${e.data}`;
//         self.postMessage(result);
//     }
    
// }

// let code = workercode.toString();
// code = code.substring(code.indexOf("{")+1, code.lastIndexOf("}"));

// const blob = new Blob([code], {type: "application/javascript"});
// const worker_script = URL.createObjectURL(blob);

// export default worker_script;

// // self.addEventListener(
// //     "message",
// //     function(e) {
// //         self.postMessage(e.data);
// //     },
// //     false
// // )