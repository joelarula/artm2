// vue.config.js
module.exports = {
		assetsDir:"assets",
		pages: {
		    main: {
		    	entry: 'src/main.js',
		    	template: 'public/index.html',
		    	filename: 'index.html',
		    	title: 'Artmoments',
		    	chunks: ['chunk-vendors', 'chunk-common', 'main']
		    },
		    admin: {
		    	entry: 'src/admin.js',
			    template: 'public/index.html',
			    filename: 'admin/index.html',
			    title: 'Artmoments Admin',
			    chunks: ['chunk-vendors', 'chunk-common', 'admin']
		    }
		}
}