const express = require('express');
const { authenticate, authorize } = require('../middlewares/auth');
const Ingredient = require('../models/Ingredient');
const router = express.Router();

router.post('/', authenticate, authorize(['admin', 'worker']), (req, res) => {
    const { name, quantity } = req.body;
    Ingredient.createIngredient(name, quantity, (err, ingredientId) => {
        if (err) return res.status(500).send('Error creating ingredient');
        res.status(201).send({ ingredientId });
    });
});

router.get('/', authenticate, (req, res) => {
    Ingredient.getAllIngredients((err, ingredients) => {
        if (err) return res.status(500).send('Error fetching ingredients');
        res.send(ingredients);
    });
});

router.put('/:id', authenticate, authorize(['admin']), (req, res) => {
    const { id } = req.params;
    const { name, quantity } = req.body;
    Ingredient.updateIngredient(id, name, quantity, (err) => {
        if (err) return res.status(500).send('Error updating ingredient');
        res.send('Ingredient updated');
    });
});

router.delete('/:id', authenticate, authorize(['admin']), (req, res) => {
    const { id } = req.params;
    Ingredient.deleteIngredient(id, (err) => {
        if (err) return res.status(500).send('Error deleting ingredient');
        res.send('Ingredient deleted');
    });
});

module.exports = router;
