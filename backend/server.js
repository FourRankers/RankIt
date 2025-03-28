const express = require('express')
const cors = require('cors')
const auth = require('./routes/auth')
const posts = require('./routes/posts')
const userRouter = require('./routes/user')

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', auth.router)
app.use('/api/posts', posts)
app.use('/api/users', userRouter)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

app.listen(PORT, () => {
  console.log(`RankIt backend running at port ${PORT}`)
})
