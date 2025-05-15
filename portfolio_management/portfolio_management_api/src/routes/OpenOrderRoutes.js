// routes/openOrderRoutes.js
import express from 'express';
import {JwtUtils} from "../utilities/jwtUtils.js";
import OpenOrder from "../models/OpenOrders.js";

const openOrderRoutes = express.Router();

// Apply middleware to all routes
openOrderRoutes.use(JwtUtils.verifyToken);

// Create Order
openOrderRoutes.post('/', async (req, res) => {
    try {
        const { account_id, holding_id, order_quantity, order_market_value } = req.body;

        const order = new OpenOrder({
            user_id: req.user.user.id,
            account_id,
            holding_id,
            order_quantity,
            order_market_value
        });

        await order.save();

        res.status(201).json({ status: true, message: "Open order created", data: order });
    } catch (error) {
        res.status(500).json({ status: false, message: "Error creating order", data: error.message });
    }
});

// Read All Orders for User
openOrderRoutes.get('/', async (req, res) => {
    try {
        const orders = await OpenOrder.find({ user_id: req.user.user.id });
        res.status(200).json({ status: true, message: "Orders fetched", data: orders });
    } catch (error) {
        res.status(500).json({ status: false, message: "Error fetching orders", data: error.message });
    }
});

// Update Order
openOrderRoutes.put('/:id', async (req, res) => {
    try {
        const updated = await OpenOrder.findOneAndUpdate(
            { _id: req.params.id, user_id: req.user.user.id },
            req.body,
            { new: true }
        );

        if (!updated) return res.status(404).json({ status: false, message: "Order not found", data: null });

        res.status(200).json({ status: true, message: "Order updated", data: updated });
    } catch (error) {
        res.status(500).json({ status: false, message: "Error updating order", data: error.message });
    }
});

// Delete Order
openOrderRoutes.delete('/:id', async (req, res) => {
    try {
        const deleted = await OpenOrder.findOneAndDelete({ _id: req.params.id, user_id: req.user.user._id });

        if (!deleted) return res.status(404).json({ status: false, message: "Order not found", data: null });

        res.status(200).json({ status: true, message: "Order deleted", data: deleted });
    } catch (error) {
        res.status(500).json({ status: false, message: "Error deleting order", data: error.message });
    }
});

export default openOrderRoutes;
