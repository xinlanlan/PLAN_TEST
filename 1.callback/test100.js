var arr = [1,2,10, 5, 8]

function max(arr) {
    for(let i = 0; i < arr.length; i++) {
        if(i === 1 && arr[i] > arr[0]) {
            arr.unshift(arr[i])
            arr.splice(i+1, i)
        } else if(arr[i] < arr[0] && arr[i] > arr[1]) {
            //arr[1] = arr[i]
            [arr[1], arr[i]] = [arr[i], arr[1]]
            // arr.splice(i, 1)
            // i--
        } else if(arr[i] > arr[0] && arr[i] > arr[1]) {
            arr.unshift(arr[i])
            arr.splice(i + 1, 1)
        }
    }
    console.log(arr)
    return arr[1]
}

console.log(max(arr))