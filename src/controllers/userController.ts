// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { dbConnect } from "@/lib/dbConnect";


// ✅ Get all users
export async function getAllUsers() {
  try {
    await dbConnect();
    const users = await User.find().select("-password").populate("expertise", "name");
    return NextResponse.json({ success: true, data: users });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// ✅ Get user by ID
export async function getUserById(id: string) {
  try {
    await dbConnect();
    const user = await User.findById(id).select("-password").populate("expertise", "name");
    if (!user) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
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
    const { name, email, password, role, expertise, img } = body;

    const updateData: any = { name, email, role, expertise, img };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updated = await User.findByIdAndUpdate(id, updateData, { new: true }).select("-password");

    if (!updated) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// //✅ Delete user
// export async function deleteUser(id: string) {
//   try {
//     await dbConnect();
//     const deleted = await User.findByIdAndDelete(id);
//     if (!deleted) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
//     return NextResponse.json({ success: true, message: "User deleted successfully" });
//   } catch (err: any) {
//     return NextResponse.json({ success: false, message: err.message }, { status: 500 });
//   }
// }
