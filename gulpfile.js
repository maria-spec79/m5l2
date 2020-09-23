const gulp = require ('gulp');
const {src, dest, watch, series} = require ('gulp');
const imagemin = require ('gulp-imagemin');
const spritesmith = require ('gulp.spritesmith');
//const stylus = require ('gulp-stylus');
const htmlmin = require ('gulp-htmlmin');
//const concatCss = require ('gulp-concat-css');
const csso = require ('gulp-csso');

function iconscopy() {
	return src('src/icons/*.png')
	.pipe(dest('dist/icons'));
}

exports.iconscopy = iconscopy;

function optimage() {
	return src('src/images/*.png')
	.pipe(imagemin())
	.pipe(dest('dist/images'));
}

exports.optimage = optimage;

function createsprite() {
	let spriteData = src('dist/images/*.png')
	.pipe(spritesmith({
		imgName: 'pictures-sprite.png',
		imgPath: 'dist/images/pictures-sprite.png',
		cssName: 'pictures-sprite.css',
		algorithm: "left-right",
		padding: 5
	}));
	let stylStream = spriteData.img.pipe(dest('dist/images'));
	let imgStream = spriteData.css.pipe(dest('dist'));
	return (imgStream, stylStream);
}

exports.createsprite = createsprite;

function optcss() {
	return src('src/*.css')
	.pipe(csso())
	.pipe(dest('dist'));
}

exports.optcss = optcss;

function opthtml() {
	return src('src/*.html')
	.pipe(htmlmin({
		collapseWhitespace: true,
    	removeComments: true
	}))
	.pipe(dest('./'));
}

exports.opthtml = opthtml;

function watchfiles() {
	watch(['src/images/*.png'], series(optimage, createsprite));
	watch(['src/*.css'], optcss);
	watch(['src/*.html'], opthtml);
}

exports.default = watchfiles;