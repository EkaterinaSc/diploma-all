import ApiError from "../errors/api-errors.mjs";

const errFunction = (err, req, res, next) => {
    console.log('err', err);
    if (err instanceof ApiError) {
        return res.status(err.status).json({message: err.message, errors: err.errors});
    } else {
        return res.status(500).json({message: "Непредвиденная ошибка"});
    }
  }

export default errFunction;