const httpStatus = require("http-status");
const { Doctor, User, Consultation } = require("../models");
const ApiError = require("../utils/ApiError");
const cloudinary = require("cloudinary");
const mongoose = require("mongoose");

const getUserById = async (id) => {
  return User.findById(id);
};

const query = async function (Schema, filter, options) {
  /**
   * @typedef {Object} QueryResult
   * @property {Document[]} results - Results found
   * @property {number} totalPages - Total number of pages
   * @property {number} totalResults - Total number of documents
   */
  /**
   * Query for documents with pagination
   * @param {Object} [filter] - Mongo filter
   * @param {Object} [options] - Query options
   * @param {string} [options.sortBy] - Sorting criteria using the format: sortField:(desc|asc). Multiple sorting criteria should be separated by commas (,)
   * @param {string} [options.populate] - Populate data fields. Hierarchy of fields should be separated by (.). Multiple populating criteria should be separated by commas (,)
   * @returns {Promise<QueryResult>}
   */

  let sort = "";
  if (options.sortBy) {
    const sortingCriteria = [];
    options.sortBy.split(",").forEach((sortOption) => {
      const [key, order] = sortOption.split(":");
      sortingCriteria.push((order === "desc" ? "-" : "") + key);
    });
    sort = sortingCriteria.join(" ");
  } else {
    sort = "createdAt";
  }

  const { specialty, hospital, text } = filter;

  let queryString = {
    isProfileCompleted: true,
  };

  // Add filters only if they are provided and not empty
  if (specialty && specialty.trim()) {
    queryString.specialty = specialty;
  }

  if (hospital && hospital.trim()) {
    queryString.hospital = hospital;
  }

  if (text && text.trim()) {
    queryString.$or = [
      { firstName: { $regex: text, $options: "i" } },
      { lastName: { $regex: text, $options: "i" } },
      { email: { $regex: text, $options: "i" } },
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
  const doctors = await query(Doctor, filter, options);
  return doctors;
};

const updateDoctorById = async (doctorId, updateBody) => {
  const doctor = await getUserById(doctorId);
  if (!doctor) {
    throw new ApiError(httpStatus.NOT_FOUND, "Doctor not found");
  }
  Object.assign(doctor, updateBody);
  await doctor.save();
  return doctor;
};

const uploadProfilePicture = async (image) => {
  const result = await cloudinary.uploader.upload(image, {
    public_id: `${Date.now()}`,
    resource_type: "auto",
  });

  return {
    public_id: result.public_id,
    url: result.secure_url,
  };
};

const getDoctorById = async (id) => {
  return Doctor.findById(id);
};

const getDoctorPatientsCount = async (doctorId) => {
  const match = {
    $match: {
      doctor: new mongoose.Types.ObjectId(doctorId),
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
  ]);

  return uniquePatientCount[0]?.uniquePatientCount || 0;
};

module.exports = {
  updateDoctorById,
  uploadProfilePicture,
  getAllDoctors,
  getDoctorById,
  getDoctorPatientsCount,
};
