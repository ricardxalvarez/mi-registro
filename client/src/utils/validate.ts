import Joi from 'joi';

const validate = (schema: any, compare: any, returnError?: boolean) => {
  const { value, error } = Joi.compile(schema)
    .prefs({ errors: { label: 'key' } })
    .validate(compare);
  if (error) {
    console.log(error.details);
    const errorMessage = error.details[0].message;
    if (returnError) {
        throw new Error(errorMessage)
    }
    return false
  }
  Object.assign(compare, value);
  return true;
};

export default validate;