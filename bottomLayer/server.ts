import {
	routerBase,
	routerPublic,
	routerPrivate,
	routerDev,
} from './src/routes/endpoints';
import session from 'express-session';
import passport from 'passport';
import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import ConnectFileStore from 'session-file-store';
import timeout from 'connect-timeout';

const app = express();

const FileStore = ConnectFileStore(session);
require('dotenv').config();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb' }));
app.use(timeout(20000));

app.use(
	session({
		genid: () => {
			return uuidv4();
		},
		store: new FileStore(), // !!! send this to database for production
		secret: process.env.SESSION_SECRET ?? 'layersSession',
		resave: false,
		cookie: {
			maxAge: Date.now() + 30 * 86400 * 1000, // Sessions last a month from login
			secure: false, // !!! Make this true by once we add HTTPS
		},
		saveUninitialized: false,
	})
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user: any, done) => {
	done(null, user.uid);
});

passport.deserializeUser((user: any, done) => {
	done(null, user);
});

app.use('/', routerBase);
app.use('/api', routerPublic);
app.use('/api/private', routerPrivate);
app.use('/api/dev', routerDev);

app.listen(process.env.PORT, () => {
	if (process.env.PORT == null) {
		return null;
	}

	console.log(`Server is running on port ${process.env.PORT}`);
});
