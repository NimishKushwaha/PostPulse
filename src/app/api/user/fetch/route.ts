import { NextRequest, NextResponse } from "next/server";
import User from "../../../../../models/userModels";
import { dbConnection } from "@/utills/dbConnect";

export const GET = async (request: NextRequest) => {
  const id: string = request.nextUrl.searchParams.get("id") || "";

  try {
    await dbConnection();
    if (id) {
      const user = await User.findById(id);
      return NextResponse.json(
        {
          user,
        },
        { status: 200 }
      );
    }
    const users = await User.find();
    return NextResponse.json(
      {
        users: users,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message,
      },
      { status: 500 }
    );
  }
};
