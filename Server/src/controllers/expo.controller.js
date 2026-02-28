const Expo = require('../models/expo.model');
const mongoose = require('mongoose');
// CREATES EXPO //

exports.createExpo = async (req, res) => {
    try{
        const{title, description, theme, location, starDate, endDate, maxBooths,maxAttendees, gridRows, gridCols,} = req.body;

        const expo = await Expo.create({
            title,
            description,
            theme,
            location,
            starDate,
            endDate,
            maxBooths,
            maxAttendees,
            gridRows,
            gridCols,
            totalBoothsGenerated : gridRows * gridCols,
            createdBy : req.user._id,
        });
        res.status(201).json({
            success:true,
            message : "Expo created successfully",
            data: expo,
        });
    }catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        })
    }
}

// GETS ALL EXPOS

exports.getAllExpos = async (req, res) => {
    try {
        const expos = await Expo.find().sort({createdAt : -1});
        res.status(200).json({
            success: true,
            count : expos.length,
            data : expos,
        })
    }catch (error) {
        res.status (500).json({
            success: false,
            message : error.message,
        })

    }
};

// GETS SINGLE EXPO

exports.getExpoById = async (req, res) => {
    try {
        const expo= await Expo.findById(req.params.id);
        if(!expo){
            return res.status(404).json({
                success: false,
                message : "Expo not found",
            })
        }
        res.status(200).json({
            success: true,
            data : expo,
        })
    }
    catch (e) {
        res.status(500).json({
            success: false,
            message : error.message,
        })
    }
}
// DELETE EXPO
exports.deleteExpo = async (req, res) => {
    try {
        const expo = await Expo.findById(req.params.id);
        if(!expo){
            return res.status(404).json({
                success: false,
                message : "Expo not found",
            })
        }
        await expo.deleteOne();
        res.status(200).json({
            success: true,
            message : "Expo deleted successfully",
        })
    }
    catch (e) {
        res.status(500).json({
            success: false,
            message : error.message,
        })
    }
}

// UPDATE EXPO

exports.updateExpo = async (req, res) => {
    try{
        const expo = await Expo.findById(req.params.id);
        if(!expo){
            return res.status(404).json({
                success: false,
                message : "Expo not found",
            })
        }
        // prevent editing if already published
        if(expo.status === "isPublished"){
            return res.status(400).json({
                success: false,
                message : "Cannot edit a published expo",
            })
        }
        Object.assign(expo, req.body);
        await expo.save();

        res.status(200).json({
            success: true,
            message : "Expo updated successfully",
            data : expo,
        })
    }catch (e) {
        res.status(400).json({
            success: false,
            message : error.message,
        })
    }
};

// PUBLISH EXPO

exports.publishExpo = async (req, res) => {
    try {
        const expo = await Expo.findById(req.params.id);
        if(!expo){
            return res.status(404).json({
                success: false,
                message : "Expo not found",
            })
        }
        if(expo.status === "draft"){
            return res.status(400).json({
                success: false,
                message : "Only draft expos can be published",
            })
        }
        expo.status = "Published";
        await expo.save();
        res.status(200).json({
            success: true,
            message : "Expo published successfully",
            data : expo,
        })
    }
    catch (e) {
        res.status(500).json({
            success: false,
            message : error.message,
        })
    }
}