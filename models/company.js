module.exports = function(mongoose){
	var Schema = mongoose.Schema;
	var companySchema = new Schema({
		name: { type: String, unique: true },
		joined: { type: Date }
	});
	mongoose.model('Company', companySchema);
}