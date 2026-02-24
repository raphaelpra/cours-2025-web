console.log("Hello -> on commence")

console.log("A. Le type de fetch:", 'Promise')

// fetch("https://perdu.com").then(response => {
//     console.log("B. L'appel est termine");
    
//     console.log("C. le status de l'appelle:", response.status)

//     response.text().then(text => {
//         console.log("D. le body est:", text)
//     })

//     console.log("E. Le callback de l'appel est termine")
// }).then(() => console.log("F. Et la c'est la finit"))

// console.log("G. Hello -> on finit ?")
fetch("https://perdu.com")
    .then(response => response.text())
    .then(text => console.log("text: ", text))

// console.log("G. Hello -> on finit ?")

// Promise.resolve(10).then(val => {
//     console.log(val)
//     return val * 2
// }).then(val2 => {
//     console.log(val2)
//     return Promise.resolve(val2 ** 2)
// }).then(val3 => console.log(val3))