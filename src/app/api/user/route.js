import connectMongoDB from '@/config/connectMongodb.js';
import { admin, protect } from '@/middleware/authMiddleware';
import User from '@/models/userModel.js';
// @desc Get all users
// @route GET api/users
// @acess Privet
export async function GET(req, res) {
  const keywords = {};
  if (
    !(await protect(req))
  ) {
    return Response.json({ mesg: "Not authorized" })
  }
  if (!admin(req)) {
    keywords.userName = req.user.userName
  }
  connectMongoDB();
  const pageSize = Number(req.nextUrl.searchParams.get('pageSize')) || 30;
  const page = Number(req.nextUrl.searchParams.get('pageNumber')) || 1;
  const count = await User.countDocuments({ ...keywords });
  const users = await User.find({ ...keywords })
    .select(['-password'])
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });
  return Response.json({ users, page, pages: Math.ceil(count / pageSize) });
}
// @desc Post user
// @route POST api/users
// @acess Privet
export async function POST(req) {
  const body = await req.json();
  connectMongoDB();
  const createduser = await User.create({
    userName: body.userName,
    password: body.password,
    permission: 'self',
  });
  return Response.json({ ...createduser._doc, password: null });
}
