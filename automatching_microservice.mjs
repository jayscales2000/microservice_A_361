import 'dotenv/config';
import express from 'express';
import asyncHandler from 'express-async-handler';
import mongoose, { mongo } from 'mongoose';

let mongodb_connection = undefined;

async function connect_to_mongodb() {
    try{
        await mongoose.connect(process.env.mongodb_connection_string);
        mongodb_connection = mongoose.connection;
        console.log("SUCCESS: Connected to MongoDB using Mongoose.");
        // console.log(await mongodb_connection.db.listCollections().toArray()); // to see the existing collections in the database
        // await mongodb_connection.db.dropCollection('profiles'); // WARNING: to delete the entire 'collection_name' collection
    } catch(err){
        console.log(err);
        throw Error(`FAILURE: Could not connect to MongoDB: ${err.message}.`)
    }
}

const app = express();
app.use(express.json());
app.listen(process.env.automatching_microservice_port_number, async () => {
	await connect_to_mongodb();
	// await other_module.connect();
	// await other_module.connect(false);
    console.log(`automatching_microservice listening on port number: ${process.env.automatching_microservice_port_number}.`);
});

// MongoDB: databases -> collections -> (schema) documents -> fields
const profile_schema = mongoose.Schema({                    // _id will be automatically created
	gender: { type: String, required: true },               // male, female, non-binary, other
    age: { type: Number, required: true },                  // a natural number
    location: { type: String, required: true },             // metropolitan area (ny, sf, la, etc.)
    education: { type: String, required: true },            // high school, bachelors, masters, doctorate
    smoking: { type: String, required: true },              // none, low, moderate, high
    drinking: { type: String, required: true },             // none, low, moderate, high
    sexual_orientation: { type: String, required: true },   // gay, straight, bisexual
    political_views: { type: String, required: true },      // liberal, moderate, conservative
}, {collection: 'profiles'});

const Profile = mongoose.model("Profile", profile_schema);

let invalid_request_response_obj = {
    Error: "Invalid Request.",
    Description: ""
};

const create_a_profile = async(gender, age, location, education, smoking, drinking, sexual_orientation, political_views) => {
    let new_profile = new Profile({ gender: gender, // male, female, non-binary, other
                                    age: age, // a natural number
                                    location: location, // metropolitan area (ny, sf, la, etc.)
                                    education: education, // high school, bachelors, masters, doctorate
                                    smoking: smoking, // none, low, moderate, high
                                    drinking: drinking, // none, low, moderate, high
                                    sexual_orientation: sexual_orientation, // gay, straight, bisexual
                                    political_views: political_views // liberal, moderate, conservative
                                }); 
    return new_profile.save();
}

const randomly_return_an_element_from_an_array_fxn = (array) => {
    return array[Math.floor(Math.random() * array.length)];
}

const lower_end_age_number = 21;
const upper_end_age_number = 70;
const preferred_age_difference_number = 8;
const age_range_number_array_generator_fxn = (lower_end_age_number, upper_end_age_number) => {
    return Array.from({ length: ((upper_end_age_number - lower_end_age_number) + 1) }, (_, i) => lower_end_age_number + i);
}
const random_profile_age_generator_number_fxn = (lower_end_age_number, upper_end_age_number) => {
    return Math.floor(Math.random() * (upper_end_age_number - lower_end_age_number + 1)) + lower_end_age_number;
}

const profile_field_options_obj = {
    gender: ["male", "female", "non-binary", "other"],
    age: age_range_number_array_generator_fxn(lower_end_age_number, upper_end_age_number),
    location: ["ny", "sf", "la", "chi", "dal", "hou", "bos", "phx", "san", "sea", "dc"],
    education: ["high school", "bachelors", "masters", "doctorate"],
    smoking: ["none", "low", "moderate", "high"],
    drinking: ["none", "low", "moderate", "high"],
    sexual_orientation: ["gay", "straight", "bisexual"],
    political_views: ["liberal", "moderate", "conservative"]
}

const one_random_profile_generator_and_adder_fxn = async() => {
    create_a_profile(
        randomly_return_an_element_from_an_array_fxn(profile_field_options_obj.gender),
        randomly_return_an_element_from_an_array_fxn(profile_field_options_obj.age),
        randomly_return_an_element_from_an_array_fxn(profile_field_options_obj.location),
        randomly_return_an_element_from_an_array_fxn(profile_field_options_obj.education),
        randomly_return_an_element_from_an_array_fxn(profile_field_options_obj.smoking),
        randomly_return_an_element_from_an_array_fxn(profile_field_options_obj.drinking),
        randomly_return_an_element_from_an_array_fxn(profile_field_options_obj.sexual_orientation),
        randomly_return_an_element_from_an_array_fxn(profile_field_options_obj.political_views)
    );
}

const filter_search = async(filter) => {
    const query = Profile.find(filter);
    return query.exec();
}

const find_matching_user_thru_id = async(id) => {
    let query = Profile.findOne({"_id": id});
    return query.exec(); // returns null or the document
}

const update_by_id = async(id, update_obj) => {
    Profile.updateOne({_id: id}, update_obj);
}

const delete_by_id_fxn = async(id) => {
    return Profile.deleteOne({ _id: id });
}

