// vue.config.js
module.exports = {
		pages: {
		    index: {
		    	entry: 'src/main.js',
		    	template: 'public/index.html',
		    	filename: 'index.html',
		    	title: 'Artmoments',
		    	chunks: ['chunk-vendors', 'chunk-common', 'index']
		    },
		    index: {
		    	entry: 'src/admin.js',
			    template: 'public/index.html',
			    filename: 'admin.html',
			    title: 'Artmoments Admin',
			    chunks: ['chunk-vendors', 'chunk-common', 'admin']
		    },
		}
}