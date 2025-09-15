import { NextResponse } from "next/server";
import { Subject } from "@/models";
import { dbConnect } from "@/lib/dbConnect";

// ✅ Create Subject
export async function createSubject(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, message: "Name is required" },
        { status: 400 }
      );
    }

    const exists = await Subject.findOne({ name });
    if (exists) {
      return NextResponse.json(
        { success: false, message: "Subject already exists" },
        { status: 409 }
      );
    }

    const subject = await Subject.create({ name, description });
    return NextResponse.json(
      { success: true, data: subject, message: "Subject created successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// ✅ Get All Subjects
export async function getSubjects() {
  try {
    await dbConnect();
    const subjects = await Subject.find().sort({ createdAt: -1 });
    return NextResponse.json(
      { success: true, data: subjects },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// ✅ Get Subject by ID
export async function getSubjectById(id: string) {
  try {
    await dbConnect();
    const subject = await Subject.findById(id);

    if (!subject) {
      return NextResponse.json(
        { success: false, message: "Subject not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: subject },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// ✅ Update Subject
export async function updateSubject(id: string, req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const subject = await Subject.findByIdAndUpdate(id, body, { new: true });

    if (!subject) {
      return NextResponse.json(
        { success: false, message: "Subject not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: subject, message: "Subject updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// ✅ Delete Subject
export async function deleteSubject(id: string) {
  try {
    await dbConnect();
    const subject = await Subject.findByIdAndDelete(id);

    if (!subject) {
      return NextResponse.json(
        { success: false, message: "Subject not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Subject deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
