import generateToken from '@/utils/generateToken.js';
import connectMongoDB from '@/config/connectMongodb.js';
import User from '@/models/userModel.js';
// @desc Post authorize users
// @route POST api/users/login
// @acess Privet
export async function POST(req, context) {
  const body = await req.formData();
  connectMongoDB();
  let user = await User.findOne({ userName: body.get('userName') });
  if (user) {
    return Response.json({ error: 'User already exist' }, { status: 403 });
  } else {
    const user = await User.create({
      userName: body.get('userName'),
      password: body.get('password'),
      permission: 'self'
    });
    return Response.json({
      _id: user._id,
      userName: user.userName,
      token: generateToken(user._id),
    }, { status: 201 });
  }
}
