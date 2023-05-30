const axios = require("axios");
const jsonData = require("../env.json");
const fs = require("fs");
const { expect } = require("chai");
const userData = require("../users.json");

describe("User can do transaction", () => {

    it("Deposit 5000 tk to the Agent from system", async() => {
        var agentAccount = userData[userData.length - 1].agent_Phone_number;
        var response = await axios
            .post(
                `${jsonData.baseUrl}/transaction/deposit`, {
                    from_account: "SYSTEM",
                    to_account: agentAccount,
                    amount: 5000,
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
        expect(response.message).contains("successful");

        var trnx = response.trnxId;

        var transaction = {
            trnxId: trnx,
        };
        userData.push(transaction);
        fs.writeFileSync("users.json", JSON.stringify(userData));
        console.log("Saved!");
    });


    it("Deposit 2000 tk by agent to customer", async() => {
        var agentAccount = userData[userData.length - 2].agent_Phone_number;
        var customerAccount =
            userData[userData.length - 3].Customer_Phone_number;

        var response = await axios
            .post(
                `${jsonData.baseUrl}/transaction/deposit`, {
                    from_account: agentAccount,
                    to_account: customerAccount,

                    amount: 2000,
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
        expect(response.message).contains("successful");

        var trnx = response.trnxId;

        var transaction = {
            trnxId: trnx,
        };
        userData.push(transaction);
        fs.writeFileSync("users.json", JSON.stringify(userData));
        console.log("Saved!");
    });

    it("Check balance of Customer", async() => {

        var customerPhone = userData[userData.length - 4].Customer_Phone_number;
        var response = await axios.get(`${jsonData.baseUrl}/transaction/balance/${customerPhone}`, {

            headers: {
                "Content-Type": "application/json",
                Authorization: jsonData.token,
                "X-AUTH-SECRET-KEY": jsonData.secretKey,
            }

        }).then((res) => res.data)

        console.log(response.message);
        console.log(response.balance);
        expect(response.message).contains("User balance")
    })

    it("Check Statement by Trnx Id", async() => {

        var transactionId = userData[userData.length - 2].trnxId;
        var response = await axios.get(`${jsonData.baseUrl}/transaction/search/${transactionId}`, {

            headers: {
                "Content-Type": "application/json",
                "Authorization": jsonData.token,
                "X-AUTH-SECRET-KEY": jsonData.secretKey
            }

        }).then((res) => res.data)

        console.log(response.message);

        expect(response.message).contains("Transaction list")
    })

});