const fs = require('fs')
const http = require('http')
const gulp = require('gulp')
const es = require('ecstatic')
const pug = require('pug')
const fecha = require('fecha')
const marked = require('marked')
const highlight = require('highlight.js')
const through = require('through2')
const sass = require('gulp-sass')
const gpug = require('gulp-pug')
const reload = require('gulp-livereload')
const rename = require('gulp-rename')
const cssmin = require('gulp-clean-css')
const prefixer = require('gulp-autoprefixer')
const autowatch = require('gulp-autowatch')

const siteConfig = require('./src/config.json')

pug.filters.markdown = (string) => {
  if (string.substr(-3) === '.md') {
    string = fs.readFileSync(string, 'utf8')
  }
  const renderer = new marked.Renderer()
  renderer.code = (text, lang) => {
    text = highlight.highlightAuto(text).value
    return '<div class="markdown-code"><pre><code class="lang-' + lang + '">' + text + '</code></pre></div>'
  }
  marked.setOptions({
    renderer: renderer,
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    // highlight: (code) => highlight.highlightAuto(code).value
  })
  return marked(string)
}

const config = {
  port: 5000,
  paths: {
    js: './src/**/*.js',
    pug: [ './src/**/*.pug', '!./src/**/_*.pug', './src/**/*.md' ],
    sass: './src/**/*.sass',
    images: ['./src/**/*.jpg', './src/**/*.svg', './src/**/*.png'],
    pages: ['./src/pages/**/index.json']
  },
  src: {
    js: './src/**.*.js',
    pug: [ './src/**/*.pug', '!./src/**/_*.pug' ],
    sass: './src/index.sass'
  },
  dist: './'
}

gulp.task('js', (cb) => {
  cb()
})

gulp.task('pages', () => {
  const pages = []
  return gulp.src(config.paths.pages)
    .pipe(((opts) => {
      return through.obj((file, inc, cb) => {
        const page = JSON.parse(String(file.contents))
        page.path = file.dirname.substr(file.dirname.lastIndexOf('/') + 1)
        page.image = '/pages/' + page.path + '/' + page.image
        const date = new Date(JSON.parse(file.contents).date)
        page.date = fecha.format(date, 'MMM Do, YYYY')
        pages.push(page)
        cb(null, file)
      })
      .on('end', () => {
        siteConfig.pages = pages
        const prettyJson = JSON.stringify(siteConfig, null, 2)
        fs.writeFileSync('./src/config.json', prettyJson)
      })
    })())
})

gulp.task('pug', gulp.series(['pages'], () => {
  return gulp.src(config.src.pug)
    .pipe(gpug({
      pug,
      locals: siteConfig
    }))
    .pipe(rename(function (path) {
      if (path.basename !== 'index') {
        path.dirname  = path.dirname + '/' + path.basename
        path.basename = 'index'
      }
    }))
    .pipe(gulp.dest(config.dist))
    .pipe(reload())
}))
gulp.task('sass', () => {
  return gulp.src(config.src.sass)
    .pipe(sass())
    .pipe(prefixer({
      browsers: ['last 4 versions'],
      cascade: false
    }))
    .pipe(cssmin())
    .pipe(gulp.dest(config.dist))
    .pipe(reload())
})

gulp.task('images', () => {
  return gulp.src(config.paths.images)
    .pipe(gulp.dest(config.dist))
    .pipe(reload())
})

gulp.task('server', (cb) => {
  const server = http.createServer(es({ root: config.dist }))
  server.listen(config.port, cb)
  console.log('Starting server on port', config.port)
})

gulp.task('watch', (cb) => {
  reload.listen()
  autowatch(gulp, config.paths)
  cb()
})

gulp.task('build', gulp.parallel(Object.keys(config.paths)))
gulp.task('default', gulp.series(['server', 'watch', 'build']))
