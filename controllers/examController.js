const exam = require("../models/exampaper-model");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { subscribe } = require("diagnostics_channel");
const { types } = require("joi");

exports.uploadPaper = async (req, res) => {
    try {
        const { semester, year, subjectcode, department, examtype ,subject,current } = req.body;
        
        if (!req.file) {
            throw new Error('No file uploaded');
        }
        const fileUrl = '/uploads/' + path.basename(req.file.path);

        const paper = await exam.create({
            semester,
            year,
            subjectcode,
            department,
            types: examtype,
            subject,
            current,
            fileUrl, 
            uploadedBY: req.user.id
        });

        req.flash("success", "Uploaded successfully");
        res.redirect("/admin/upload");
    } catch(err) {
        if (req.file && req.file.path) {
            fs.unlink(req.file.path, () => {});
        }
        console.error('Upload error:', err);
        req.flash('error', err.message || 'Failed to upload exam paper');
        res.redirect('/admin/upload');
    }
};

exports.getExamType = async (req, res) => {
    try {
        const examType = req.params.type;
        const validType = ["mid", "end"];
        if (!validType.includes(examType)) {
            return res.status(404).send('Exam type not found');
        }

        const { current, year, semester } = req.query;
        let filter = { types: examType };
        if (current) filter.current = current;
        if (year) filter.year = year;
        if (semester) filter.semester = semester;

      
        const allExams = await exam.find({ types: examType });
        const seasons = [...new Set(allExams.map(e => e.current))].filter(Boolean);
        const years = [...new Set(allExams.map(e => e.year))].filter(Boolean);
        const semesters = [...new Set(allExams.map(e => e.semester))].filter(Boolean);

        
        const exams = await exam.find(filter)
            .sort({ createdAt: -1 })
            .populate('uploadedBY', 'name email');

        res.render('exam/list', {
            exams,
            examType,
            seasons,
            years,
            semesters,
            currents: { current: current || "", year: year || "", semester : semester || "" },
            pageTitle: `${examType.toUpperCase()} Term Papers`,
            isAuthenticated: !!req.user,
            isAdmin: req.user?.isAdmin
        });
    } catch (err) {
        console.error('Exam fetch error:', err);
        req.flash('error', 'Failed to load exam papers');
        res.redirect('/profile');
    }
};

exports.viewPDF = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).render('error', {
                message: 'Invalid paper ID format',
                isAuthenticated: !!req.user
            });
        }


        const paper = await exam.findById(req.params.id).populate("uploadedBY", "name email");
        if(!paper){
            throw new Error('Paper not found');
        }

        res.render("exam/viewer", {
            paper,
            isAuthenticated : !!req.user,
            isAdmin : req.user?.isAdmin
        })
    } catch(err) {
        console.error('View error:', err);
        res.status(500).render('error', {
            message: 'Failed to view paper',
            error: process.env.NODE_ENV === 'production' ? err : null,
            isAuthenticated: !!req.user
        });
    }
};

exports.downloadPDF = async (req, res) => {
    try {
        const paperId = req.params.id;

        
        if (!paperId || !mongoose.Types.ObjectId.isValid(paperId)) {
            return res.status(400).send('Invalid document ID');
        }


        const paper = await exam.findById(paperId).lean();
        if (!paper) {
            return res.status(404).send('Document not found');
        }

        const filePath = path.join(__dirname, '..', paper.fileUrl);

        if (!fs.existsSync(filePath)) {
            return res.status(404).send('File not found on server');
        }


        const filename = `${paper.subject}-${paper.current}-${paper.year}${path.extname(filePath)}`;

        res.download(filePath, filename, (err) => {
            if (err) {
                console.error('Download error:', err);
                if (!res.headersSent) {
                    res.status(500).send('Download failed');
                }
            }
        });

    } catch (err) {
        console.error('Unhandled download error:', err);
        res.status(500).send('Server error');
    }
};

