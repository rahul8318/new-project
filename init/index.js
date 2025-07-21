const mongoose = require("mongoose")
const initData = require("./data.js")
const Listing = require("../models/listing.js")
main().then((res)=>{
  console.log("connection complete")
})
.catch((err)=>{
  console.log(err);
})
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');
}
const initDB =async ()=>{
  await Listing.deleteMany({});
 initData.data=initData.data.map((obj)=>({...obj,owner:'67abc8c1fbde1e64cd767bfa'}));
  await Listing.insertMany(initData.data);
  console.log("data was initilized");
}

initDB();