import generateToken from '@/utils/generateToken.js';
import connectMongoDB from '@/config/connectMongodb.js';
import User from '@/models/userModel.js';
// @desc Post authorize users
// @route POST api/users/login
// @acess Privet
export async function POST(req, context) {
  const body = await req.formData();
  connectMongoDB();
  let user = await User.findOne({ userName:body.get('userName') });
  console.log(user, body.get('userName'), body.get('password'));
  if (user && (await user.matchPassword(body.get('password')))) {
    return Response.json({
      _id: user._id,
      userName: user.userName,
      token: generateToken(user._id),
    });
  } else {
    return Response.json({ error: 'User not found' }, { status: 401 });
  }
}
