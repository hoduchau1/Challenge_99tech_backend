function sum_to_n_a(n) {
    // your code here
    var sum = 0;
    for (var i = 1; i < n + 1; i++) {
        sum += i;
    }
    return sum;
}
console.log(sum_to_n_a(5));
function sum_to_n_b(n) {
    var sum = 0;
    var i = 1;
    while (i <= n) {
        sum += i;
        i++;
    }
    return sum;
}
console.log(sum_to_n_b(5));
function sum_to_n_c(n) {
    return (n * (n + 1)) / 2;
}
console.log(sum_to_n_c(5));
