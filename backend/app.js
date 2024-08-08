// Importing required modules
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const app = express();
const nodemailer = require('nodemailer');

// Models
const mongoose = require('mongoose');
const User = require('./models/user');
const Product = require('./models/product');
const Cart = require('./models/cart')

//?Nodemailer is a module for Node.js applications to allow easy email sending
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'farah.hashmi13sk@gmail.com',
    pass: 'eoli rtef xfqb vorg',
  }
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect('mongodb+srv://farahhashmi13sk:sag1yluM8pUlafjC@cluster0.vlsff.mongodb.net/BlossomBazarNew?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => {
    console.log('Connected to database');
  })
  .catch((err) => {
    console.error('Connection failed:', err);
  });

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

// Helper function to format date
function formatDate(date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${formattedHours}:${formattedMinutes} ${ampm}`;
}

// API endpoints

// API to get all users
app.get('/api/bb/user/get/all', (req, res) => {
  User.find()
    .then((users) => {
      res.status(200).json({
        message: 'All users fetched successfully',
        allUser: users
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: 'Error fetching users',
        error: err
      });
    });
});

// API to register as seller
app.post('/api/bb/user/register/seller', (req, res) => {
  const userToAdd = new User({
    ...req.body,
    role: 'Seller'
  });

  userToAdd.save()
    .then((user) => {
      res.status(200).json({
        message: 'User added as seller successfully',
        user
      });
    })
    .catch((err) => {
      res.status(400).json({
        error: err
      });
    });
});

// API to register as buyer
app.post('/api/bb/user/register/buyer', (req, res) => {
  const userToAdd = new User({
    ...req.body,
    role: 'Buyer'
  });

  userToAdd.save()
    .then((user) => {
      res.status(200).json({
        message: 'User added as buyer successfully',
        user
      });
    })
    .catch((err) => {
      res.status(400).json({
        error: err
      });
    });
});

// Endpoint to get user by id
app.get('/api/user/get/id/:id', (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user) {
        res.status(200).json({
          message: 'User fetched by ID successfully',
          user
        });
      } else {
        res.status(404).json({
          message: 'User not found'
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err
      });
    });
});

// API for login
app.post('/api/user/login', (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        if (user.password === req.body.password) {
          res.status(200).json({
            message: 'Login successful',
            userExist: true,
            correctPassword: true,
            userRole: user.role,
            user_id: user._id,
            user_name: `${user.firstName} ${user.lastName}`,
          });
        } else {
          res.status(200).json({
            message: 'Wrong password',
            userExist: true,
            correctPassword: false
          });
        }
      } else {
        res.status(200).json({
          message: 'User does not exist',
          userExist: false,
          correctPassword: false
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err
      });
    });
});

// Upload profile pic
app.post('/api/bb/upload/profilePic/:id', (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user) {
        user.profilePhoto = req.body.profilePhoto;
        return user.save();
      } else {
        res.status(404).json({
          message: 'User not found'
        });
      }
    })
    .then((user) => {
      res.status(200).json({
        message: 'Successfully added profile pic',
        user
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err
      });
    });
});

// Get profile photo
app.get('/api/bb/get/profilePic/:id', (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user) {
        res.status(200).json({
          message: 'Fetched profile pic successfully',
          profilePic: user.profilePhoto
        });
      } else {
        res.status(404).json({
          message: 'User not found'
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err
      });
    });
});

// Edit user info
app.post('/api/bb/edit/user/:id', (req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((user) => {
      if (user) {
        res.status(200).json({
          message: 'User info edited successfully',
          userInfo: user
        });
      } else {
        res.status(404).json({
          message: 'User not found'
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err
      });
    });
});

// Delete user
app.delete('/api/bb/delete/user/:id', (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then((user) => {
      if (user) {
        res.status(200).json({
          message: 'User deleted successfully'
        });
      } else {
        res.status(404).json({
          message: 'User not found'
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err
      });
    });
});

// Add product
app.post('/api/bb/product/add', (req, res) => {
  const newProduct = new Product({
    ...req.body,
    createdOn: new Date()
  });

  newProduct.save()
    .then((product) => {
      res.status(200).json({
        message: 'Product added successfully',
        product
      });
    })
    .catch((err) => {
      res.status(400).json({
        error: err
      });
    });
});

// Get all products
app.get('/api/bb/product/get-all', (req, res) => {
  Product.find()
    .then((products) => {
      res.status(200).json({
        message: 'All products fetched successfully',
        allProduct: products
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: 'Error fetching products',
        error: err
      });
    });
});

// Delete product
app.delete('/api/bb/product/delete/:id', (req, res) => {
  Product.findByIdAndDelete(req.params.id)
    .then((product) => {
      if (product) {
        res.status(200).json({
          message: 'Product deleted successfully'
        });
      } else {
        res.status(404).json({
          message: 'Product not found'
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err
      });
    });
});

// Edit product
app.post('/api/bb/product/edit/:id', (req, res) => {
  Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((product) => {
      if (product) {
        res.status(200).json({
          message: 'Product edited successfully',
          product
        });
      } else {
        res.status(404).json({
          message: 'Product not found'
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err
      });
    });
});

// Add product to cart
app.post('/api/bb/cart/add/:id', (req, res) => {
  Product.findById(req.params.id)
    .then((product) => {
      if (product) {
        const cartProduct = new Cart({
          productId: product._id,
          customer_id : req.body.customer_id,
          productDetail: {
            productName: product.productName,
            productPrice: product.productPrice,
            productQuantity: product.productQuantity,
            productImage: product.productImage
          }
        });

        return cartProduct.save();
      } else {
        res.status(404).json({
          message: 'Product not found'
        });
      }
    })
    .then(() => {
      res.status(200).json({
        message: 'Product added to cart'
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err
      });
    });
});

// Get all cart products
app.get('/api/bb/cart/get-all', (req, res) => {
  Cart.find()
    .then((cartProducts) => {
      res.status(200).json({
        message: 'All cart products fetched successfully',
        cartProducts
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: 'Error fetching cart products',
        error: err
      });
    });
});
// Get all cart products of customer_id
app.get('/api/bb/cart/get/:id', (req, res) => {
  Cart.find({customer_id: req.params.id})
    .then((cartProducts) => {
      res.status(200).json({
        message: 'All cart products fetched successfully',
        cartProducts
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: 'Error fetching cart products',
        error: err
      });
    });
});

// Delete cart product
app.delete('/api/bb/cart/delete/:id', (req, res) => {
  Cart.findByIdAndDelete(req.params.id)
    .then((cartProduct) => {
      if (cartProduct) {
        res.status(200).json({
          message: 'Cart product deleted successfully'
        });
      } else {
        res.status(404).json({
          message: 'Cart product not found'
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err
      });
    });
});

// Delete all cart products
app.delete('/api/bb/cart/delete-all', (req, res) => {
  Cart.deleteMany()
    .then(() => {
      res.status(200).json({
        message: 'All cart products deleted'
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err
      });
    });
});


function sendOTPEmail(toEmail, otp) {
  let mailOptions = {
      from: '"Blossom Bazar" <your-email@gmail.com>',
      to: toEmail,
      subject: 'Your Blossom Bazar OTP Code',
      html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h2 style="color: #5A67D8;">Blossom Bazar</h2>
              <p>Dear Customer,</p>
              <p>Thank you for choosing Blossom Bazar. To complete your Registration, please use the following One-Time Password (OTP):</p>
              <p style="font-size: 20px; font-weight: bold; color: #FF5733;">${otp}</p>
              <p>Please do not share this code with anyone.</p>
              <p>If you did not request this OTP, please contact our support team immediately.</p>
              <p>Best regards,</p>
              <p>Blossom Bazar Team</p>
              <hr>
              <p style="font-size: 12px; color: #888;">If you have any questions, feel free to reply to this email or contact our support team at support@blossombazar.com.</p>
          </div>
      `
  };

  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('OTP email sent: %s', info.messageId);
  });
}
//----- to generate email--------------
app.post('/api/bb/email/otp', (req, res, next) => {
  let email = req.body.email;
  let otp = req.body.otp
 sendOTPEmail(email,otp)
})

module.exports = app;
