import express from 'express';
import Joi from 'joi';
import { analyzeImage } from '../utils/imageAnalyzer.js';

const router = express.Router();

const imageDataSchema = Joi.object({
    image: Joi.string().required(),
    dict_of_vars: Joi.object().pattern(Joi.string(), Joi.any()).required()
});

router.post('/', async (req, res) => {
    try {
        // Validate request body
        const { error, value } = imageDataSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        // Process image
        const result = await analyzeImage(value.image, value.dict_of_vars);

        return res.json(result);
    } catch (error) {
        console.error('Error processing request:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;