nametagger.fma: clean *.html js/*.js css/*.css cutouts/*.svg fonts/*.ttf icon.png package.json
	zip nametagger.fma *.html js/*.js css/*.css cutouts/*.svg fonts/*.ttf icon.png package.json

.PHONY: clean

clean:
	rm -rf nametagger.fma
