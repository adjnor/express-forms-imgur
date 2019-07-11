const express = require('express');
const app = express();
const multer = require('multer');
const upload = multer({
  dest: __dirname + '/uploads/',
});
app.use('/images', express.static(__dirname + '/uploads'));
let posts = [];
let h = (element, children) => {
  return (
    '<' +
    element +
    '>' +
    children.join('\n') +
    '</' +
    element.split().pop() +
    '>'
  );
};
let makePage = () => {
  let postElements = posts.map((post) => {
    return h('div', [
      h('h3', [post.title]),
      post.paths
        .map((path) => h(`img src="${path}" height="100px"`, []))
        .join(''),
      h('p', [post.desc]),
    ]);
  });
  return h('html', [
    h('body', [
      h('div', postElements),
      h('form action="/image" method="POST" enctype="multipart/form-data"', [
        h('input type="file" name="funny-images" multiple', []),
        h('label', ['Image url', h('input type="text" name="imgUrl"', [])]),
        h('label', ['Title', h('input type="text" name="title"', [])]),
        h('label', ['Description', h('input type="text" name="desc"', [])]),
        h('input type="submit"', []),
      ]),
      h('form action="/clear" method="POST"', [
        h('input type="submit" value="Clear posts"', []),
      ]),
    ]),
  ]);
};
app.get('/', (req, res) => {
  console.log('Request to / endpoint');
  res.send(makePage());
});
app.post('/image', upload.array('funny-images'), (req, res) => {
  const files = req.files;
  console.log('uploaded files', files);
  posts.push({
    paths:
      files.length > 0
        ? files.map((file) => `/images/${file.filename}`)
        : [req.body.imgUrl],
    title: req.body.title,
    desc: req.body.desc,
  });
  res.send(makePage());
});

app.post('/clear', (req, res) => {
  posts = [];
  res.send(makePage());
});

app.listen(4000, () => {
  console.log('server started');
});
