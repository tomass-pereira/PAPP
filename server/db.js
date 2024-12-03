const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://Admin:Jafoste12@cluster0.oizet.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
     
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Encerra o processo em caso de falha
  }
};

module.exports = connectDB;
