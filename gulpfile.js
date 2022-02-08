const { src, dest, parallel, watch } = require('gulp');
const browserSyncServer = require('browser-sync').create();
const sass = require('gulp-sass')(require('sass'));
const mimifyCSS = require('gulp-clean-css');
const autoPrefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');

function browsersync() {
    browserSyncServer.init({
        server: { baseDir: 'app/' },
        notify: false,
        online: true,
    })
}

exports.browsersync = browsersync;

function compileSCSS() {
    return src('app/scss/**/*')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoPrefixer({ overrideBrowserslist: ['last 10 version'] }))
    .pipe(mimifyCSS( { level: { 1: { specialComments: 0 } } , format: 'beautify' } ))
    .pipe(rename({suffix: '.min'}))
    .pipe(dest('app/css/'))
    .pipe(browserSyncServer.stream());
}

exports.compileSCSS = compileSCSS;

function images() {
    return src('app/images/src/**/*')
    .pipe(imagemin())
    .pipe(dest('app/images/dest/'))
}

exports.images = images;

function startwatch() {
	watch('app/scss/**/*.scss', compileSCSS);
    watch('app/*.html').on('change', browserSyncServer.reload);
    watch('app/images/src/**/*', images);
}

exports.startwatch = startwatch;

exports.default = parallel(compileSCSS, images, browsersync, startwatch);
