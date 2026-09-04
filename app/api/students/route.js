import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Check if user is logged in
async function isLoggedIn() {
  const session = await getServerSession(authOptions);
  return session;
}

// GET - Get all students
export async function GET() {
  const session = await isLoggedIn();

  if (!session) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const students = await prisma.student.findMany({
      orderBy: {
        id: "desc",
      },
    });

    return Response.json(students);
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Failed to get students" },
      { status: 500 }
    );
  }
}

// POST - Add student
export async function POST(request) {
  const session = await isLoggedIn();

  if (!session) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    const student = await prisma.student.create({
      data: {
        name: body.name,
        age: Number(body.age),
        gender: body.gender,
        mobile: body.mobile,
        email: body.email,
        department: body.department,
      },
    });

    return Response.json(student, { status: 201 });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Failed to add student" },
      { status: 500 }
    );
  }
}

// PUT - Update student
export async function PUT(request) {
  const session = await isLoggedIn();

  if (!session) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    const student = await prisma.student.update({
      where: {
        id: Number(body.id),
      },
      data: {
        name: body.name,
        age: Number(body.age),
        gender: body.gender,
        mobile: body.mobile,
        email: body.email,
        department: body.department,
      },
    });

    return Response.json(student);
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Failed to update student" },
      { status: 500 }
    );
  }
}

// DELETE - Delete student
export async function DELETE(request) {
  const session = await isLoggedIn();

  if (!session) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    await prisma.student.delete({
      where: {
        id: Number(body.id),
      },
    });

    return Response.json({
      message: "Student deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Failed to delete student" },
      { status: 500 }
    );
  }
}