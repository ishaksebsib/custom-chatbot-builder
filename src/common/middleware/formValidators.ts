import { body } from "express-validator";

const signUpValidator = [
	body("firstName").notEmpty().withMessage("First name is required"),
	body("lastName").notEmpty().withMessage("Last name is required"),
	body("email").isEmail().withMessage("Invalid email"),
	body("password")
		.isLength({ min: 8 })
		.withMessage("Password must be at least 8 characters"),
	body("password")
		.matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
		.withMessage(
			"Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
		),
];

const signInValidator = [
	body("email").isEmail().withMessage("Invalid email"),
	body("password").notEmpty().withMessage("Password is required"),
];

export { signUpValidator, signInValidator };
