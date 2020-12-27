const express = require("express");
const { User, Audit } = require("../_helpers/db");
const router = express.Router();
const userService = require("./user.service");

// routes
router.post("/authenticate", authenticate);
router.post("/register", register);
router.post("/logout", logout);
router.get("/", getAll);
router.get("/current", getCurrent);
router.get("/audit", getAudit);
router.get("/:id", getById);
router.put("/:id", update);
router.delete("/:id", _delete);

module.exports = router;

function authenticate(req, res, next) {
  const clientIP = req.connection.remoteAddress;
  userService
    .authenticate(req.body, clientIP)
    .then((user) =>
      user
        ? res.json(user)
        : res.status(400).json({ message: "Username or password is incorrect" })
    )
    .catch((err) => next(err));
}

function getAudit(req, res, next) {
  if (req.user.role.toUpperCase() !== "AUDITOR") {
    res.status(401).json({ error: "Unauthorized" });
  } else {
    userService
      .getAllAudits()
      .then((users) => res.json(users))
      .catch((err) => next(err));
  }
}

async function logout(req, res, next) {
  const auditId = req.body.auditId;
 
  await Audit.findByIdAndUpdate(auditId,{logoutTime:Date.now()},(err,doc)=>{

    res.status(200).json({message:"Logout Successful"})
  })
 
}

function register(req, res, next) {
  userService
    .create(req.body)
    .then(() => res.json({}))
    .catch((err) => next(err));
}

function getAll(req, res, next) {
  userService
    .getAll()
    .then((users) => res.json(users))
    .catch((err) => next(err));
}

function getCurrent(req, res, next) {
  userService
    .getById(req.user.sub)
    .then((user) => (user ? res.json(user) : res.sendStatus(404)))
    .catch((err) => next(err));
}

function getById(req, res, next) {
  userService
    .getById(req.params.id)
    .then((user) => (user ? res.json(user) : res.sendStatus(404)))
    .catch((err) => next(err));
}

function update(req, res, next) {
  userService
    .update(req.params.id, req.body)
    .then(() => res.json({}))
    .catch((err) => next(err));
}

function _delete(req, res, next) {
  userService
    .delete(req.params.id)
    .then(() => res.json({}))
    .catch((err) => next(err));
}
