
const { db,asyncMiddleware, commonFunctions } = global
const csvFilePath='../../../../client/assets/csvfile.csv'
const csv=require('csvtojson')

module.exports = function (router) {

  router.get('/', asyncMiddleware(async(req, res, next) => {
    
    let user = await db.Users.findOne({ where: { email: 'sajjad@gmail.com' } });
      if (!user) {
        user = await db.Users.create({
          email: 'sajad@gmail.com',
          firstName: 'ghulam',
          lastName: 'sajjad'
        })
      }
      let token = commonFunctions.createToken({
            id: user.id,
            email: user.email,
            model: 'Users'
          });

      res.http200({
        user: user,
        token:token
      })


    
  }));

  router.get('/read-csv', asyncMiddleware(async(req, res, next) => {
    
    const jsonArray=await csv().fromFile(csvFilePath);
    
    const cleanData = csvDataCleaner(jsonArray);
  
  }));

  function csvDataCleaner(data) {
    console.log(data)
  }

};






