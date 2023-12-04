import connectMongoDB from '@/config/connectMongodb.js';
import { admin, protect } from '@/middleware/authMiddleware';
import VideoClipList from '@/models/videoClipListModel.js';
// @desc Get all videoClipLists
// @route GET api/videoClipLists
// @acess Privet
export async function GET(req, res) {
  let keywords = {};
  const orKeywords = {};
  if (req.nextUrl.searchParams.get('path') == 'dashboard') {
    if (await protect(req)) {
      if (!admin(req) && req.nextUrl.searchParams.get('user')) {
        keywords.user = req.nextUrl.searchParams.get('user');
      } else if (admin(req)) {
      } else {
        return Response.json({
          videoClipLists: [],
          page: 0,
          pages: 0,
        })
      }
    }
  }
  if (req.nextUrl.searchParams.get('videoTitle')) {
    keywords.videoTitle = req.nextUrl.searchParams.get('videoTitle');
  }
  if (req.nextUrl.searchParams.get('careerStage') && JSON.parse(req.nextUrl.searchParams.get('careerStage')).length > 0) {
    console.log("careerStage: ", JSON.parse(req.nextUrl.searchParams.get('careerStage')))
    orKeywords.careerStage = { $in: JSON.parse(req.nextUrl.searchParams.get('careerStage')) }
  }
  if (req.nextUrl.searchParams.get('fieldOfResearch') && JSON.parse(req.nextUrl.searchParams.get('fieldOfResearch')).length > 0) {
    orKeywords.fieldOfResearch = { $in: JSON.parse(req.nextUrl.searchParams.get('fieldOfResearch')) }
  }
  if (req.nextUrl.searchParams.get('institutionSelector') && JSON.parse(req.nextUrl.searchParams.get('institutionSelector')).length > 0) {
    orKeywords.institutionSelector = { $in: JSON.parse(req.nextUrl.searchParams.get('institutionSelector')) }
  }
  if (req.nextUrl.searchParams.get('rigorTopic') && JSON.parse(req.nextUrl.searchParams.get('rigorTopic')).length > 0) {
    orKeywords.rigorTopic = { $in: JSON.parse(req.nextUrl.searchParams.get('rigorTopic')) }
  }
  console.log("or keywords " ,[{ ...orKeywords }])
  if(Object.keys(orKeywords).length > 0){
    keywords = {}
  }
  connectMongoDB();
  const pageSize = Number(req.nextUrl.searchParams.get('pageSize')) || 30;
  const page = Number(req.nextUrl.searchParams.get('pageNumber')) || 1;
  const count = await VideoClipList.countDocuments({ $or: [{ ...orKeywords,...keywords }] });
  const videoClipLists = await VideoClipList.find({ $or: [{ ...orKeywords,...keywords }] })
    .select(['-password'])
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });
  return Response.json({
    videoClipLists,
    page,
    pages: Math.ceil(count / pageSize),
  });
}
// @desc Post videoClipList
// @route POST api/videoClipLists
// @acess Privet
export async function POST(req) {
  if (
    !(await protect(req))
  ) {
    return Response.json({ mesg: "Not authorized" })
  }
  const body = await req.json();
  connectMongoDB();
  const createdvideoClipList = await VideoClipList.create({
    user: req.user._id,
    videoTitle: body.videoTitle,
    videoDetailsText: body.videoDetailsText,
    videoKeywords: body.videoKeywords,
    thumbnail: body.thumbnail,
    videoLink: body.videoLink,
    careerStage: body.careerStage,
    fieldOfResearch: body.fieldOfResearch,
    institutionSelector: body.institutionSelector,
    rigorTopic: body.rigorTopic,
  });
  return Response.json({ ...createdvideoClipList._doc });
}
