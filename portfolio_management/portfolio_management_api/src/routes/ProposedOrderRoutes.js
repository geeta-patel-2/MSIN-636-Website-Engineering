// routes/proposeOrderRoutes.js
import express from 'express';
import ProposedOrderSession from '../models/ProposedOrderSession.js';
import ProposedOrderSessionAccounts from '../models/ProposedOrderSessionAccounts.js';
import ProposedOrderSessionAccountHoldings from '../models/ProposedOrderSessionAccountHoldings.js';
import User from '../models/user.js';
import UserAssociation from '../models/UserAssociation.js';
import TickerSymbol from '../models/tickerSymbol.js';
import AccountHoldings from '../models/AccountHoldings.js';
import UserAccount from "../models/UserAccounts.js";
import {JwtUtils} from "../utilities/jwtUtils.js";

const proposedOrderRoutes = express.Router();

// Apply middleware to all routes
proposedOrderRoutes.use(JwtUtils.verifyToken);

proposedOrderRoutes.post('/apply_algorithm', async (req, res) => {
    try {
        const { ticker_symbol, order_quantity } = req.body;

        // Step 2: Find user object
        const user = await User.findById(req.user.user._id);
        if (!user) return res.status(404).json({ status: false, message: 'User not found.', data: null });

        // Step 2.1: Create new ProposedOrderSession
        const proposedSession = new ProposedOrderSession({
            proposed_order_session_created_by: user._id
        });
        await proposedSession.save();

        // Step 2.2: Initialize account counter
        let account_with_orders = 0;

        // Step 3: Get checked user associations for user
        const associations = await UserAssociation.find({
            strategic_advisor_id: user._id,
            check_box: 'checked'
        });

        // Step 4: Loop over each association
        for (const assoc of associations) {
            try {
                // Step 4.1: Get associated account
                const account = await UserAccount.findOne({ individual_id: assoc.individual_id });
                if (!account) continue;

                // Step 4.1.1 - 4.1.4: Create session account
                const sessionAccount = new ProposedOrderSessionAccounts({
                    proposed_order_session_id: proposedSession._id,
                    account_id: account._id
                });
                await sessionAccount.save();

                // Step 4.2: Fetch holdings for account
                const holdings = await AccountHoldings.find({ account_id: account._id });

                // Step 4.3: Find ticker symbol
                const ticker = await TickerSymbol.findOne({ticker_symbol});
                if (!ticker) continue;

                let proposed_order = null;

                // Step 4.5: Buy logic
                if (order_quantity > 0) {
                    const order_value = ticker.current_price * Math.trunc(order_quantity);

                    if (order_value > parseFloat(account.liquid_cash_amount.toString())) {
                        console.error(`Insufficient cash for ${account.account_id}`);
                        continue;
                    }

                    proposed_order = new ProposedOrderSessionAccountHoldings();
                    const existing = holdings.find(h => h.ticker_symbol.toString() === ticker._id.toString());
                    if (existing) {
                        proposed_order.current_quantity = existing.current_quantity;
                        proposed_order.current_market_value = existing.current_market_value;
                        proposed_order.projected_quantity = existing.projected_quantity;
                        proposed_order.projected_market_value = existing.projected_market_value;
                    }
                    proposed_order.order_quantity = Math.trunc(order_quantity);
                    proposed_order.order_market_value = ticker.current_price * proposed_order.order_quantity;
                    proposed_order.projected_quantity = parseFloat(proposed_order.projected_quantity || 0) + proposed_order.order_quantity;
                    proposed_order.projected_market_value = ticker.current_price * proposed_order.projected_quantity;

                } else if (order_quantity < 0) {
                    // Step 4.6: Sell logic
                    const existing = holdings.find(h => h.ticker_symbol.toString() === ticker._id.toString());
                    if (!existing) {
                        console.error(`${account._id}: cannot sell ${ticker_symbol} as not owned.`);
                        continue;
                    }
                    proposed_order = new ProposedOrderSessionAccountHoldings();
                    proposed_order.current_quantity = existing.current_quantity;
                    proposed_order.current_market_value = existing.current_market_value;
                    proposed_order.projected_quantity = existing.projected_quantity;
                    proposed_order.projected_market_value = existing.projected_market_value;
                    proposed_order.order_quantity = Math.trunc(order_quantity);
                    proposed_order.order_market_value = ticker.current_price * proposed_order.order_quantity;
                    proposed_order.projected_quantity = proposed_order.projected_quantity - proposed_order.order_quantity;
                    proposed_order.projected_market_value = ticker.current_price * proposed_order.projected_quantity;
                }

                // Step 4.7: If order created
                if (proposed_order) {
                    const proposed_orders_arr = [];

                    for (const h of holdings) {
                        if (h.ticker_symbol.toString() === ticker._id.toString()) continue;

                        proposed_orders_arr.push(new ProposedOrderSessionAccountHoldings({
                            proposed_order_session_accounts_id: sessionAccount._id,
                            proposed_order_session_id: proposedSession._id,
                            holding_id: h._id,
                            ticker_symbol: h.ticker_symbol,
                            current_quantity: h.current_quantity,
                            current_market_value: h.current_market_value,
                            projected_quantity: h.projected_quantity,
                            projected_market_value: h.projected_market_value,
                        }));
                    }

                    proposed_order.proposed_order_session_accounts_id = sessionAccount._id;
                    proposed_order.proposed_order_session_id = proposedSession._id;
                    proposed_order.holding_id = holdings.find(h => h.ticker_symbol.toString() === ticker._id.toString())?._id;
                    proposed_order.ticker_symbol = ticker._id;

                    proposed_orders_arr.push(proposed_order);

                    await ProposedOrderSessionAccountHoldings.insertMany(proposed_orders_arr);
                    account_with_orders++;
                }

            } catch (innerErr) {
                console.error('Error processing account:', innerErr);
            }
        }

        // Step 5: Final response
        return res.status(200).json({
            status: true,
            message: 'Algorithm ran successfully.',
            data: {
                proposed_order_session: proposedSession,
                account_with_orders: account_with_orders
            }
        });

    } catch (err) {
        console.error('Error in /apply_algorithm:', err);
        return res.status(500).json({ status: false, message: 'Internal server error.', data: null });
    }
});

