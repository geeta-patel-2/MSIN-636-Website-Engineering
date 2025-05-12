import mongoose from 'mongoose';
import UserAccount from "../src/models/UserAccounts.js";
import TickerSymbol from "../src/models/tickerSymbol.js";
import AccountHoldings from "../src/models/AccountHoldings.js";
import dotenv from "dotenv";
import connectDB from "../src/config/db.js";

// Load env variables
dotenv.config();

// Function to generate random float in a range
function randomFloat(min, max, precision = 2) {
    return parseFloat((Math.random() * (max - min) + min).toFixed(precision));
}

// Main script function
async function populateAccountHoldings() {
    try {
        // Step 1: Fetch all user accounts
        const userAccounts = await UserAccount.find({});
        if (!userAccounts.length) {
            console.log('No UserAccounts found. Exiting...');
            return;
        }
        console.log(`Found ${userAccounts.length} UserAccounts.`);

        // Step 2: Loop over each UserAccount
        for (const userAccount of userAccounts) {
            console.log(`\nProcessing UserAccount: ${userAccount._id}`);

            // Step 2.2: Pick random holding size between 15 to 50
            const randomHoldingSize = Math.floor(Math.random() * (50 - 15 + 1)) + 15;
            console.log(`Will create ${randomHoldingSize} holdings for this account.`);

            // Step 2.3: Loop for each holding
            for (let i = 1; i <= randomHoldingSize; i++) {
                try {
                    // Step 1 of "Steps to populate AccountHoldings": Pick a random TickerDetail
                    const randomTicker = await TickerSymbol.aggregate([{ $sample: { size: 1 } }]);
                    if (!randomTicker.length) {
                        console.log('No TickerDetail found. Skipping...');
                        continue;
                    }
                    const ticker = randomTicker[0];

                    // Step 2: Generate random quantity
                    const randomMarketValue = randomFloat(10000, 25000, 2); // between 10k and 25k
                    const tickerPrice = ticker.current_price;  // Assuming 'price' field exists
                    if (!tickerPrice || tickerPrice === 0) {
                        console.log(`Ticker ${ticker._id} has invalid price. Skipping...`);
                        continue;
                    }
                    const randomQuantity = Math.abs(randomMarketValue / tickerPrice);

                    // Step 3: Skip if random_quantity < 1
                    if (randomQuantity < 1) {
                        console.log(`Random quantity < 1 for ticker ${ticker._id}. Skipping...`);
                        continue;
                    }

                    // Step 4: Create new AccountHoldings object
                    const accountHolding = new AccountHoldings({
                        account_id: userAccount._id,
                        ticker_symbol: ticker._id,
                        current_quantity: parseFloat(randomQuantity.toFixed(4)),
                        current_market_value: parseFloat((randomQuantity * tickerPrice).toFixed(2)),
                        projected_quantity: parseFloat(randomQuantity.toFixed(4)),
                        projected_market_value: parseFloat((randomQuantity * tickerPrice).toFixed(2)),
                        // The rest of the fields will use default values
                    });

                    // Step 12: Save to DB
                    await accountHolding.save();
                    console.log(`✅ Saved AccountHolding (${i}/${randomHoldingSize}) for account ${userAccount._id}`);
                } catch (innerError) {
                    console.error(`Error processing holding (${i}) for account ${userAccount._id}:`, innerError.message);
                }
            }
        }

        console.log('\n✅ Finished populating AccountHoldings for all UserAccounts.');
    } catch (error) {
        console.error('Error in populateAccountHoldings script:', error.message);
    } finally {
        mongoose.disconnect();
    }
}

// Run the script
(async () => {
    await connectDB();
    await populateAccountHoldings();
})();
