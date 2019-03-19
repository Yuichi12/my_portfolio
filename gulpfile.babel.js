import gulp from 'gulp';
import sass from 'gulp-sass';
import changed from 'gulp-changed';
import browser from 'browser-sync';
import autoprefixer from 'gulp-autoprefixer';
import plumber from 'gulp-plumber';
import sourcemaps from 'gulp-sourcemaps';
import source from 'vinyl-source-stream';
import imagemin from 'gulp-imagemin';
import svgmin from 'gulp-svgmin';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
import progeny from 'gulp-progeny';
import webpackConfig from './webpack.config.js';
import webpack from 'webpack-stream';
import notify from 'gulp-notify';
import eslint from 'gulp-eslint';

// webサーバーを立ち上げる
gulp.task('server', function () {
  browser({
    // proxy: 'localhost:8888
    server: {
      baseDir: './',
      index: 'index.html'
    }
  });
});

// ブラウザをリロードする
gulp.task('reload', function () {
  browser.reload();
});

// sassをコンパイルしてリロードする
gulp.task('sass', function () {
  gulp.src('./src/scss/**/*.scss')
    .pipe(plumber())
    .pipe(progeny())
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'expanded'
    }))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('./maps/'))
    .pipe(gulp.dest('./dist/css/'))
    .pipe(browser.reload({
      stream: true
    }));
});

// jsファイルを結合する
gulp.task('build', function () {
  gulp.src('src/js/app.js')
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%=error.message%>')
    }))
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('dist/js/'))
    .pipe(browser.reload({
      stream: true
    }));
});

// jsファイルを圧縮してリロードする
gulp.task('uglify', function () {
  gulp.src(['./dist/js/bundle.js', '!./dist/js/min/'])
    .pipe(plumber())
    .pipe(uglify())
    .pipe(rename('bundle.min.js'))
    .pipe(gulp.dest('./dist/js/min'))
    .pipe(browser.reload({
      stream: true
    }));
});

// 画像を圧縮する
gulp.task('imagemin', function () {
  gulp.src('./src/img/*.+(jpg|jpeg|png|gif)')
    .pipe(changed('./dist/img/'))
    .pipe(imagemin([
        imagemin.gifsicle({
        interlaced: true
      }),
        imagemin.jpegtran({
        progressive: true
      }),
        imagemin.optipng({
        optimizationlevel: 5
      })
    ]))
    .pipe(gulp.dest('./dist/img/'))
    .pipe(browser.reload({
      stream: true
    }));

  // svgファイルの圧縮
  gulp.src('./src/img/*.svg')
    .pipe(changed('./dist/img/'))
    .pipe(svgmin())
    .pipe(gulp.dest('./dist/img/'))
    .pipe(browser.reload({
      stream: true
    }));
});

// eslint
gulp.task('eslint', function () {
  gulp.src(['src/**/*.js'])
    .pipe(plumber({
      // エラーをハンドル
      errorHandler: function (error) {
        const taskName = 'eslint';
        const title = '[task]' + taskName + ' ' + error.plugin;
        const errorMsg = 'error: ' + error.message;
        // ターミナルにエラーを出力
        console.log(title + '\n' + errorMsg);
        // エラーを通知
        notify.onError({
          title: title,
          message: errorMsg,
          time: 3000
        });
      }
    }))
    .pipe(eslint({
      useEslintrc: true
    }))
    .pipe(eslint.format())
    .pipe(eslint.failOnError())
    .pipe(plumber.stop());
});

// gulpを使ったファイルの監視
gulp.task('default', ['server'], function () {
  gulp.watch('**/*.html', ['reload']);
  gulp.watch('**/*.php', ['reload']);
  gulp.watch('src/scss/**/*.scss', ['sass']);
  gulp.watch('src/js/**/*.js', ['build']);
  gulp.watch('dist/js/bundle.js', ['uglify']);
  gulp.watch('src/img/**/*.+(jpg|jpeg|png|gif|svg)', ['imagemin']);
  gulp.watch('src/**/*.js', ['eslint']);
});
