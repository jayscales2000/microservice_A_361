# Installation Instructions
- Open Terminal App.
- `cd` to working directory.
- `git clone https://github.com/shahkau1/automatching_microservice.git`
- `cd automatching_microservice`
- Create a `.env` file and add the following 2 lines:
```
automatching_microservice_port_number=3000
mongodb_connection_string=
```
- In the `.env` file, you may change the port number. But, register this change in your testing and usage.
- In the `.env` file, add your MongoDB connection string.
- `npm install`
- `npm start`

# Usage Instructions
- Please see the `test_requests.http` or `test_requests.mjs` file for examples.
- Please look at the comments in the microservice's code itself.
- In general, follow the POST Request and Response examples below.
- POST Request
```
POST http://localhost:3000/automatching_microservice HTTP/1.1
    content-type: application/json
    {
        "_id_str": "INSERT_MONGODB_ID_STRING_HERE", 
        "max_matches_number": INSERT_A_POSITIVE_INTEGER_HERE
    }
```
- POST Response
  - MongoDB Id Strings, in descending order, per compatibility:
```
["mongodbid_string_1", "mongodbid_string_2", "mongodbid_string_3", ...]
```
- Specifically, the `axios` module in NodeJS can be used to query the microservice and process the response.
- After creating the required request object in JS, you can submit it and then receive the response as a variable that you can evaluate or just print on the screen for testing purpose.
- Here is an example, after the `SAMPLE_1_request_obj` has been created:
```
let response = await axios.post(`http://localhost:${automatching_microservice_port_number}/automatching_microservice`, SAMPLE_1_request_obj)).data
```
 
# UML
![automatching_microservice_uml](./automatching_microservice_uml.drawio.svg)

# Rules List created with Team
- Respect everyone's time:
  - Expected to respond within 24 - 48 hrs., any more than that would be considered unresponsive.
  - Be punctual, plan ahead, and commit to scheduled meetings. Show up prepared and stay present in discussions.
- Respect each other's ideas:
  - Encourage open communication and diverse perspectives. Listen actively, and treat all ideas with equal consideration before deciding together on a direction.
- Respectful communication:
  - We have already settled on Microsoft Teams for communication, planning, and scheduling meetings.
  - Speak kindly and professionally. Avoid yelling, typing in all caps, name calling, or personal attacks. Keep the focus on the task not on politics or unrelated topics.
- Be transparent and honest:
  - Share updates, challenges, and concerns openly. If you're stuck or falling behind, let the team know as early as possible.
  - If after 48hrs, there is no clear update on progress, then it should be safe to say that a backup plan for a microservice should be put into effect.
- Take ownership of decisions:
  - We should assign clear action items to owners and set proper expectations and timelines with periodic updates a min the day before due dates.