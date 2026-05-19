import jwt from "jsonwebtoken";

const secret =
  process.env.JWT_SECRET ||
  "mysecret";

const refreshSecret =
  process.env.JWT_REFRESH_SECRET ||
  "myrefreshsecret";


// ACCESS TOKEN

export function signJwt(
  payload: string | object | Buffer
): string | undefined {

  try {

    return jwt.sign(
      payload,
      secret,
      {
        expiresIn: "10h"
      }
    );

  } catch (err) {

    console.error(err);

    return undefined;
  }

}


// REFRESH TOKEN

export function signRefreshJwt(
  payload: string | object | Buffer
): string | undefined {

  try {

    return jwt.sign(
      payload,
      refreshSecret,
      {
        expiresIn: "7d"
      }
    );

  } catch (err) {

    console.error(err);

    return undefined;
  }

}


// VERIFY ACCESS TOKEN

export function verifyJwt(
  token: string
): any {

  try {

    return jwt.verify(
      token,
      secret
    );

  } catch (err) {

    console.error(err);

    return null;
  }

}


// VERIFY REFRESH TOKEN

export function verifyRefreshJwt(
  token: string
): any {

  try {

    return jwt.verify(
      token,
      refreshSecret
    );

  } catch (err) {

    console.error(err);

    return null;
  }

}