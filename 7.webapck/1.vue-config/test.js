// // 尾递归优化
// function recursion (num, sum = 0) {
//     if (num === 0) return sum;
//     return recursion(num - 1, sum + num);
// }

// recursion(100000); // => Uncaught RangeError: Maximum call stack size exceeded