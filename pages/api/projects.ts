import { getProjects } from "@lib/db";
import { auth } from "@lib/firebaseAdmin";
import { NextApiRequest, NextApiResponse } from "next";

const result = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { uid } = await auth.verifyIdToken(req.headers.token as string);
    const { projects } = await getProjects(uid);
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export default result;
