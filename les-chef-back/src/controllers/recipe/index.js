/**
 * 레시피 관련 컨트롤러 통합 export
 */

const { createOrUpdate } = require('./createOrUpdate');
const { toggleWish } = require('./toggleWish');
const { removeRecipe } = require('./remove');
const { listRecipes, myList, wishList, recipeInfo } = require('./read');

module.exports = {
    createOrUpdate,
    toggleWish,
    removeRecipe,
    listRecipes,
    myList,
    wishList,
    recipeInfo,
};

