var mongoose = require('mongoose');
var System = mongoose.model('System');
var _ = require('underscore');

exports.searchSystems = function (req, res, next) {
    var limit = req.query.limit || 150;
    var skip = req.query.start || 0;
    var requestTime = req.query.request_time;
    if(requestTime == null || isNaN(requestTime)) {
        res.send("Invalid Request!");
        return;
    }

    //Get all Systems
    System.find().select({system: 1, creator: 1}).skip(skip).limit(limit).exec(function (err, systems) {
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