module.exports = (mongoose, URL) => {
    mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true });
    mongoose.connection.on('open', () => {
        console.log('MongoDB: Connected');
        console.log(URL);
    });
    mongoose.connection.on('error', (err) => {
        console.log('MongoDB Connection error:', err);
    });
}

// 'mongodb+srv://ortakUser:12345@cluster0.vzpif.mongodb.net/chat'