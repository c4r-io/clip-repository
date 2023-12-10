import connectMongoDB from '@/config/connectMongodb';
import VideoClipList from '@/models/videoClipListModel.js';
import filehandler from '@/lib/filehandler';
import { admin, protect } from '@/middleware/authMiddleware';
import User from '@/models/userModel';

// @desc Get videoClipList by id
// @route GET api/videoClipLists/:id
// @acess Privet
export async function GET(req, context) {
  const { params } = context;
  connectMongoDB();
  const videoClipLists = await VideoClipList.findById(params.slug);
  return Response.json({ videoClipLists },{
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// @desc Put videoClipList
// @route PUT api/videoClipLists/:id
// @acess Privet
export async function PUT(req, context) {
  if (
    !(await protect(req))
  ) {

    return Response.json({ mesg: "Not authorized" })
  }
  const { params } = context;
  connectMongoDB();
  const videoClipList = await VideoClipList.findById(params.slug);
  const user = await User.findById(videoClipList.user)
  console.log(req?.user?.userName == user.userName)
  // start if
  if (videoClipList) {

    if (admin(req) || req?.user?.userName == user.userName) {

      // convert to js object
      const body = await req.formData();
      if (body.get('videoTitle')) {
        videoClipList.videoTitle = body.get('videoTitle');
      }
      if (body.get('videoDetailsText')) {
        videoClipList.videoDetailsText = body.get('videoDetailsText');
      }
      if (body.get('videoKeywords')) {
        videoClipList.videoKeywords = body.get('videoKeywords');
      }
      if (
        body.get('thumbnail') &&
        videoClipList.thumbnail !== body.get('thumbnail')
      ) {
        const filename = await filehandler.saveFileAsBinary(body.get('thumbnail'));
        // filehandler.deleteFile(videoClipList.thumbnail);
        videoClipList.thumbnail = filename;
      }
      if (body.get('videoLink')) {
        videoClipList.videoLink = body.get('videoLink');
      }
      if (body.get('nextLink')) {
        videoClipList.nextLink = body.get('nextLink');
      }
      if (body.get('careerStage')) {
        videoClipList.careerStage = body.get('careerStage');
      }
      if (body.get('fieldOfResearch')) {
        videoClipList.fieldOfResearch = body.get('fieldOfResearch');
      }
      if (body.get('institutionSelector')) {
        videoClipList.institutionSelector = body.get('institutionSelector');
      }
      if (body.get('rigorTopic')) {
        videoClipList.rigorTopic = body.get('rigorTopic');
      }
      const updatedVideoClipList = await videoClipList.save();
      return Response.json({ ...updatedVideoClipList._doc });

    } else {
      return Response.json({ mesg: "Not authorized" })
    }
    // end if
  } else {
    return Response.json(
      { message: 'VideoClipList not found' },
      { status: 404 },
    );
  }
}
// @desc Delete videoClipList by id
// @route DELETE api/videoClipLists/:id
// @acess Privet
export async function DELETE(req, context) {
  if (
    !(await protect(req))
  ) {
    return Response.json({ mesg: "Not authorized" })
  }
  const { params } = context;
  connectMongoDB();
  const videoClipLists = await VideoClipList.findById(params.slug);
  if (!admin(req) || req.user._id === videoClipLists.user) {
    return Response.json({ mesg: "Not authorized as admin or specified user" })
  }
  if (videoClipLists) {
    filehandler.deleteFile(videoClipLists.thumbnail);
    await videoClipLists.deleteOne();
    return Response.json({ message: 'VideoClipList removed' });
  } else {
    return Response.json(
      { message: 'VideoClipList not found' },
      { status: 404 },
    );
  }
}
