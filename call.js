const isOpen = true
let placeOrder = (time, work) =>{
    return new Promise((resolve, reject)=>{
        if(isOpen){
            setTimeout(()=>{
                resolve(work)
            },time) 
        }else{
            reject(console.log("The shop is closed"))
        }
    })
}

placeOrder(3000,)