const baseline_compatibility_score_number = 0;
const compatibility_failure_score_number = -1;
const compatibility_score_calculator_number_fxn = (searching_user_profile_obj, candidate_user_profile_obj) => {
    let compatibility_score_number = 0;
    let compatibility_failure_score_number = -1;

    // orientation and gender compatibility exclusion
    if (searching_user_profile_obj.sexual_orientation === 'straight') {
        if (searching_user_profile_obj.gender === 'male') {
            if (((candidate_user_profile_obj.gender === 'female') && (candidate_user_profile_obj.sexual_orientation === 'gay')) ||
                (candidate_user_profile_obj.gender === 'male')
            ) {
                return compatibility_failure_score_number;
            }
        } else if (searching_user_profile_obj.gender === 'female') {
            if (((candidate_user_profile_obj.gender === 'male') && (candidate_user_profile_obj.sexual_orientation === 'gay')) ||
                (candidate_user_profile_obj.gender === 'female')
            ) {
                return compatibility_failure_score_number;
            }
        }
    } else if (searching_user_profile_obj.sexual_orientation === 'gay') {
        if (searching_user_profile_obj.gender === 'male') {
            if (((candidate_user_profile_obj.gender === 'male') && (candidate_user_profile_obj.sexual_orientation === 'straight')) ||
                (candidate_user_profile_obj.gender === 'female')
            ) {
                return compatibility_failure_score_number;
            }
        } else if (searching_user_profile_obj.gender === 'female') {
            if (((candidate_user_profile_obj.gender === 'female') && (candidate_user_profile_obj.sexual_orientation === 'straight')) ||
                (candidate_user_profile_obj.gender === 'male')
            ) {
                return compatibility_failure_score_number;
            }
        }
    } else { // bisexual
        if (searching_user_profile_obj.gender === 'male') {
            if (((candidate_user_profile_obj.gender === 'female') && (candidate_user_profile_obj.sexual_orientation === 'gay')) ||
                ((candidate_user_profile_obj.gender === 'male') && (candidate_user_profile_obj.sexual_orientation === 'straight'))
            ) {
                return compatibility_failure_score_number;
            }
        } else if (searching_user_profile_obj.gender === 'female') {
            if (((candidate_user_profile_obj.gender === 'male') && (candidate_user_profile_obj.sexual_orientation === 'gay')) ||
                ((candidate_user_profile_obj.gender === 'female') && (candidate_user_profile_obj.sexual_orientation === 'straight'))
            ) {
                return compatibility_failure_score_number;
            }
        }
    }

    // age compatibility exclusion
    if (Math.abs(searching_user_profile_obj.age - candidate_user_profile_obj.age) > preferred_age_difference_number) {
        return compatibility_failure_score_number
    }

    // location compatibility points
    if (searching_user_profile_obj.location === candidate_user_profile_obj.location) {
        compatibility_score_number += 1;
    }

    // education compatibility points
    if (searching_user_profile_obj.education === candidate_user_profile_obj.education) {
        compatibility_score_number += 1;
    }

    // smoking compatibility points
    if (searching_user_profile_obj.smoking === candidate_user_profile_obj.smoking) {
        compatibility_score_number += 1;
    }

    // drinking compatibility points
    if (searching_user_profile_obj.drinking === candidate_user_profile_obj.drinking) {
        compatibility_score_number += 1;
    }
    // political views compatibility points
    if (searching_user_profile_obj.political_views === candidate_user_profile_obj.political_views) {
        compatibility_score_number += 1;
    }

    return compatibility_score_number;
}

// returns matches as a JSON array of object id strings: ["682c63ea707528748629efb6", "682c63ea707528748629efe6", ...]
// expects: {_id_str: "mongodb_id_string", max_matches_number: NNNN}
app.post('/automatching_microservice', asyncHandler(async(request, response) => {
    let matches__id_str_array = [];
    let searching_user_id_str = request.body._id_str;
    let max_matches_number = request.body.max_matches_number;

    let searching_user_profile_obj = (await find_matching_user_thru_id(request.body._id_str));
    if (searching_user_profile_obj === null) {
        invalid_request_response_obj.Description = "The User ID does not exist in the database.";
        return response.status(400).json(invalid_request_response_obj);
    }

    let candidates_user_profile_obj_array = await filter_search({ _id: { $ne: searching_user_id_str } });
    if (candidates_user_profile_obj_array.length === 0) {
        invalid_request_response_obj.Description = "There are no other profiles in the database.";
        return response.status(400).json(invalid_request_response_obj);
    }

    // TODO: slow, needs to be optimized for real-world use cases; consider using the aggregation functions provided by MongoDB
    matches__id_str_array = 
        candidates_user_profile_obj_array
        .map(each_candidate_user_profile_obj => ({
            _id_str: each_candidate_user_profile_obj._id.toString(),
            compatibility_score: compatibility_score_calculator_number_fxn(searching_user_profile_obj, each_candidate_user_profile_obj)
        }))
        .filter(each__id_str_and_compatibility_score_obj => each__id_str_and_compatibility_score_obj.compatibility_score >= 0) // remove negative scores (completely incompatible) 
        .sort((A__id_str_and_compatibility_score_obj, B__id_str_and_compatibility_score_obj) => B__id_str_and_compatibility_score_obj.compatibility_score - A__id_str_and_compatibility_score_obj.compatibility_score) // descending score
        .slice(0, max_matches_number) // top N matches
        .map(each__id_str_and_compatibility_score_obj => each__id_str_and_compatibility_score_obj._id_str)

    response.status(201).json(matches__id_str_array);
}));

// to test search for single user id
// let found__id_obj = await (find_matching_user_thru_id("682c63ea707528748629efb6"));
// console.log(found__id_obj); // to see the document that has been found, use .toString() to convert the ObjectId to a string

// to view all profiles (warning: huge dataset!):
// console.log(await filter_search({})); // to see the existing documents in the collection

// to generate random profiles and add them to the collection
// for (let i = 0; i < 10000; i++) one_random_profile_generator_and_adder_fxn(); // to add random profiles to the collection