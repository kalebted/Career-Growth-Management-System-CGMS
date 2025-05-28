import Company from "../models/Company.js";

// CREATE
export const createCompany = async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({ message: "Only recruiters can create companies" });
    }

    const existingCompany = await Company.findOne({ recruiter: req.user.id });
    if (existingCompany) {
      return res.status(409).json({
        message: "A company already exists for this recruiter.",
        company: existingCompany
      });
    }

    const logoPath = req.file ? `/assets/logos/${req.file.filename}` : null;

    const parseJSON = (input, fallback) => {
      try {
        return typeof input === "string" ? JSON.parse(input) : input || fallback;
      } catch {
        return fallback;
      }
    };

    const contacts = parseJSON(req.body["contacts"], {});
    const locations = req.body["locations"]
      ? req.body["locations"].split(",").map(loc => loc.trim()).join(", ")
      : "";

    const founded_date = req.body["founded_date"];
    const employees_count = req.body["employees_count"];
    const parsedFoundedDate = founded_date && !isNaN(Date.parse(founded_date))
      ? new Date(founded_date)
      : undefined;
    const parsedEmployeesCount = !isNaN(employees_count)
      ? Number(employees_count)
      : undefined;

    const company = new Company({
      name: req.body["name"],
      industry: req.body["industry"],
      profile: req.body["profile"],
      description: req.body["description"],
      contacts,
      locations,
      website: req.body["website"],
      founded_date: parsedFoundedDate,
      employees_count: parsedEmployeesCount,
      logo: logoPath,
      recruiter: req.user.id,
    });

    await company.save();

    res.status(201).json({ message: "Company created", company });
  } catch (err) {
    console.error("❌ Company creation failed:", err);

    if (err.name === 'ValidationError') {
      const fieldErrors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({
        message: "Validation failed",
        errors: fieldErrors
      });
    }

    res.status(500).json({ message: "Failed to create company", error: err.message });
  }
};

// READ
export const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find().sort({ created_at: -1 });
    res.json(companies);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch companies", error: err.message });
  }
};

export const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.json(company);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch company", error: err.message });
  }
};

export const getCompaniesByRecruiter = async (req, res) => {
  try {
    const companies = await Company.find({ recruiter: req.user.id }).sort({ created_at: -1 });
    res.json(companies);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch recruiter companies", error: err.message });
  }
};

// UPDATE
export const updateCompany = async (req, res) => {
  try {
    const updates = { ...req.body };

    if (req.file) {
      updates.logo = `/assets/logos/${req.file.filename}`;
    }

    if (updates.locations) {
      updates.locations = updates.locations.split(",").map(loc => loc.trim()).join(", ");
    }

    if (updates.founded_date && !isNaN(Date.parse(updates.founded_date))) {
      updates.founded_date = new Date(updates.founded_date);
    }

    if (updates.employees_count && !isNaN(updates.employees_count)) {
      updates.employees_count = Number(updates.employees_count);
    }

    const company = await Company.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true  // 🔑 force validation to run on updates
    });

    if (!company) return res.status(404).json({ message: "Company not found" });
    res.json({ message: "Company updated", company });
  } catch (err) {
    console.error("❌ Company update failed:", err);

    if (err.name === 'ValidationError') {
      const fieldErrors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({
        message: "Validation failed",
        errors: fieldErrors
      });
    }

    res.status(500).json({ message: "Failed to update company", error: err.message });
  }
};

// DELETE
export const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.json({ message: "Company deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete company", error: err.message });
  }
};
