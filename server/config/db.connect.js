const { default: mongoose } = require("mongoose");

const dbConnect = async () => {
  try {
    const connnect = await mongoose.connect(process.env.MONGODB_URL);

    // ready states being:
    // 0: disconnected
    // 1: connected
    // 2: connecting
    // 3: disconnecting
    if (connnect.connection.readyState === 1) {
      console.log("Connect database success");
    } else {
      console.log("Connect database connected");
    }
  } catch (error) {
    console.log("Connect database failed");
    throw new Error(error);
  }
};
module.exports = dbConnect;
