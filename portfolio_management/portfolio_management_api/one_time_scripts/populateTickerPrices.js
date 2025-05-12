import mongoose from 'mongoose';
import dotenv from 'dotenv';
import TickerSymbol from "../src/models/tickerSymbol.js";
import connectDB from "../src/config/db.js";

// Load environment variables from .env
dotenv.config();

// Function to generate random float between min and max
function randomPrice(min, max) {
    return (Math.random() * (max - min) + min).toFixed(6);
}

// Main function to populate prices
async function populateTickerPrices() {
    try {
        // Step 1: Fetch all ticker symbols
        const tickers = await TickerSymbol.find({});
        if (!tickers.length) {
            console.log('No TickerSymbols found. Exiting...');
            return;
        }
        console.log(`Found ${tickers.length} ticker symbols.`);

        let numberOfTickers = 1;
        // Step 2: Loop and update each ticker symbol
        for (const ticker of tickers) {
            try {
                const randomGeneratedPrice = randomPrice(10, 1000);

                ticker.current_price = mongoose.Types.Decimal128.fromString(randomGeneratedPrice);
                await ticker.save();

                console.log(`✅ Updated ${numberOfTickers} ${ticker._id} with price: ${randomGeneratedPrice}`);
                numberOfTickers++;
            } catch (innerError) {
                console.error(`Error updating ticker ${ticker._id}:`, innerError.message);
            }
        }

        console.log('\n✅ Finished updating prices for all ticker symbols.');
    } catch (error) {
        console.error('Error in populateTickerPrices script:', error.message);
    } finally {
        mongoose.disconnect();
    }
}

// Run the script
(async () => {
    await connectDB();
    await populateTickerPrices();
})();
