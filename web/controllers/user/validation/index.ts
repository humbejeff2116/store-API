import { check } from 'express-validator'; 
  
  
 const signupValidation =  [ 
    check('email').notEmpty().withMessage('email is required'), 
    check('fullName').notEmpty().withMessage('fullName is required'), 
    check('password' ).notEmpty().withMessage('password field is required'), 
] 

 export default signupValidation;