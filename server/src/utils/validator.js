import validator from "validator";

/**
 * Validates user input.
 * @param {Object} userData - User details.
 * @throws {Error} If validation fails.
 */
export function validateUserData(userData) {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      dob,
      gender,
      address,
      role,
    } = userData;
  
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !phone ||
      !dob ||
      !gender ||
      !address ||
      !role
    ) {
      throw new Error("All fields are required");
    }
  
    if (!validator.isEmail(email)) {
      throw new Error("Invalid email format");
    }
  
    if (!validator.isStrongPassword(password, { minLength: 8, minNumbers: 1 })) {
      throw new Error(
        "Password must be at least 8 characters long and include a number"
      );
    }
  
    if (!validator.isMobilePhone(phone, "any", { strictMode: true })) {
      throw new Error("Invalid phone number");
    }
  
    if (!["M", "F", "O"].includes(gender.toUpperCase())) {
      throw new Error("Invalid gender value. Allowed: M, F, O");
    }
  }
  
  /**
   * Validate login data
   */
  export function validateLoginData(email,password) {  
      if (!email || !password) throw new Error("Email and password are required");
  
      if (!validator.isEmail(email)) throw new Error("Invalid email format");
  }