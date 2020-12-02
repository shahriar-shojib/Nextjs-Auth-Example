import NextAuth, { InitOptions } from 'next-auth';
import Providers from 'next-auth/providers';

const options = {
	debug: true,
	providers: [
		Providers.Credentials({
			// The name to display on the sign in form (e.g. 'Sign in with...')
			name: 'Credentials',
			// The credentials is used to generate a suitable form on the sign in page.
			// You can specify whatever fields you are expecting to be submitted.
			// e.g. domain, username, password, 2FA token, etc.
			credentials: {
				username: { label: 'Username', type: 'number' },
				password: { label: 'Password', type: 'password' },
			},
			authorize: async credentials => {
				const {username,password} = credentials;
				console.log(username,password);
				const {success,data} = await fetch('http://localhost:6969/v1/auth/login', {
					headers: {
						'content-type': 'application/json'
					},
					method: 'POST',
					body: JSON.stringify({number: username, password})
				}).then(res => res.json());
				

				
				if (success) {
					console.log(data.token);
					// Any user object returned here will be saved in the JSON Web Token
					return Promise.resolve({token: data.token});
				} else {
					return Promise.resolve(null);
				}
			},
		}),
	],
	callbacks: {
    jwt: async (token, user, account, profile, isNewUser) => {
        //  "user" parameter is the object received from "authorize"
        //  "token" is being send below to "session" callback...
        //  ...so we set "user" param of "token" to object from "authorize"...
        //  ...and return it...
        user && (token.user = user);
        return Promise.resolve(token)   // ...here
    },
    session: async (session, user, sessionToken) => {
        //  "session" is current session object
        //  below we set "user" param of "session" to value received from "jwt" callback
        session.user = user.user;
        return Promise.resolve(session)
    }
}
};
export default function (req, res) {
	return NextAuth(req, res, options);
}