/**
 * POST /send_to_open_order
 * Converts proposed orders with non-zero quantity to OpenOrders
 */
proposedOrderRoutes.post('/send_to_open_order', async (req, res) => {
    try {
        // Step 1: Get user from JWT
        const userId = req.user.user._id;

        // Step 2: Get proposed_order_session_id from request body
        const { proposed_order_session_id } = req.body;
        if (!proposed_order_session_id) {
            return res.status(400).json({
                status: false,
                message: "proposed_order_session_id is required.",
                data: null
            });
        }

        // Step 3.1: Validate ProposedOrderSession exists
        const session = await ProposedOrderSession.findById(proposed_order_session_id);
        if (!session) {
            return res.status(404).json({
                status: false,
                message: "Proposed order session not found.",
                data: null
            });
        }

        // Step 3.2: Get all session accounts for this session
        const sessionAccounts = await ProposedOrderSessionAccounts.find({
            proposed_order_session_id
        });

        if (!sessionAccounts || sessionAccounts.length === 0) {
            return res.status(404).json({
                status: false,
                message: "No session accounts found for this session.",
                data: null
            });
        }

        // Step 3.3: Get all account IDs from sessionAccounts
        const sessionAccountIds = sessionAccounts.map(a => a._id);

        // Step 3.4: Get all account holdings with non-zero order_quantity
        const sessionHoldings = await ProposedOrderSessionAccountHoldings.find({
            proposed_order_session_accounts_id: { $in: sessionAccountIds },
            order_quantity: { $ne: 0 }
        });

        if (!sessionHoldings || sessionHoldings.length === 0) {
            return res.status(404).json({
                status: false,
                message: "No proposed orders with non-zero order quantity found.",
                data: null
            });
        }

        // Step 4: Create OpenOrder objects
        const openOrders = [];

        sessionHoldings.forEach(holding => {
            const sessionAccount = sessionAccounts.find(sa =>
                sa._id.toString() === holding.proposed_order_session_accounts_id.toString()
            );

            if (sessionAccount) {
                openOrders.push(new OpenOrder({
                    user_id: userId,
                    account_id: sessionAccount.account_id,
                    holding_id: holding.holding_id || null,
                    order_quantity: holding.order_quantity,
                    order_market_value: holding.order_market_value
                }));
            }
        });

        // Step 5: Save all open orders
        await OpenOrder.insertMany(openOrders);

        return res.status(200).json({
            status: true,
            message: "Proposed orders sent to open orders successfully.",
            data: {
                total_open_orders: openOrders.length,
                session_id: proposed_order_session_id
            }
        });
    } catch (err) {
        console.error("Error in /send_to_open_order:", err);
        return res.status(500).json({
            status: false,
            message: "Internal server error",
            data: err.message
        });
    }
});

export default proposedOrderRoutes;
