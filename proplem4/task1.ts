
function sum_to_n_a(n: number): number {
    // your code here
    let sum = 0
    for (let i = 1; i < n + 1; i++) {
        sum += i
    }
    return sum
}
console.log(sum_to_n_a(5))

function sum_to_n_b(n: number): number {
    let sum = 0;
    let i = 1;
    while (i <= n) {
        sum += i;
        i++;
    }
    return sum;
}
console.log(sum_to_n_b(5));


function sum_to_n_c(n: number): number {
    return (n * (n + 1)) / 2;

}
console.log(sum_to_n_c(5));

