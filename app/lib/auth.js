const { db, commonFunctions } = global;

module.exports = function () {
  return async function(req, res, next) {

    if (!req.headers.authorization) {
      return res.http401('Authorization header missing');
    } else {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = await commonFunctions.decodeAPiToken(token);
        if (!decoded) {
          return res.http401('Invalid token');
        }

        

        const user = await db[decoded.model].findOne({

          where: {
            id: decoded.id,
            deletedAt: null
          }
        });

        

        if (!user) {
          return res.http401('Invalid token');

        }
        req.user = user;
        next();
      } catch (error) {
        global.log.error(error);
        return res.http401('Invalid token');
      }
    }

  }
};
