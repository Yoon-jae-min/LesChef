/**
 * 레시피 찜하기 컨트롤러
 */

const asyncHandler = require("express-async-handler");
const User = require("../../models/user/userModel");
const RecipeWishList = require("../../models/recipe/recipeWishListModel");

const toggleWish = asyncHandler(async(req, res) => {
    // 세션 검증
    if (!req.session?.user?.id) {
        return res.status(401).json({
            error: true,
            message: "로그인이 필요합니다."
        });
    }

    const {recipeId} = req.body;
    
    if (!recipeId) {
        return res.status(400).json({
            error: true,
            message: "레시피 ID가 필요합니다."
        });
    }

    const user = await User.findOne({id: req.session.user.id});
    
    if (!user) {
        return res.status(404).json({
            error: true,
            message: "사용자를 찾을 수 없습니다."
        });
    }

    const wishList = await RecipeWishList.findOne({userId: user._id});
    let recipeWish = true;
    
    if(wishList){
        const exist = wishList.wishList.some(wish => wish.recipeId.toString() === recipeId.toString());

        await RecipeWishList.updateOne({userId: user._id},
            exist ?
                {$pull: {wishList: {recipeId: recipeId}}} :
                {$addToSet: {wishList: {recipeId: recipeId}}}
        );
        recipeWish = exist ? false : true;
    }else{
        await RecipeWishList.create({
            userId: user._id,
            wishList: [{
                recipeId: recipeId
            }]
        });
    }

    res.status(200).json({
        error: false,
        recipeWish: recipeWish
    });
});

module.exports = { toggleWish };

