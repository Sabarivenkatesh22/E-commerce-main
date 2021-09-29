const express = require('express');
const router = express.Router()

/********Controller***********/
//TEST
const testController = require('../controller/testController')
//AUTHENTICATION
const registerController = require('../controller/authentication/registerController')
const loginController = require('../controller/authentication/loginController');
const forgetPasswordController = require('../controller/authentication/forgetPasswordController');
//USER
const userViewController = require('../controller/user/userViewController');
const userUpdateController = require('../controller/user/userUpdateController');
const WishListController = require('../controller/user/wishListController');
const CartListController = require('../controller/user/cartListController');
const cart_2_List = require('../controller/user/cartList_2_Controller');
const DeliveryPageController = require('../controller/user/deliveryPageController');
const verificationController = require('../controller/user/verificationController');
//PRODUCT
const productAddController = require('../controller/product/productAddController')
const productEditController = require('../controller/product/productEditController')
const productUpdateController = require('../controller/product/productUpdateController')
const productImageController = require('../controller/product/productImageController')
const productViewController = require('../controller/product/productViewController')
const reviewController = require('../controller/product/reviewController')

// RAZORPAY
const razorPay = require('../utils/razorPay');

// SELLER
const SellerController = require('../controller/product/sellerController');

/*********Uploader************/
//PRODUCT IMAGE
const uploadImageProduct = require('../middleware/uploadImageProduct');
/*********Validators**********/
const { requireSignin, isAuth, restrictTo } = require('../middleware/authorized');
const { userById } = require('../middleware/checking');

/*********Routes**************/
//TEST
router.get("/test", testController.test);

//REGISTER
// router.post("/user/register", registerController.registerUser); //TESTED
// router.post("/dummypath/admin/register", registerController.registerUser); //TESTED
router.post("/buyer/register", registerController.registerUser);//TESTED
router.post("/seller/register", registerController.registerUser); //TESTED
router.post("/seller/verification", restrictTo("admin"), registerController.verifySeller);
// VERIFICATION
router.get("/user/verification/:token", registerController.checkToken);

// FORGETPASSWORD and resetpassword
router.post('/forgotPassword', forgetPasswordController.forgetPassword);
router.patch('/resetPassword/:token', forgetPasswordController.resetPassword);

//LOGIN
router.post("/user/login", loginController.userLogin); //TESTED
//router.post("/dummypath/admin/login", loginController.adminLogin); Add new login for admin panel and prevent admin role in above api

//USER-VIEW
router.get("/user/:userId/view", userById, requireSignin, isAuth, userViewController.userDetails);
router.get("/user/:userId/allUsers", userViewController.getAllUsers);
//router.get("/dummypath/admin/:userId/view", userById, requireSignin, isAuth, userViewController.userAdminDetails);

//USER-UPDATE
router.post("/user/:userId/edit", userById, requireSignin, isAuth, userUpdateController.editUserDetails);
router.get("/user/:userId/deleteUser", userById, requireSignin, isAuth, userUpdateController.deleteUser);
//router.post("/dummypath/admin/:userId/edit", userById, requireSignin, isAuth, userUpdateController.editAdminDetails);

// WISHLIST 
router.patch("/user/:userId/updateWishlist", userById, requireSignin, isAuth, WishListController.updateWishList);
router.get("/user/:userId/getWishlist",userById, requireSignin, isAuth, WishListController.getWishList);
router.post("/user/:userId/createWishlist", userById, requireSignin, isAuth, WishListController.createWishList);
router.post("/user/:userId/deleteWishlist", userById, requireSignin, isAuth, WishListController.deleteWishList);

//  CARTLIST 
router.post("/user/:userId/updateCartlist", userById, requireSignin, isAuth, CartListController.updateCartList);
router.get("/user/:userId/getCartlist", userById, requireSignin, isAuth, CartListController.getCartList);
router.post("/user/:userId/createCartlist", userById, requireSignin, isAuth, CartListController.createCartList);
router.post("/user/:userId/deleteCartlist", userById, requireSignin, isAuth, CartListController.deleteCartList);

