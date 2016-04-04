fabmo-nametagger-app.fma: clean cutouts/* *.html js/libs/*.js js/*.js css/*.css cutouts/*.svg fonts/*.ttf icon.png package.json
	zip fabmo-nametagger-app.fma cutouts/* *.html js/libs/*.js js/*.js css/*.css cutouts/*.svg fonts/*.ttf icon.png package.json

.PHONY: clean

clean:
	rm -rf fabmo-nametagger-app.fma
