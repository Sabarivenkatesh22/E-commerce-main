const User = require("./../../models/userRole/user")
const validationerror = require("../../middleware/validationError");

const { v4: uuidv4 } = require('uuid')
const moment = require("moment")

class UserUpdateController {

    async editUserDetails(req, res){

        var userId = req.params.userId;

        if(userId == req.auth.userId){

            let user = await User.findOne({ userId: userId});
            if (user == null) {
                res.status(400).json(new validationerror("Process Failed, User not found", 400));
            }

            var firstname = req.body.firstname || user.firstname;
            var lastname = req.body.lastname || user.lastname;
            var contactNumber = req.body.contactNumber || user.contactNumber;

            user.firstname = firstname;
            user.lastname = lastname;
            user.contactNumber = contactNumber;
            user.updatedAt = moment(Date.now()).unix();
            await user.save();

            return res.status(200).json({"message":"ok"})

        } else {
            res.status(401).json(new validationerror("Process Failed, Unauthorized", 401));
        }

    };

    async deleteUser(req,res,next){
        let userId = req.params.userId;
        // const delFood =  await foodData.findByIdAndDelete(req.params.id);
        const delFood =  await User.deleteMany({userId});
        if(!delFood)
        {
            return next(new validationerror('No food found with that ID', 404));
        }
         res.send("Done");

}

}

const userUpdateController = new UserUpdateController()
module.exports = userUpdateController
