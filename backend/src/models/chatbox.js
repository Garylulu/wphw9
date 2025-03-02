import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ChatBoxSchema = new Schema({
	name: {
		type: String,
		required: [true, 'Name field is required.']
	},
	messages: []
});
const ChatBoxModel = mongoose.model('ChatBox', ChatBoxSchema);

export { ChatBoxModel };