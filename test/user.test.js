const { expect } = require("chai");
const axios = require("axios");
const jsonData = require("../env.json");
const fs = require("fs");
const { faker } = require("@faker-js/faker");
var rand = require("../generateRandom");
const userData = require("../users.json");

describe("User Can do Login", () => {

    it("user can login successfully", async() => {
        var response = await axios
            .post(
                `${jsonData.baseUrl}/user/login`, {
                    email: "salman@roadtocareer.net",
                    password: "1234",
                }, {
                    "Content-Type": "application/json",
                }
            )
            .then((res) => res.data);
        console.log(response);
        expect(response.message).contain("Login successfully");
        let token_vlue = response.token;

        jsonData.token = token_vlue;
        fs.writeFileSync("env.json", JSON.stringify(jsonData));
    });

    var Customer_name = faker.person.fullName();
    var Customer_email = faker.internet.email().toLowerCase();
    var Customer_phone_number = "015100" + rand(10000, 99999);
    it("Addmin can create Customer", async() => {
        var response = await axios
            .post(
                `${jsonData.baseUrl}/user/create`, {
                    name: Customer_name,
                    email: Customer_email,
                    password: "1234",
                    phone_number: Customer_phone_number,
                    nid: "0123456789",
                    role: "Customer",
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: jsonData.token,
                        "X-AUTH-SECRET-KEY": jsonData.secretKey,
                    },
                }
            )
            .then((res) => res.data);
        console.log(response);

        var id = response.user.id;
        var name = response.user.name;
        var email = response.user.email;
        var phone_number = response.user.phone_number;
        var role = response.user.role;

        var newCustomer = {
            id: id,
            name: name,
            email: email,
            Customer_Phone_number: phone_number,
            role: role,
        };
        userData.push(newCustomer);
        fs.writeFileSync("users.json", JSON.stringify(userData));
        expect(response.message).contain("User created");
        console.log("Saved!");
    });

    var Agent_name = faker.person.fullName();
    var Agent_email = faker.internet.email().toLowerCase();
    var Agent_phone_number = "015100" + rand(10000, 99999);
    it("Addmin can create Agent", async() => {
        var response = await axios
            .post(
                `${jsonData.baseUrl}/user/create`, {
                    name: Agent_name,
                    email: Agent_email,
                    password: "1234",
                    phone_number: Agent_phone_number,
                    nid: "0123456789",
                    role: "Agent",
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: jsonData.token,
                        "X-AUTH-SECRET-KEY": jsonData.secretKey,
                    },
                }
            )
            .then((res) => res.data);
        console.log(response);

        var id = response.user.id;
        var name = response.user.name;
        var email = response.user.email;
        var phone_number = response.user.phone_number;
        var role = response.user.role;

        var newAgent = {
            id: id,
            name: name,
            email: email,
            agent_Phone_number: phone_number,
            role: role,
        };
        userData.push(newAgent);
        fs.writeFileSync("users.json", JSON.stringify(userData));
        expect(response.message).contain("User created");
        console.log("Saved!");
    });


    it("Admin can search user by Phone Numbe", async() => {
        var userPhone = userData[userData.length - 2].Customer_Phone_number;
        var response = await axios
            .get(`${jsonData.baseUrl}/user/search/phonenumber/${userPhone}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: jsonData.token,
                    "X-AUTH-SECRET-KEY": jsonData.secretKey,
                },
            })
            .then((res) => res.data);
        console.log(response);
        expect(response.message).contains("User found");
    });
});