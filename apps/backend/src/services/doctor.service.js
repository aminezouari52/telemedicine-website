const httpStatus = require("http-status");
const { Doctor, Consultation } = require("../models");
const ApiError = require("../utils/ApiError");
const cloudinary = require("cloudinary");
const mongoose = require("mongoose");

// Sortable fields exposed on the doctor listing. Whitelisting prevents callers
// from injecting arbitrary (or nested) field names into Mongo's `.sort()`.
const ALLOWED_SORT_FIELDS = new Set(["price", "createdAt", "lastName"]);

const MAX_SEARCH_LENGTH = 100;

// Escape regex metacharacters so user input is matched literally, and cap the
// length so a crafted pattern cannot make MongoDB do unbounded work.
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const query = async function (Schema, filter, options) {
  let sort = "";
  if (options.sortBy) {
    const sortingCriteria = [];
    options.sortBy.split(",").forEach((sortOption) => {
      const [key, order] = sortOption.split(":");
      if (!ALLOWED_SORT_FIELDS.has(key)) {
        throw new ApiError(httpStatus.BAD_REQUEST, `Invalid sort field: ${key}`);
      }
      sortingCriteria.push((order === "desc" ? "-" : "") + key);
    });
    sort = sortingCriteria.join(" ");
  } else {
    sort = "createdAt";
  }

  const { specialty, hospital, text } = filter;

  let queryString = {
    isProfileCompleted: true,
    approvalStatus: "approved",
  };

  // Add filters only if they are provided and not empty
  if (specialty && specialty.trim()) {
    queryString.specialty = specialty;
  }

  if (hospital && hospital.trim()) {
    queryString.hospital = hospital;
  }

  if (text && text.trim()) {
    const escapedText = escapeRegex(text.trim().slice(0, MAX_SEARCH_LENGTH));
    queryString.$or = [
      { firstName: { $regex: escapedText, $options: "i" } },
      { lastName: { $regex: escapedText, $options: "i" } },
      { email: { $regex: escapedText, $options: "i" } },
    ];
  }

  let docsPromise = Schema.find(queryString).sort(sort);

  if (options.populate) {
    options.populate.split(",").forEach((populateOption) => {
      docsPromise = docsPromise.populate(
        populateOption
          .split(".")
          .reverse()
          .reduce((a, b) => ({ path: b, populate: a })),
      );
    });
  }

  docsPromise = docsPromise.exec();

  return docsPromise.then((results) => ({
    results,
    totalResults: results.length,
  }));
};

const getAllDoctors = async (filter, options) => {
  return await query(Doctor, filter, options);
};

const getDoctor = async (id) => {
  const doctor = Doctor.findById(id).exec();
  if (!doctor) {
    throw new ApiError(httpStatus.NOT_FOUND, "Doctor not found");
  }
  return doctor;
};

const updateDoctor = async (id, body) => {
  const doctor = await Doctor.findByIdAndUpdate(id, body, { new: true }).exec();
  if (!doctor) {
    throw new ApiError(httpStatus.NOT_FOUND, "Doctor not found");
  }
  return doctor;
};

const uploadProfilePicture = async (image) => {
  const result = await cloudinary.uploader.upload(image, {
    public_id: Date.now(),
    resource_type: "image",
  });

  return {
    public_id: result.public_id,
    url: result.secure_url,
  };
};

const getDoctorPatientsCount = async (id) => {
  const match = {
    $match: {
      doctor: new mongoose.Types.ObjectId(id),
      status: { $in: ["completed"] },
    },
  };

  const group = {
    $group: {
      _id: "$patient",
    },
  };

  const count = {
    $count: "uniquePatientCount",
  };

  const uniquePatientCount = await Consultation.aggregate([
    match,
    group,
    count,
  ]).exec();

  return uniquePatientCount[0]?.uniquePatientCount || 0;
};

module.exports = {
  getAllDoctors,
  getDoctor,
  updateDoctor,
  uploadProfilePicture,
  getDoctorPatientsCount,
};
