require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
});

const Blog = sequelize.define('Blog', {
  author: { type: DataTypes.STRING },
  url: { type: DataTypes.TEXT, allowNull: false },
  title: { type: DataTypes.TEXT, allowNull: false },
  likes: { type: DataTypes.INTEGER, defaultValue: 0 },
}, {
  tableName: 'blogs',   
  timestamps: false      
});

async function printBlogs() {
  try {
    await sequelize.authenticate();
    console.log('Database connected ✅');

    const blogs = await Blog.findAll();
    blogs.forEach(blog => {
      console.log(`${blog.author}: '${blog.title}', ${blog.likes} likes`);
    });

    await sequelize.close();
  } catch (err) {
    console.error('Error:', err);
  }
}

printBlogs();
