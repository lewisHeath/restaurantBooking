let date = new Date();
console.log(date);
console.log(date.getDate());
let sqlite_date = date.toISOString();
console.log(sqlite_date);
//get day and hour from sqlite_date
let day = sqlite_date.substring(0, 10);
let hour = sqlite_date.substring(11, 13);
console.log(day);
console.log(hour);