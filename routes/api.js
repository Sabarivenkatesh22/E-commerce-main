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
const emailController = require('../controller/emailController/emailController');
// const cart_2_List = require('../controller/user/cartList_2_Controller');
const DeliveryPageController = require('../controller/user/deliveryPageController');
const verificationController = require('../controller/user/verificationController');
//PRODUCT
const productAddController = require('../controller/product/productAddController')
const productEditController = require('../controller/product/productEditController')
const productUpdateController = require('../controller/product/productUpdateController')
const productImageController = require('../controller/product/productImageController')
const productViewController = require('../controller/product/productViewController')
const reviewController = require('../controller/product/reviewController')

// ADMIN
const adminController = require('../controller/admin/adminController');

// RAZORPAY
const razorPay = require('../utils/razorPay');

// SELLER
const SellerController = require('../controller/product/sellerController');

/*********Uploader************/
//PRODUCT IMAGE
const uploadImageProduct = require('../middleware/uploadImageProduct');
/*********Validators**********/
const { requireSignin, isAuth, restrictTo,checkProductId,checkUser,adminChecking, isAuthForAdmin, isAuthForSubAdmin, userVerification } = require('../middleware/authorized');
const { userById } = require('../middleware/checking');

/*********Routes**************/
//TEST
router.get("/test", testController.test);

//REGISTER
// router.post("/user/register", registerController.registerUser); //TESTED
// router.post("/dummypath/admin/register", registerController.registerUser); //TESTED
router.post("/buyer/register", registerController.registerUser);//TESTED
router.post("/seller/register", registerController.registerUser); //TESTED
router.post("/admin/register",registerController.registerUser);  // just for testing
router.post("/subAdmin/register",requireSignin, isAuthForAdmin,adminChecking('admin') ,registerController.registerUser); 
// router.post("/seller/verification", restrictTo("admin"), registerController.verifySeller);
// router.post("/seller/login", checkBuyerSeller("seller"), loginController.userLogin); 
// VERIFICATION
router.get("/user/verification/:token", emailController.checkToken);
// CHANGE EMAIL
router.post("/user/:userId/changeEmail",userById, requireSignin, isAuth, registerController.changeEmail);

// CHANGE PASSWORD
router.post("/user/:userId/changePassword",userVerification ,userById, requireSignin,isAuth, forgetPasswordController.changePassword);

// FORGETPASSWORD and resetpassword
router.post('/forgotPassword', forgetPasswordController.forgetPassword);
router.patch('/resetPassword/:token', forgetPasswordController.resetPassword);

//LOGIN
router.post("/user/login", checkUser("buyer"),loginController.userLogin); //TESTED
router.post("/seller/login", checkUser("seller"), loginController.userLogin); 
router.post("/admin1234/login", checkUser("admin"), loginController.userLogin); 
router.post("/subAdmin3456/login", checkUser("subAdmin"), loginController.userLogin); 
//router.post("/dummypath/admin/login", loginController.adminLogin); Add new login for admin panel and prevent admin role in above api
 
//USER-VIEW
router.get("/user/:userId/view", userVerification ,userById, requireSignin, isAuth, userViewController.userDetails);
router.get("/user/:userId/allUsers", userViewController.getAllUsers);
//router.get("/dummypath/admin/:userId/view", userVerification ,userById, requireSignin, isAuth, userViewController.userAdminDetails);

// ADMIN VERIFY SELLER

// Note: Admin should provide seller email to verify him nad also contactNumber and address as a 
// prof of verification
router.post("/admin/verifySeller",userVerification,requireSignin, isAuthForAdmin, adminChecking("admin"),adminController.verifySeller);
router.post("/subAdmin/:userId/verifySeller",userVerification,requireSignin, isAuthForSubAdmin, restrictTo("subAdmin"),adminController.verifySeller);  

//USER-UPDATE
router.post("/user/:userId/edit", userVerification ,userById, requireSignin, isAuth, userUpdateController.editUserDetails);
router.get("/user/:userId/deleteUser", userVerification ,userById, requireSignin, isAuth, userUpdateController.deleteUser);
//router.post("/dummypath/admin/:userId/edit", userVerification ,userById, requireSignin, isAuth, userUpdateController.editAdminDetails);

// WISHLIST 
router.patch("/user/:userId/updateWishlist", userVerification ,userById, requireSignin, isAuth, WishListController.updateWishList);
router.get("/user/:userId/getWishlist",userVerification ,userById, requireSignin, isAuth, WishListController.getWishList);
router.post("/user/:userId/createWishlist", userVerification ,userById, requireSignin, isAuth, WishListController.createWishList);
router.post("/user/:userId/deleteWishlist", userVerification ,userById, requireSignin, isAuth, WishListController.deleteWishList);

