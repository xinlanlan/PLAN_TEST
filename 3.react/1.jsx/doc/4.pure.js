/**
 * 纯函数组件
 * 1. 不改变入参
 * 2. 相同的参数返回的结果一定相同
 * 3. 不能修改作用变量之外的值
 * 下面分别对应1、2、3的反面例子
 */

// 改变了入参
function sum(a, b) {
  a = a - 10
  return a + b
}

// 相同的参数返回了不同的结果
function add (a, b) {
  return a + b + Math.random()
}

// 修改了作用域之外的变量值
let a = 100
function reduce(b) {
  a -= 10
  return b
}