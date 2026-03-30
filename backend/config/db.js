const mongoose = require("mongoose");

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

module.exports = {
  connectDB: async () => {
    if (cached.conn) {
      return cached.conn;
    }
    if (!cached.promise) {
      const opts = {
        bufferCommands: false,
      };
      cached.promise = mongoose
        .connect(`${process.env.MONGODB_URI}/vehicle_booking`, opts)
        .then((mongoose) => {
          console.log("MongoDB connected successfully");
          return mongoose;
          
        });
    }
    cached.con = await cached.promise;
  },
};
