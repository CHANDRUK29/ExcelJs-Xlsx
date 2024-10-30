const router = require("express").Router();

const templateController = require("../controllers/template");

router.get('/generate-template', templateController.generateTemplate);

module.exports = router;
