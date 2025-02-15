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

const generateUniqueFileName = (originalName) => {
    const extensionIndex = originalName.lastIndexOf('.');
    const fileName = originalName.substring(0, extensionIndex);
    const fileExtension = originalName.substring(extensionIndex);
    
    return `${fileName}-${Date.now()}${fileExtension}`;
};

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            const recipeInfo = JSON.parse(req.body.recipeInfo);
            const { majorCategory } = recipeInfo;
            const category = categoryTrans(majorCategory);

            if (file.fieldname === 'recipeImgFile') {
                cb(null, path.join(__dirname, `../../public/Image/RecipeImage/ListImg/${category}`));
            } else if (file.fieldname === 'recipeStepImgFiles') {
                cb(null, path.join(__dirname, `../../public/Image/RecipeImage/InfoImg/step/${category}`));
            }
        },
        filename: function (req, file, cb) {
            const recipeInfo = JSON.parse(req.body.recipeInfo);
            const { majorCategory } = recipeInfo;
            const category = categoryTrans(majorCategory);
            const uniqueName = Buffer.from(generateUniqueFileName(file.originalname), "latin1").toString("utf8");

            if (file.fieldname === 'recipeImgFile') {
                file.newPath = `/Image/RecipeImage/ListImg/${category}/${uniqueName}`;
            } else if (file.fieldname === 'recipeStepImgFiles') {
                file.newPath = `/Image/RecipeImage/InfoImg/step/${category}/${uniqueName}`;
            }

            cb(null, uniqueName);
        }
    }),
    fileFilter: function (req, file, cb) {
        if (!file) {
            return cb(null, false);
        }
        cb(null, true);
    }
}).fields([
    { name: 'recipeImgFile', maxCount: 1 },
    { name: 'recipeStepImgFiles', maxCount: 10 }
]);

module.exports = { upload };