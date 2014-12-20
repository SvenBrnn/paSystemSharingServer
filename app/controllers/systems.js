var mongoose = require('mongoose');
var System = mongoose.model('System');
var _ = require('underscore');
var v = require('validator');

exports.searchSystems = function (req, res, next) {
    var limit = req.query.limit || 150;
    var skip = req.query.start || 0;
    var name = req.query.name || "";
    var creator = req.query.creator || "";
    var minPlanets = req.query.minPlanets || 1;
    var maxPlanets = req.query.maxPlanets || 16;
    //var sort_field = req.query.sort_field || "system"; //for later
   // var sort_direction = req.query.sort_direction == "DESC" ? 1 : 0;  //for later
    var requestTime = req.query.request_time;

    //Validate Fields
    if(!v.isInt(requestTime)
        || !v.isInt(limit)
        || !v.isInt(skip)
        || !v.isInt(minPlanets)
        || !v.isInt(maxPlanets)
        ) {
        res.send("Invalid Request!");
        return;
    }

    //Get all Systems
    var sys = System.find().select({system: 1, creator: 1});

    //Filter
    if(name != "") {
        var regexname = new RegExp('.*'+name+'.*', 'i');
        sys = sys.where('name').equals(regexname);
    }

    if(creator != "")
    {
        var regexcreator = new RegExp('.*'+name+'.*', 'i');
        sys = sys.where('creator').equals(regexcreator);
    }

    //Min and max planet count
    sys = sys.where('numPlanets').lte(maxPlanets);
    sys = sys.where('numPlanets').gte(minPlanets);

    sys.skip(skip).limit(limit).exec(function (err, systems) {
        if (err) {
            return next(err);
        }

        var tmpSystems = [];
        //Prepare Output
        _.each(systems, function (sys, key) {
            var s = {};
            //Cleanup system from mongoose object stuff
            _.each(sys.system, function (value, key) {
                if(key == '_id')
                    return;

                s[key] = value;
            });
            tmpSystems.push(s);
        });

        var ret = {
            request_time: requestTime,
            total: systems.length,
            systems: tmpSystems
        }

        //Return found Systems
        res.send(ret);
    });
}

exports.saveSystem = function (req, res, next) {
    var sys = null;
    //Parse System we got
    try {
        sys = JSON.parse(req.body.system);
    } catch (e) {
        return next(e);
    }
    //If System is correctly set
    if(sys) {
        //Lets see if we already know this System
        System.findOne({name: sys.name}).exec(function(error, system) {
            if(error)
                return next(error);

            //If the System already exists
            //we just update it
            if(system) {
                system.creator =sys.creator;
                system.date_created = new Date();
                system.ip = req.ip;
                system.numPlanets = sys.planets.length;
                system.system = sys;
                system.save(function (error) {
                    if(error)
                        return next(error);

                    console.log("editedSystem");
                    res.send("true");
                });

            }
            //If the System Doesnt exist yet
            //we create it in our database
            else {
                var s = new System({
                    creator: sys.creator,
                    date_created: new Date(),
                    ip: req.ip,
                    name: sys.name,
                    numPlanets: sys.planets.length,
                    system: sys
                });
                s.save(function (error) {
                    if(error)
                        return next(error);

                    console.log("newSystem");
                    res.send("true");
                })
            }
        });

    } else {
        next();
    }
}