// DELIVERY PAGE 
router.post("/user/:userId/product/:productId/updateDeliveryItem", userById, requireSignin, isAuth, DeliveryPageController.updateDeliveryItem);
router.get("/user/:userId/getDeliveryPage", userById, requireSignin, isAuth, DeliveryPageController.getDeliveryPage);
router.post("/user/:userId/createDeliveryPage", userById, requireSignin, isAuth, DeliveryPageController.createDeliveryPage);
router.post("/user/:userId/deleteDeliveryItem", userById, requireSignin, isAuth, DeliveryPageController.deleteDeliveryItem);

//PRODUCT-ADD (only sellers permission)
router.post("/seller/:userId/product/add", userById, requireSignin, isAuth, restrictTo("seller"), productAddController.addProduct);

// PRODUCT VIEW 
router.get("/products/view", productViewController.allProducts);

//PRODUCT-EDIT (only sellers permission)
router.post("/seller/:userId/product/edit", userById, requireSignin, isAuth, restrictTo("seller"), productEditController.editProduct);
// https://tl-mode-secondary-backend.herokuapp.com/
// http://127.0.0.1:7000/

// PRODUCT-VIEW
router.get("/user/product/:productId", productViewController.productView);

//PRODUCT-UPDATE (only sellers permission)
router.post("/seller/:userId/product/update/quantity", userById, requireSignin, isAuth, restrictTo("seller"), productUpdateController.updateQuantityProduct);
router.post("/seller/:userId/product/update/price", userById, requireSignin, isAuth, restrictTo("seller"), productUpdateController.updatePriceProduct);
router.post("/seller/:userId/product/update/colour", userById, requireSignin, isAuth, restrictTo("seller"), productUpdateController.updateColourProduct);
router.post("/seller/:userId/product/update/add/points", userById, requireSignin, isAuth, restrictTo("seller"), productUpdateController.addPointsProduct);
router.post("/seller/:userId/product/update/points", userById, requireSignin, isAuth, restrictTo("seller"), productUpdateController.updatePointsProduct);
router.post("/seller/:userId/product/update/add/discount", userById, requireSignin, isAuth, restrictTo("seller"), productUpdateController.addDiscountProduct);
router.post("/seller/:userId/product/update/discount", userById, requireSignin, isAuth, restrictTo("seller"), productUpdateController.updateDiscountProduct);
//PRODUCT-IMAGE (only sellers permission except view image)
router.post("/seller/:userId/product/image/upload", uploadImageProduct.array('image[]'), productImageController.addImagesProduct);

// REVIEWS
router.post("/user/:userId/product/:productId/review/add", userById, requireSignin, isAuth, reviewController.addReview);
router.get("/user/:userId/product/:productId/review/delete", userById, requireSignin, isAuth, reviewController.delReview);
router.post("/user/:userId/product/:productId/review/update", userById, requireSignin, isAuth, reviewController.updateReview);
router.get("/user/:userId/review/getAllReview", userById, requireSignin, isAuth, reviewController.getAllReview);

// TEST Verification controller
router.post("/user/verify", verificationController.createUserVerifyToken);
router.get('/user/sendToken/:token', verificationController.verifyUser);

// RAZORPAY
router.post("/user/:userId/product/:productId/buyProduct", userById, requireSignin, isAuth, razorPay.sendOrderId);
router.post("/user/:userId/product/:productId/orderSuccessful",userById, requireSignin, isAuth, razorPay.orderSuccessful);
router.post("/user/:userId/product/:productId/orderFailed",userById, requireSignin, isAuth, razorPay.orderFailed);

// SELLER
router.get("/seller/:userId/products",userById, requireSignin, isAuth, restrictTo('seller'), SellerController.sellerProductDisplay);



/*********Exports*************/
module.exports = router
