// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User"; // default export

// ✅ Get all users
export async function getAllUsers() {
  try {
    await dbConnect();
    // Expertise field nahi hai, isliye populate hata diya
    const users = await User.find().select("-password");
    return NextResponse.json({ success: true, data: users });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// ✅ Get user by ID
export async function getUserById(id: string) {
  try {
    await dbConnect();
    const user = await User.findById(id).select("-password");
    if (!user)
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: user });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// ✅ Update user
export async function updateUser(id: string, req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { name, email, password, role, image } = body; // img -> image

    const updateData: any = { name, email, role, image };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updated = await User.findByIdAndUpdate(id, updateData, { new: true }).select("-password");

    if (!updated)
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
