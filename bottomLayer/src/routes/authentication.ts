import express from 'express';
import { type Request, type Response, type NextFunction } from 'express';
import passport from 'passport';
import { pool } from '../utils/sqlImport';
import { convertImage } from '../s3/convert-image';
import {
	responseCallbackSignUp,
	responseCallbackLogin,
} from '../utils/responseCallback';
import { hash, compare } from 'bcrypt';
import { type IVerifyOptions, Strategy as LocalStrategy } from 'passport-local';
import { v4 as uuidv4 } from 'uuid';
import { downloadURLFromS3 } from '../s3/download-url-from-s3';

const router = express.Router();

const loginStrate = new LocalStrategy(
	{
		usernameField: 'email',
		passwordField: 'password',
	},
	(
		email: string,
		password: string,
		done: (
			error: any,
			user?: Express.User | false,
			options?: IVerifyOptions
		) => void
	) => {
		const login = async (): Promise<void> => {
			try {
				const result = await pool.query(
					'SELECT * FROM backend_schema.user WHERE email = $1',
					[email]
				);

				if (result.rowCount === 0) {
					done(null, false, { message: 'Invalid Credential, Fault: Email' });
					return;
				}

				const hashedPassword = result.rows[0].password;
				const passwordMatches: boolean = await compare(
					password,
					hashedPassword
				);

				if (!passwordMatches) {
					done(null, false, { message: 'Invalid Credential, Fault: Password' });
					return;
				}

				done(null, result.rows[0]);
			} catch (err) {
				done(err);
			}
		};
		void login();
	}
);

const signupStrate = new LocalStrategy(
	{ passReqToCallback: true },
	(
		req: Request,
		_user: string,
		_pass: string,
		done: (
			error: any,
			user?: Express.User | false,
			options?: IVerifyOptions
		) => void
	) => {
		const {
			first_name,
			last_name,
			email,
			username,
			password,
			private_option,
			profile_picture,
		} = req.body;

		const signup = async (): Promise<void> => {
			try {
				// Can optimize the following awaits to call run them at the same time
				const uid = uuidv4();
				const pp = profile_picture !== undefined ? profile_picture : '';

				const lowercase = async (email: string): Promise<string> => {
					return email.toLowerCase();
				};
				const [imgRef, hashedPass, emailLower] = await Promise.all([
					convertImage(pp, uid, false),
					hash(password, 10),
					lowercase(email),
				]);

				const result = await pool.query(
					`
        INSERT INTO backend_schema.user (
          uid, first_name, last_name, email, username, password, private_option, followers, following, profile_picture
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          `,
					[
						uid,
						first_name,
						last_name,
						emailLower,
						username,
						hashedPass,
						private_option,
						[],
						[],
						imgRef,
					]
				);

				const user = {
					uid,
					first_name,
					last_name,
					email: emailLower,
					username,
					password: hashedPass,
					private_option,
					followers: [],
					following: [],
					profile_picture: imgRef,
				};

				done(null, user);
			} catch (err) {
				done(err);
			}
		};
		void signup();
	}
);

const getUser = async (
	user: any,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const { password, ...userFields } = user;
		const imgRef = userFields.profile_picture;
		userFields.profile_picture = await downloadURLFromS3(imgRef);

		console.log(
			'signin result: ',
			userFields.profile_picture.substring(0, 100)
		);

		responseCallbackLogin(null, userFields, res);
		next();
	} catch (error) {
		responseCallbackLogin(error, '', res);
	}
};

const login = (req: Request, res: Response, next: NextFunction): any => {
	passport.authenticate('login', (err: any, user: any, info: any) => {
		if (err !== null && err !== undefined) {
			return responseCallbackLogin(err, '', res);
		}
		if (info !== null && info !== undefined) {
			return responseCallbackLogin(null, '', res, info.message);
		}
		if (user === null && user === undefined) {
			return responseCallbackLogin(
				null,
				'',
				res,
				'Unknown User Error, User Not Defined'
			);
		}
		req.logIn(user, { session: true }, (err) => {
			if (err !== null && err !== undefined) {
				return responseCallbackLogin(err, '', res);
			}
			void getUser(user, res, next);
		});
	})(req, res, next);
};

const signup = (req: Request, res: Response, next: NextFunction): any => {
	passport.authenticate('signup', (err: any, user: any, info: any) => {
		if (err !== null && err !== undefined) {
			return responseCallbackSignUp(err, '', res);
		}
		if (info !== null && info !== undefined) {
			return responseCallbackSignUp(null, '', res, info.message);
		}
		if (user === null && user === undefined) {
			return responseCallbackSignUp(
				null,
				'',
				res,
				'Unknown User Error, User Not Defined'
			);
		}
		// console.log('signup user: ', user);
		req.logIn(user, { session: true }, (err) => {
			if (err !== null && err !== undefined) {
				return responseCallbackSignUp(err, '', res);
			}
			void getUser(user, res, next);
		});
	})(req, res, next);
};

passport.use('login', loginStrate);
router.post('/login', login);

passport.use('signup', signupStrate);
router.post('/signup', signup);

router.get('/logout', (req: Request, res: Response, next: NextFunction) => {
	req.logOut((err: Error) => {
		if (err !== null && err !== undefined) {
			next(err);
		} else {
			res.send('Logged Out');
		}
	});
});

export { router as default, router as authRoute };
