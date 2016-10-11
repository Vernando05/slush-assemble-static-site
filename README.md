# slush-assemble-static-site

> Slush generator for Assemble powered site.

## Prerequisite
 * npm
 * rubygems
 * bower

Install compass:  
```
$ gem i compass
```

Install latest bootstrap 3.x.x release:
```
$ gem i bootstrap-sass
```
## Usage
Install slush generator globally:
```sh
$ npm i -g slush-assemble-static-site
```
then
```
$ slush assemble-static-site
```
slush will try to install all of node and bower package for this project.
After it finished run:
```
$ gulp
```
above command will run default task such as initial css preprocessing, create server, watch, jshint, open browser, etc.
to see list of available task: 
```
$ gulp --tasks
```
Directory structure
```
.
+-- node_modules
+-- dist --> code distribution will placed here by gulp
+-- src --> your development directory
|   +-- components --> bower packages here
|   +-- fonts --> place your fonts here
|       +-- bootstrap
|   +-- images --> place your images here
|       +-- assets --> place your sprite here
|   +-- javascripts
|       +-- bootstrap
|       +-- bootstrap.js
|       +-- bootstrap.min.js
|       +-- bootstrap-sprockets.js
|       +-- main.js --> your main javascript code here
|   +-- layouts
|       +-- default.hbs --> default partial layouts here
|   +-- sass
|       +-- bootstrap
|           +-- _bootstrap-variables.scss
|           +-- _bootstrap-main.scss --> override bootstrap variable here
|           +-- styles.scss
|       +-- main
|           +-- _main.scss --> your main scss code here
|           +-- _responsive.scss --> your main responsive scss code here
|           +-- styles.scss
|   +-- stylesheets
|       +-- bootstrap-main.css --> processed bootstrap scss
|       +-- styles.css --> processed main scss
|   +-- index.hbs --> assemble pages
+-- package.json
+-- bower.json
+-- .bowerrc
+-- modernizr-config.json
+-- config.rb
+-- gulpfile.js
+-- .npmignore
```
## Contributing
Bug reports, pull requests and feature requests are submitted via issue tracker.

License
----

MIT

