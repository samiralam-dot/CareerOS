import Notification from "../model/Notification.js";
import User from "../model/user.js";



export const createNotification = async (req, res) => {

    try {

        const { title, message, userId } = req.body;
        console.log("Received notification data:", { title, message, userId });


       
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

      
        const notification = await Notification.create({
            title,
            message
        });

      
        user.Notifications.push(notification._id);

        await user.save();

        res.status(201).json({
            success: true,
            message: "Notification created successfully",
            notification
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            
            message: error.message
        });

    }

};

export const updateNotification = async (req, res) => {

    try {

        const { id } = req.params;

        const { title, message } = req.body;

const notification = await Notification.findByIdAndUpdate(
  id,
  {
    $set: {
      read: true,
      readAt: new Date(),
      expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      ...(title && { title }),
      ...(message && { message })
    }
  },
  {
    returnDocument: "after"   
  }
);
  
        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }


        if (title) {
            notification.title = title;
        }

        if (message) {
            notification.message = message;
        }

        await notification.save();

        res.status(200).json({
            success: true,
            message: "Notification updated successfully",
            notification
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};