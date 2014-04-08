module.exports = function(mongoose) {
	var Schema = mongoose.Schema;
	var startupSchema = new Schema({
		id: { type: String },
		hidden: { type: Boolean },
		community_profile: { type: Boolean },
		name: { type: String },
		angellist_url: { type: String },
	  logo_url: { type: String },
	  thumb_url: { type: String },
	  quality: { type: String },
	  product_desc: { type: String },
	  high_concept: { type: String },
	  follower_count: { type: String },
	  company_url: { type: String },
	  created_at: { type: Date },
	  updated_at: { type: Date },
	  twitter_url: { type: String },
	  blog_url: { type: String },
	  video_url: { type: String },
	  markets: [{
	  	id: { type: String },
      tag_type: { type: String },
      name: { type: String },
      display_name: { type: String },
      angellist_url: { type: String },
	  }],
	  locations: [{
	  	id: { type: String },
      tag_type: { type: String },
      name: { type: String },
      display_name: { type: String },
      angellist_url: { type: String },
	  }],
	  status: {
	  	message: { type: String },
	  	created_at: { type: Date }
	  },
	  screenshots: [{
	  	thumb: { type: String },
	  	original: { type: String }
	  }]
	});
	mongoose.model('Startup', startupSchema);
}