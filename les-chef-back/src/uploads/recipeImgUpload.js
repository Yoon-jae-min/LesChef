const multer = require('multer');
const path = require('path');

const categoryTrans = (category) => {
    switch (category) {
        case '한식':
            return 'korean';
        case '일식':
            return 'japanese';
        case '중식':
            return 'chinese';
        case '양식':
            return 'western';
        case '기타':    
            return 'other';
        default:
            break;
    }
}

const recipeImgStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const {majorCategory} = req.body.recipeInfo;
        const category = categoryTrans(majorCategory);

        cb(null, path.join(__dirname, `../../public/Image/RecipeImage/ListImg/${category}`));  // 파일이 저장될 경로
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);  // 고유 파일 이름
    }
});

const recipeStepImgStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const {majorCategory} = req.body.recipeInfo;
        const category = categoryTrans(majorCategory);

        cb(null, path.join(__dirname, `../../public/Image/RecipeImage/InfoImg/step/${category}`));  // 파일이 저장될 경로
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);  // 고유 파일 이름
    }
});

const recipeImgUpload = multer({ storage: recipeImgStorage }).single('recipeImgFile');
const recipeStepImgUpload = multer({ storage: recipeStepImgStorage }).array('recipeStepImgFiles');

module.exports = { recipeImgUpload, recipeStepImgUpload };