'use strict';
require('dotenv').config();
var expect = require('chai').expect;
const mongoose = require('mongoose')
var mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log("MongoDB database connection established successfully");
});
var Schema = mongoose.Schema;
var IssueSchema = new Schema(
  {
    issue_title: { type: String, required: true },
    issue_text: { type: String, required: true },
    created_by: { type: String, required: true },
    assigned_to: { type: String },
    status_text: { type: String },
    open: { type: Boolean, default: true },
    created_on: { type: Date, required: true, default: new Date() },
    updated_on: { type: Date, required: true, default: new Date() },
    project: { type: String }
  }
);
const Issue = mongoose.model("Issue", IssueSchema);

module.exports = function (app) {

  app.route('/api/issues/:project')

    .get(async function (req, res) {
      try {
        var project = req.params.project;
        if (Object.keys(req.query).length != 0) {
          let queryObject = Object.assign(req.query)
          queryObject['project'] = project
          await Issue.find(queryObject, (err, filterIssues) => {
            if (err) {
              console.log(err)
            }
            res.json(filterIssues);
          })
        } else {
          let issues = await Issue.find({ project: project });
          res.json(issues)
        }
      } catch (err) {
        console.error(err)
        res.status(500).json('Server erorr...')
      }
    })

    .post(async function (req, res) {
      try {
        var project = req.params.project;
        if(!req.body.issue_title || !req.body.issue_text || !req.body.created_by){
          return res.json('Required fields missing')
        }
        let issue = new Issue({
          issue_title: req.body.issue_title,
          issue_text: req.body.issue_text,
          created_by: req.body.created_by,
          assigned_to: req.body.assigned_to,
          status_text: req.body.status_text,
          project: project
        });
        await issue.save(function (err) {
          if (err) return console.error(err);
          res.json(issue)
        });
      } catch (err) {
        console.error(err)
        res.status(500).json('Server erorr...')
      }
    })

    .put(async function (req, res) {
      try {
        var project = req.params.project;
        let _id = req.body._id;
        let updateObject = {}
        Object.keys(req.body).forEach((key) => {
          if (req.body[key] != '') {
            updateObject[key] = req.body[key]
          }
        })
        if (Object.keys(updateObject).length < 2) {
          return res.json('no updated field sent')
        }
        updateObject['updated_on'] = new Date()
        Issue.findByIdAndUpdate(_id, updateObject, { new: true }, function (err, issue) {
          if (err) {
            res.send('could not update ' + _id);
          }
          else {
            res.send('successfully updated ' + _id);
          }
        });
      } catch (err) {
        console.error(err)
        res.status(500).json('Server erorr...')
      }
    })

    .delete(async function (req, res) {
      try {
        var project = req.params.project;
        let _id = req.body._id;
        if (!_id) { return `id error` }
        await Issue.findByIdAndDelete(_id, function (err, issue) {
          if (err) {
            res.send('could not delete ' + _id);
          }
          else {
            res.send('deleted ' + _id);
          }
        });
      } catch (err) {
        console.error(err)
        res.status(500).json('Server erorr...')
      }
    });

};
