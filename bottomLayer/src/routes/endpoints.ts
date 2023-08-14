const express = require('express');
const routerBase = express.Router();
const routerPublic = express.Router();
const routerPrivate = express.Router();

const authRoute = require('../routes/authentication.ts');

const userRoute = require('../routes/public/user.ts');
const outfitRoute = require('../routes/public/outfit.ts');
const clothingRoute = require('../routes/public/clothingItem.ts');
const searchRoute = require('../routes/public/search.ts');

const privateUserRoute = require('../routes/private/user.ts');
const privateFollowUserRoute = require('../routes/private/followUser.ts');
const privateOutfitRoute = require('../routes/private/outfit.ts');
const privateClothingRoute = require('../routes/private/clothingItem.ts');

routerBase.use('/', authRoute);

routerPublic.use('/users', userRoute);
routerPublic.use('/outfits', outfitRoute);
routerPublic.use('/clothing_items', clothingRoute);
routerPublic.use('/search', searchRoute);

routerPrivate.use('/users', privateUserRoute, privateFollowUserRoute);
routerPrivate.use('/outfits', privateOutfitRoute);
routerPrivate.use('/clothing_items', privateClothingRoute);

export { routerBase, routerPublic, routerPrivate };