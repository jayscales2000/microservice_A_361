import 'dotenv/config';
import express from 'express';
import asyncHandler from 'express-async-handler';
import axios from 'axios';

const app = express();
app.use(express.json())
const automatching_microservice_port_number = process.env.automatching_microservice_port_number;

let SAMPLE_1__id_str = "682c63ea707528748629efb6";
let SAMPLE_2__id_str = "682c63ea707528748629efc8";
let SAMPLE_3__id_str = "682c63ea707528748629efe6";

let SAMPLE_1_request_obj =
{
    _id_str: SAMPLE_1__id_str, 
    max_matches_number: 10
}

let SAMPLE_2_request_obj =
{
    _id_str: SAMPLE_2__id_str, 
    max_matches_number: 12
}

let SAMPLE_3_request_obj =
{
    _id_str: SAMPLE_3__id_str, 
    max_matches_number: 4
}

console.log(`SAMPLE_1_request_obj: ${JSON.stringify(SAMPLE_1_request_obj)}`);
console.log((await axios.post(`http://localhost:${automatching_microservice_port_number}/automatching_microservice`, SAMPLE_1_request_obj)).data);

console.log(`SAMPLE_2_request_obj: ${JSON.stringify(SAMPLE_2_request_obj)}`);
console.log((await axios.post(`http://localhost:${automatching_microservice_port_number}/automatching_microservice`, SAMPLE_2_request_obj)).data);

console.log(`SAMPLE_3_request_obj: ${JSON.stringify(SAMPLE_3_request_obj)}`);
console.log((await axios.post(`http://localhost:${automatching_microservice_port_number}/automatching_microservice`, SAMPLE_3_request_obj)).data);


// SAMPLE Request 1
// {
//   "_id": {
//     "$oid": "682c63ea707528748629efb6"
//   },
//   "gender": "male",
//   "age": {
//     "$numberInt": "42"
//   },
//   "location": "dc",
//   "education": "high school",
//   "smoking": "none",
//   "drinking": "none",
//   "sexual_orientation": "bisexual",
//   "political_views": "moderate",
//   "__v": {
//     "$numberInt": "0"
//   }
// }


// SAMPLE Request 2
// {
//   "_id": {
//     "$oid": "682c63ea707528748629efc8"
//   },
//   "gender": "female",
//   "age": {
//     "$numberInt": "35"
//   },
//   "location": "sea",
//   "education": "high school",
//   "smoking": "moderate",
//   "drinking": "low",
//   "sexual_orientation": "straight",
//   "political_views": "moderate",
//   "__v": {
//     "$numberInt": "0"
//   }
// }


// SAMPLE Request 3
// {
//   "_id": {
//     "$oid": "682c63ea707528748629efe6"
//   },
//   "gender": "male",
//   "age": {
//     "$numberInt": "63"
//   },
//   "location": "dc",
//   "education": "masters",
//   "smoking": "none",
//   "drinking": "none",
//   "sexual_orientation": "bisexual",
//   "political_views": "moderate",
//   "__v": {
//     "$numberInt": "0"
//   }
// }

