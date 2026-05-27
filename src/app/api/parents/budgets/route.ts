import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { validateRequest, budgetSchema, updateBudgetSchema } from '@/lib/utils/validators';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'PARENT') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const budgets = await prisma.budget.findMany({
      where: { userId: user.id },
      orderBy: { schoolName: 'asc' },
    });

    // Add calculated fields
    const budgetsWithCalculations = budgets.map((budget) => {
      const totalCost =
        Number(budget.tuitionCost) +
        Number(budget.roomAndBoard) +
        Number(budget.booksAndSupplies) +
        Number(budget.otherExpenses);

      const netCost = totalCost - Number(budget.expectedAid) - Number(budget.scholarships);

      return {
        ...budget,
        totalCost,
        netCost,
      };
    });

    return NextResponse.json({
      success: true,
      data: budgetsWithCalculations,
    });
  } catch (error) {
    console.error('Get budgets error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch budgets' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'PARENT') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validation = validateRequest(budgetSchema, body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.errors.join(', ') },
        { status: 400 }
      );
    }

    const budget = await prisma.budget.create({
      data: {
        userId: user.id,
        ...validation.data,
      },
    });

    return NextResponse.json({
      success: true,
      data: budget,
    }, { status: 201 });
  } catch (error) {
    console.error('Create budget error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create budget' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'PARENT') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Budget ID is required' },
        { status: 400 }
      );
    }

    const validation = validateRequest(updateBudgetSchema, data);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.errors.join(', ') },
        { status: 400 }
      );
    }

    // Verify ownership
    const existingBudget = await prisma.budget.findUnique({
      where: { id },
    });

    if (!existingBudget || existingBudget.userId !== user.id) {
      return NextResponse.json({ success: false, error: 'Budget not found' }, { status: 404 });
    }

    const budget = await prisma.budget.update({
      where: { id },
      data: validation.data,
    });

    return NextResponse.json({
      success: true,
      data: budget,
    });
  } catch (error) {
    console.error('Update budget error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update budget' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'PARENT') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Budget ID is required' },
        { status: 400 }
      );
    }

    // Verify ownership
    const existingBudget = await prisma.budget.findUnique({
      where: { id },
    });

    if (!existingBudget || existingBudget.userId !== user.id) {
      return NextResponse.json({ success: false, error: 'Budget not found' }, { status: 404 });
    }

    await prisma.budget.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Budget deleted successfully',
    });
  } catch (error) {
    console.error('Delete budget error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete budget' },
      { status: 500 }
    );
  }
}