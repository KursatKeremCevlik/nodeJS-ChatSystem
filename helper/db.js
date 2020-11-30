module.exports = (mongoose, URL, prm) => {
    if(prm){
        mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true });
        mongoose.connection.on('open', () => {
            console.log('MongoDB: Connected');
        });
        mongoose.connection.on('error', (err) => {
            console.log('MongoDB Connection error:', err);
        });
    }
}

// 'mongodb+srv://ortakUser:12345@cluster0.vzpif.mongodb.net/chat'