//  CARTLIST 
router.post("/user/:userId/updateCartlist", userVerification ,userById, requireSignin, isAuth,checkProductId, CartListController.updateCartList);
router.get("/user/:userId/getCartlist", userVerification ,userById, requireSignin, isAuth, CartListController.getCartList);
router.post("/user/:userId/createCartlist", userVerification ,userById, requireSignin, isAuth, CartListController.createCartList);
router.post("/user/:userId/deleteCartlist", userVerification ,userById, requireSignin, isAuth, CartListController.deleteCartList);

// DELIVERY PAGE 
router.post("/user/:userId/product/:productId/updateDeliveryItem", userVerification ,userById, requireSignin, isAuth, DeliveryPageController.updateDeliveryItem);
router.get("/user/:userId/getDeliveryPage", userVerification ,userById, requireSignin, isAuth, DeliveryPageController.getDeliveryPage);
router.post("/user/:userId/createDeliveryPage", userVerification ,userById, requireSignin, isAuth, DeliveryPageController.createDeliveryPage);
router.post("/user/:userId/deleteDeliveryItem", userVerification ,userById, requireSignin, isAuth, DeliveryPageController.deleteDeliveryItem);

//PRODUCT-ADD (only sellers permission)
router.post("/seller/:userId/product/add", userVerification ,userById, requireSignin, isAuth, restrictTo("seller"), productAddController.addProduct);

// PRODUCT VIEW 
router.get("/products/view", productViewController.allProducts);

//PRODUCT-EDIT (only sellers permission)
router.post("/seller/:userId/product/edit", userVerification ,userById, requireSignin, isAuth, restrictTo("seller"), productEditController.editProduct);
// https://tl-mode-secondary-backend.herokuapp.com/
// http://127.0.0.1:7000/

// PRODUCT-VIEW
router.get("/user/product/:productId", productViewController.productView);

// USER 
router.get("/user", userUpdateController.deleteUser);

// product delete

// router.get("/user/product", productUpdateController.deleteProduct);
// router.get("/user/delCartList", productUpdateController.deleteCartList);
// router.get("/user/delWishList", productUpdateController.deleteWishList);
// router.get("/user/deleteDeliveryPage", productUpdateController.deleteDeliveryPage);

//PRODUCT-UPDATE (only sellers permission)
router.post("/seller/:userId/product/update/quantity", userVerification ,userById, requireSignin, isAuth, restrictTo("seller"), productUpdateController.updateQuantityProduct);
router.post("/seller/:userId/product/update/price", userVerification ,userById, requireSignin, isAuth, restrictTo("seller"), productUpdateController.updatePriceProduct);
router.post("/seller/:userId/product/update/colour", userVerification ,userById, requireSignin, isAuth, restrictTo("seller"), productUpdateController.updateColourProduct);
router.post("/seller/:userId/product/update/add/points", userVerification ,userById, requireSignin, isAuth, restrictTo("seller"), productUpdateController.addPointsProduct);
router.post("/seller/:userId/product/update/points", userVerification ,userById, requireSignin, isAuth, restrictTo("seller"), productUpdateController.updatePointsProduct);
router.post("/seller/:userId/product/update/add/discount", userVerification ,userById, requireSignin, isAuth, restrictTo("seller"), productUpdateController.addDiscountProduct);
router.post("/seller/:userId/product/update/discount", userVerification ,userById, requireSignin, isAuth, restrictTo("seller"), productUpdateController.updateDiscountProduct);
//PRODUCT-IMAGE (only sellers permission except view image)
router.post("/seller/:userId/product/image/upload", uploadImageProduct.array('image[]'), productImageController.addImagesProduct);

// REVIEWS
router.post("/user/:userId/product/:productId/review/add", userVerification ,userById, requireSignin, isAuth, reviewController.addReview);
router.get("/user/:userId/product/:productId/review/delete", userVerification ,userById, requireSignin, isAuth, reviewController.delReview);
router.post("/user/:userId/product/:productId/review/update", userVerification ,userById, requireSignin, isAuth, reviewController.updateReview);
router.get("/user/:userId/review/getAllReview", userVerification ,userById, requireSignin, isAuth, reviewController.getAllReview);

// TEST Verification controller
router.post("/user/verify", verificationController.createUserVerifyToken);
router.get('/user/sendToken/:token', verificationController.verifyUser);

// RAZORPAY
router.get("/user/:userId/product/:productId/buyProduct", userVerification ,userById, requireSignin, isAuth, razorPay.sendOrderId);
router.post("/user/:userId/product/:productId/orderSuccessful",userVerification ,userById, requireSignin, isAuth, razorPay.orderSuccessful);
router.post("/user/:userId/product/:productId/orderFailed",userVerification ,userById, requireSignin, isAuth, razorPay.orderFailed);

// SELLER
router.get("/seller/:userId/products",userVerification ,userById, requireSignin, isAuth, restrictTo('seller'), SellerController.sellerProductDisplay);



/*********Exports*************/
module.exports = router
