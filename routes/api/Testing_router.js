var express = require('express');
var router = express.Router();
const apiMiddleware = require('../../services/apimiddleware');

const putil = require('../../utilities/projectutility')

// GET /api/Testing/test
router.get('/test', apiMiddleware.authenticate, async (req, res) => {
    try {
        res.json({
            is_success: true,
            message: "Method GET invoked",
            status: 200,
            content: {
                req_headers: req.headers,
                req_body: req.body
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            is_success: false,
            message: "Error",
            status: 500,
            content: {
                error: error.message
            }
        
        })
    }
});

// POST /api/Testing/test
router.post('/test', apiMiddleware.authenticate, async (req, res) => {
    try {
        res.json({
            is_success: true,
            message: "Method POST invoked",
            status: 200,
            content: {
                req_headers: req.headers,
                req_body: req.body
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            is_success: false,
            message: "Error",
            status: 500,
            content: {
                error: error.message
            }
        })
    }
});

// PUT /api/Testing/test
router.put('/test', apiMiddleware.authenticate, async (req, res) => {
    try {
        res.json({
            is_success: true,
            message: "Method PUT invoked",
            status: 200,
            content: {
                req_headers: req.headers,
                req_body: req.body
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            is_success: false,
            message: "Error",
            status: 500,
            content: {
                error: error.message
            }
        
        })
    }
});

// DELETE /api/Testing/test
router.delete('/test', apiMiddleware.authenticate, async (req, res) => {
    try {
        res.json({
            is_success: true,
            message: "Method DELETE invoked",
            status: 200,
            content: {
                req_headers: req.headers,
                req_body: req.body
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            is_success: false,
            message: "Error",
            status: 500,
            content: {
                error: error.message
            }
        })
    }
});

// GET /api/Testing/test2

module.exports = router;