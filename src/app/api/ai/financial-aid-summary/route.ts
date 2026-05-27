import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { nim } from '@/lib/ai/nvidia-nim';
import { formatFinancialAidPrompt } from '@/lib/ai/prompts';
import { guardrails } from '@/lib/ai/guardrails';
import { aiRateLimiter } from '@/lib/ratelimit';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'PARENT') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const identifier = `ai:${user.id}`;
    const rateLimit = await aiRateLimiter.checkLimit(identifier);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many AI requests. Please try again in a minute.', remaining: rateLimit.remaining, resetAt: rateLimit.resetAt },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { documentType, content } = body;

    if (!documentType || !content) {
      return NextResponse.json({ success: false, error: 'Document type and content are required' }, { status: 400 });
    }

    const validTypes = ['fafsa', 'award-letter', 'scholarship'];
    if (!validTypes.includes(documentType)) {
      return NextResponse.json({ success: false, error: 'Invalid document type' }, { status: 400 });
    }

    const safetyCheck = guardrails.checkContent(content);
    if (!safetyCheck.safe) {
      return NextResponse.json({ success: false, error: safetyCheck.reason }, { status: 400 });
    }

    const aiPrompt = formatFinancialAidPrompt(documentType, content);
    const aiResponse = await nim.generate(aiPrompt, { temperature: 0.2, max_tokens: 1024 });

    const summary = guardrails.parseJSONResponse<any>(aiResponse);
    if (!summary) {
      return NextResponse.json({ success: false, error: 'Failed to parse AI response' }, { status: 500 });
    }

    const model = process.env.NVIDIA_NIM_MODEL || 'meta/llama-3.1-70b-instruct';

    await prisma.aIInteraction.create({
      data: { userId: user.id, type: 'financial-aid-summary', prompt: aiPrompt, response: JSON.stringify(summary), model },
    });

    return NextResponse.json({
      success: true,
      summary: {
        keyPoints: summary.keyPoints ?? [],
        importantDeadlines: summary.importantDeadlines ?? [],
        actionItems: summary.actionItems ?? [],
        financialBreakdown: summary.financialBreakdown ?? null,
      },
    });
  } catch (error) {
    console.error('Financial aid summary error:', error);
    return NextResponse.json({ success: false, error: 'Failed to generate summary' }, { status: 503 });
  }
}
