// routes/tickerRoutes.js
import express from 'express';
import TickerSymbol from '../models/tickerSymbol.js';

const tickerSymbolRouter = express.Router();

// GET route to search ticker details by string in any of the fields (isin, cusip, ticker_symbol, company_name)
tickerSymbolRouter.get('/tickers/search', async (req, res) => {
    try {
        const { search } = req.query; // Get the search query from the request URL

        if (!search) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        // Perform the search with the OR condition and exclude records where is_deleted is true
        const tickerDetails = await TickerSymbol.find({
            $and: [
                {
                    $or: [
                        { isin: { $regex: search, $options: 'i' } },
                        { cusip: { $regex: search, $options: 'i' } },
                        { ticker_symbol: { $regex: search, $options: 'i' } },
                        { company_name: { $regex: search, $options: 'i' } },
                    ],
                },
                { is_deleted: { $ne: true } }, // Exclude records where is_deleted is true
            ],
        });

        res.status(200).json(tickerDetails);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// PUT route to update ticker details based on cusip, isin, or ticker_symbol
tickerSymbolRouter.put('/tickers/update', async (req, res) => {
    try {
        const { cusip, isin, ticker_symbol, current_price, company_name, company_description } = req.body;

        // Ensure at least one identifier (cusip, isin, or ticker_symbol) is provided
        if (!cusip && !isin && !ticker_symbol) {
            return res.status(400).json({ message: 'cusip, isin, or ticker_symbol is required to update' });
        }

        // Create the filter object dynamically based on provided identifier
        const filter = {};
        if (cusip) filter.cusip = cusip;
        if (isin) filter.isin = isin;
        if (ticker_symbol) filter.ticker_symbol = ticker_symbol;

        // Create the update object
        const updateData = {};
        if (current_price) updateData.current_price = current_price;
        if (company_name) updateData.company_name = company_name;
        if (company_description) updateData.company_description = company_description;

        // Find and update the ticker detail
        const updatedTicker = await TickerSymbol.findOneAndUpdate(
            filter,
            { $set: updateData },
            { new: true,  }  // Return the updated document
        );

        if (!updatedTicker) {
            return res.status(404).json({ message: 'Ticker not found' });
        }

        res.status(200).json(updatedTicker);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// PUT route to softly delete ticker details by cusip, isin, or ticker_symbol
tickerSymbolRouter.put('/tickers/delete', async (req, res) => {
    try {
        const { cusip, isin, ticker_symbol } = req.body;

        // Ensure at least one identifier (cusip, isin, or ticker_symbol) is provided
        if (!cusip && !isin && !ticker_symbol) {
            return res.status(400).json({ message: 'cusip, isin, or ticker_symbol is required to delete' });
        }

        // Create the filter object dynamically based on provided identifier
        const filter = {};
        if (cusip) filter.cusip = cusip;
        if (isin) filter.isin = isin;
        if (ticker_symbol) filter.ticker_symbol = ticker_symbol;

        // Find the ticker detail and set is_deleted to true
        const deletedTicker = await TickerSymbol.findOneAndUpdate(
            filter,
            { $set: { is_deleted: true } },
            { new: true }  // Return the updated document
        );

        if (!deletedTicker) {
            return res.status(404).json({ message: 'Ticker not found' });
        }

        res.status(200).json({ message: `Ticker with ${cusip || isin || ticker_symbol} marked as deleted` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


export default tickerSymbolRouter;