import connectMongoDB from '@/config/connectMongodb.js';
import User from '@/models/userModel.js';
import filehandler from '@/lib/filehandler';
import { admin, protect } from '@/middleware/authMiddleware';
// @desc Get user by id
// @route GET api/users/:id
// @acess Privet
export async function GET(req, context) {
  if (
    !(await protect(req))
  ) {
    return Response.json({ mesg: "Not authorized" })
  }
  const { params } = context;
  connectMongoDB();
  const users = await User.findById(params.slug).select(['-password']);
  return Response.json({ users });
}
// @desc Put user
// @route PUT api/users/:id
// @acess Privet
export async function PUT(req, context) {
  const { params } = context;
  if (
    !((await protect(req)))
  ) {
    return Response.json({ mesg: "Not authorized" })
  }
  connectMongoDB();
  const user = await User.findById(params.slug);
  // start if
  if (user) {
    // convert to js object
    const body = await req.formData();
    if (body.get('userName')) {
      user.userName = body.get('userName');
    }
    if (body.get('password')) {
      user.password = body.get('password');
    }
    if (body.get('permission')) {
      if (admin(req)) {
        user.permission = body.get('permission');
      }
    }
    const updatedUser = await user.save();
    return Response.json({ ...updatedUser._doc, password: null });
    // end if
  }
}
// @desc Delete user by id
// @route DELETE api/users/:id
// @acess Privet
export async function DELETE(req, context) {
  const { params } = context;
  if (
    !(await protect(req) && admin(req))
  ) {
    return Response.json({ mesg: "Not authorized" })
  }
  connectMongoDB();
  const users = await User.findById(params.slug);
  if (users) {
    await users.deleteOne();
    return Response.json({ message: 'User removed' });
  } else {
    return Response.json({ message: 'User not found' }, { status: 404 });
  }
}
