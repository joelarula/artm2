const express = require('express')
const app = express()
const port = 8081
const dir = process.cwd();

app.listen(port, () => console.log(`Shopkeeper app listening on port ${port}! in folder ${dir}`))

app.all('*', function (req, res, next) {
  
  console.log('Request in '+ req.path)
  var start = new Date()
  next() 
  console.log('Request '+ req.path + ' elapsed ' + (new Date() - start ) +' ms')
})


app.get('/', (req, res) => res.send('Shopkeeper'))

app.get('/categories', (req, res) => res.send('categories'))
app.post('/addCategory', (req, res) => res.send('addCategory'))
app.post('/removeCategory/:name', (req, res) => res.send('removeCategory'))

app.get('/authors', (req, res) => res.send('authors'))
app.post('/addAuthor', (req, res) => res.send('c'))
app.post('/removeAuthor', (req, res) => res.send('c'))

app.get('/products', (req, res) => res.send('c'))
app.get('/product/:name', (req, res) => res.send('c'))
app.post('/addProduct', (req, res) => res.send('c'))
app.post('/removeProduct/:name', (req, res) => res.send('c'))

app.get('/productPreview/:size/:name', (req, res) => res.send('c'))
app.post('/uploadPreview/:name', (req, res) => res.send('c'))

app.post('/orderCategory/:category/:position/:productId', (req, res) => res.send('c'))
