module.exports = (mongoose) => {
    mongoose.connect('mongodb://localhost/ChatSystem', { useNewUrlParser: true, useUnifiedTopology: true });
    mongoose.connection.on('open', () => {
        console.log('MongoDB: Connected');
    });
    mongoose.connection.on('error', (err) => {
        console.log('MongoDB Connection error:', err);
    });
}